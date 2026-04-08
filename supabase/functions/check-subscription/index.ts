import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    // Fetch profile to determine which payment platform they're on
    const { data: profile } = await supabaseClient
      .from("user_profiles")
      .select("payment_platform, asaas_customer_id, stripe_customer_id, is_premium, premium_until")
      .eq("id", user.id)
      .maybeSingle();

    // === ASAAS path: trust the DB value set by webhook ===
    if (profile?.payment_platform === "asaas" || profile?.asaas_customer_id) {
      const isStillValid = profile?.premium_until
        ? new Date(profile.premium_until) > new Date()
        : false;

      // If expired, revoke premium
      if (!isStillValid && profile?.is_premium) {
        await supabaseClient
          .from("user_profiles")
          .update({ is_premium: false })
          .eq("id", user.id);
      }

      return new Response(JSON.stringify({
        subscribed: isStillValid,
        platform: "asaas",
        subscription_end: profile?.premium_until ?? null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

// === STRIPE path: validate via Stripe API ===
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ 
        subscribed: profile?.is_premium ?? false,
        platform: "stripe-fallback" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const userEmail = user.email.toLowerCase();
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });

    if (customers.data.length === 0) {
      // Don't reset DB here! Just return current DB status
      return new Response(JSON.stringify({ 
        subscribed: profile?.is_premium ?? false, 
        platform: "stripe",
        reason: "no_customer_found"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
    const hasActiveSub = subscriptions.data.length > 0;
    const subscriptionEnd = profile?.premium_until || null;

    const profileData = {
      id: user.id,
      is_premium: hasActiveSub || (profile?.is_premium && (!profile.premium_until || new Date(profile.premium_until) > new Date())),
      premium_until: subscriptionEnd,
      stripe_customer_id: customerId,
      payment_platform: "stripe" as const,
      display_name: profile?.display_name || user.raw_user_meta_data?.full_name || user.raw_user_meta_data?.name || "",
      avatar_url: profile?.avatar_url || user.raw_user_meta_data?.avatar_url || "",
    };

    await supabaseClient.from("user_profiles").upsert(profileData);

    return new Response(JSON.stringify({
      subscribed: profileData.is_premium,
      platform: "stripe",
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
