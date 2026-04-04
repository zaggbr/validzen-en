import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  console.log(`--- Checkout Request: ${req.method} ---`);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !stripeKey) {
    console.error("Missing config:", { url: !!supabaseUrl, key: !!supabaseAnonKey, stripe: !!stripeKey });
    return new Response(JSON.stringify({ error: "Missing environment configuration" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");
    
    console.log("Verifying user...");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      throw new Error("Usuário não autenticado");
    }
    console.log(`User: ${user.email} (${user.id})`);

    const body = await req.json().catch(() => ({}));
    const { priceId } = body;
    console.log(`Price ID received: ${priceId}`);

    if (!priceId) throw new Error("priceId is required");

    const stripe = new Stripe(stripeKey); 

    console.log("Searching for existing customer in Stripe...");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId = customers.data.length > 0 ? customers.data[0].id : undefined;
    console.log(`Customer ID: ${customerId || "New Customer"}`);

    const origin = req.headers.get("origin") || "https://validzen.pages.dev";
    console.log(`Origin: ${origin}`);

    console.log("Creating checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${origin}/pt?checkout=success`,
      cancel_url: `${origin}/pt/pro?checkout=canceled`,
      metadata: {
        userId: user.id,
      },
    });

    console.log("Session created successfully!");
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("DEBUG ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
