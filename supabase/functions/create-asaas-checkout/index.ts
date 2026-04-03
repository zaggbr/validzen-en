import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ASAAS_API_URL = "https://api.asaas.com/v3";

serve(async (req) => {
  console.log(`--- Request Start: ${req.method} ---`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const asaasKey = Deno.env.get("ASAAS_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !asaasKey) {
      throw new Error("Missing environment variables (SUPABASE_URL, SERVICE_KEY or ASAAS_KEY)");
    }

    // 1. Get User from Token (Manual Fetch to be lightweight)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    console.log("Verifying user token...");
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        "Authorization": authHeader,
        "apikey": supabaseServiceKey,
      },
    });

    if (!userRes.ok) {
      const errorData = await userRes.json();
      console.error("Auth verification failed:", errorData);
      throw new Error("Usuário não autenticado ou token expirado");
    }

    const user = await userRes.json();
    console.log(`User verified: ${user.email} (${user.id})`);

    // 2. Parse Body
    const { plan } = await req.json().catch(() => ({}));
    if (!plan) throw new Error("Plano não informado");

    // 3. Get/Create Profile (Manual Fetch to PostgREST)
    console.log("Checking user profile in DB...");
    const profileRes = await fetch(`${supabaseUrl}/rest/v1/user_profiles?id=eq.${user.id}&select=asaas_customer_id,display_name`, {
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
    });

    const profiles = await profileRes.json();
    const profile = profiles[0];
    let asaasCustomerId = profile?.asaas_customer_id;

    if (!asaasCustomerId) {
      console.log("Customer not found. Creating in Asaas...");
      const customerCreateRes = await fetch(`${ASAAS_API_URL}/customers`, {
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

      const customerData = await customerCreateRes.json();
      if (!customerCreateRes.ok) {
        console.error("Asaas Error (Customer):", customerData);
        throw new Error(`Asaas: ${customerData.errors?.[0]?.description || "Erro ao criar cliente"}`);
      }

      asaasCustomerId = customerData.id;
      console.log(`Customer created: ${asaasCustomerId}. Updating DB...`);

      // Upsert profile in DB
      await fetch(`${supabaseUrl}/rest/v1/user_profiles`, {
        method: "POST",
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          id: user.id,
          asaas_customer_id: asaasCustomerId,
          payment_platform: "asaas"
        }),
      });
    }

    // 4. Create Payment Link
    console.log(`Creating payment link for plan: ${plan}...`);
    const origin = req.headers.get("origin") || "https://validzen.pages.dev";
    const planValue = 14.9;
    const planLabel = plan === "monthly" ? "ValidZen PRO — Mensal" : "ValidZen PRO — Anual";
    const billingType = plan === "monthly" ? "MONTHLY" : "YEARLY";

    const linkRes = await fetch(`${ASAAS_API_URL}/paymentLinks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": asaasKey,
      },
      body: JSON.stringify({
        name: planLabel,
        description: "Acesso PRO ao ValidZen",
        value: planValue,
        billingType: "UNDEFINED",
        chargeType: "RECURRENT",
        subscriptionCycle: billingType,
        dueDateLimitDays: 3, // Adicionado para resolver o erro de vencimento
        redirectLink: `${origin}/pt/dashboard?checkout=success`,
        customer: asaasCustomerId,
        externalReference: `${user.id}::${plan}`,
      }),
    });

    const linkData = await linkRes.json();
    if (!linkRes.ok) {
      console.error("Asaas Error (Link):", linkData);
      throw new Error(`Asaas: ${linkData.errors?.[0]?.description || "Erro ao criar link"}`);
    }

    console.log("Success! Link created.");
    return new Response(JSON.stringify({ url: linkData.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
