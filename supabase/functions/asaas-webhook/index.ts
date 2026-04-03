import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate security token
    const webhookToken = Deno.env.get("ASAAS_WEBHOOK_TOKEN");
    const asaasHeader = req.headers.get("asaas-access-token");
    if (webhookToken && asaasHeader !== webhookToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const payload = await req.json();
    const event = payload.event;

    // Only handle payment confirmation events
    if (!["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED", "PAYMENT_APPROVED_BY_RISK_ANALYSIS"].includes(event)) {
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payment = payload.payment;
    const externalRef = payment?.externalReference; // format: "userId::plan"
    if (!externalRef) {
      return new Response(JSON.stringify({ error: "No externalReference" }), { status: 400 });
    }

    const [userId, plan] = externalRef.split("::");
    if (!userId) throw new Error("Invalid externalReference format");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Calculate premium_until based on plan
    const now = new Date();
    let premiumUntil: Date;
    if (plan === "yearly") {
      premiumUntil = new Date(now.setFullYear(now.getFullYear() + 1));
    } else {
      premiumUntil = new Date(now.setMonth(now.getMonth() + 1));
    }

    const { error } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: userId,
        is_premium: true,
        premium_until: premiumUntil.toISOString(),
        payment_platform: "asaas",
      }, { onConflict: 'id' });

    if (error) throw error;

    console.log(`PRO activated for user ${userId} via Asaas (plan: ${plan})`);

    return new Response(JSON.stringify({ received: true, userId, plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Asaas webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
