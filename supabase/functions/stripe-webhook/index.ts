import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const stripe = new Stripe(stripeKey, { apiVersion: "2024-04-10" });

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing Stripe event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;

      if (userId) {
        // Activate PRO
        const { error } = await supabaseAdmin
          .from("user_profiles")
          .upsert({
            id: userId,
            is_premium: true,
            stripe_customer_id: customerId,
            payment_platform: "stripe",
            premium_until: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
          }, { onConflict: 'id' });

        if (error) console.error("Error updating profile (checkout):", error);
        else console.log(`PRO activated for user ${userId}`);
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const premiumUntil = new Date(subscription.current_period_end * 1000).toISOString();

        const { error } = await supabaseAdmin
          .from("user_profiles")
          .update({
            is_premium: true,
            premium_until: premiumUntil,
          })
          .eq("stripe_customer_id", customerId);

        if (error) console.error("Error updating profile (invoice):", error);
        else console.log(`PRO renewed for customer ${customerId}`);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      const { error } = await supabaseAdmin
        .from("user_profiles")
        .update({
          is_premium: false,
          premium_until: null,
        })
        .eq("stripe_customer_id", customerId);

      if (error) console.error("Error updating profile (cancel):", error);
      else console.log(`PRO deactivated for customer ${customerId}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
