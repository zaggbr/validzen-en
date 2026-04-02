import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ASAAS_API_URL = "https://api.asaas.com/v3";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user?.email) throw new Error("Usuário não autenticado");

    const { plan } = await req.json();
    if (!plan || !["monthly", "yearly"].includes(plan)) {
      throw new Error("Plano inválido. Use 'monthly' ou 'yearly'");
    }

    const asaasKey = Deno.env.get("ASAAS_API_KEY");
    if (!asaasKey) throw new Error("ASAAS_API_KEY não configurada");

    // Check if customer already exists
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("asaas_customer_id, display_name")
      .eq("id", user.id)
      .maybeSingle();

    let asaasCustomerId = profile?.asaas_customer_id;

    // Create customer if not exists
    if (!asaasCustomerId) {
      const customerRes = await fetch(`${ASAAS_API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access_token": asaasKey,
        },
        body: JSON.stringify({
          name: profile?.display_name || user.email,
          email: user.email,
          externalReference: user.id,
        }),
      });

      if (!customerRes.ok) {
        const err = await customerRes.json();
        throw new Error(`Erro ao criar cliente Asaas: ${JSON.stringify(err)}`);
      }

      const customer = await customerRes.json();
      asaasCustomerId = customer.id;

      // Save customer ID
      await supabaseAdmin
        .from("user_profiles")
        .update({ asaas_customer_id: asaasCustomerId, payment_platform: "asaas" })
        .eq("id", user.id);
    }

    const origin = req.headers.get("origin") || "https://validzen.pages.dev";
    const planValue = plan === "monthly" ? 14.9 : 14.9;
    const planLabel = plan === "monthly" ? "ValidZen PRO — Mensal" : "ValidZen PRO — Anual (Promoção)";
    const billingType = plan === "monthly" ? "MONTHLY" : "YEARLY";

    // Create payment link
    const linkRes = await fetch(`${ASAAS_API_URL}/paymentLinks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": asaasKey,
      },
      body: JSON.stringify({
        name: planLabel,
        description: "Acesso PRO ao ValidZen — The Meaning Crisis Project",
        endDate: null,
        value: planValue,
        billingType: "UNDEFINED", // Allows PIX, card, boleto
        chargeType: "RECURRENT",
        subscriptionCycle: billingType,
        redirectLink: `${origin}/pt/dashboard?checkout=success`,
        customer: asaasCustomerId,
        externalReference: `${user.id}::${plan}`,
        fine: { value: 2 },
        interest: { value: 1 },
      }),
    });

    if (!linkRes.ok) {
      const err = await linkRes.json();
      throw new Error(`Erro ao criar link Asaas: ${JSON.stringify(err)}`);
    }

    const link = await linkRes.json();

    return new Response(JSON.stringify({ url: link.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Asaas checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
