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
      // Fallback: trust DB value
      return new Response(JSON.stringify({ subscribed: profile?.is_premium ?? false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      await supabaseClient.from("user_profiles").update({ is_premium: false, premium_until: null }).eq("id", user.id);
      return new Response(JSON.stringify({ subscribed: false, platform: "stripe" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      subscriptionEnd = new Date(subscriptions.data[0].current_period_end * 1000).toISOString();
      await supabaseClient.from("user_profiles").update({
        is_premium: true,
        premium_until: subscriptionEnd,
        stripe_customer_id: customerId,
        payment_platform: "stripe",
      }).eq("id", user.id);
    } else {
      await supabaseClient.from("user_profiles").update({
        is_premium: false,
        premium_until: null,
        stripe_customer_id: customerId,
      }).eq("id", user.id);
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
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
