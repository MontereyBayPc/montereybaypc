import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

type LineItemInput = { priceId: string; quantity: number };

async function createCheckoutSession(options: {
  items: LineItemInput[];
  includeDelivery: boolean;
  returnUrl: string;
  environment: StripeEnv;
}) {
  const stripe = createStripeClient(options.environment);

  const priceIds = [...options.items.map((i) => i.priceId)];
  if (options.includeDelivery) priceIds.push("local_delivery");

  // Resolve human-readable price IDs to Stripe price objects via lookup_keys.
  const prices = await stripe.prices.list({
    lookup_keys: priceIds,
    limit: 100,
  });
  const priceByLookup = new Map(prices.data.map((p) => [p.lookup_key!, p]));

  const line_items = options.items.map((i) => {
    const p = priceByLookup.get(i.priceId);
    if (!p) throw new Error(`Price not found: ${i.priceId}`);
    return { price: p.id, quantity: i.quantity };
  });

  if (options.includeDelivery) {
    const p = priceByLookup.get("local_delivery");
    if (!p) throw new Error("Delivery price not found");
    line_items.push({ price: p.id, quantity: 1 });
  }

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    ui_mode: "embedded_page",
    return_url: options.returnUrl,
    payment_intent_data: {
      description: `Monterey Bay PC order — ${options.items
        .map((i) => `${i.priceId} x${i.quantity}`)
        .join(", ")}`,
    },
  });

  return session.client_secret;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const items: LineItemInput[] = Array.isArray(body?.items) ? body.items : [];
    if (!items.length) throw new Error("No items");
    for (const i of items) {
      if (!/^[a-zA-Z0-9_-]+$/.test(i.priceId)) throw new Error("Invalid priceId");
      if (!Number.isInteger(i.quantity) || i.quantity < 1) throw new Error("Invalid quantity");
    }
    const env: StripeEnv = body.environment === "live" ? "live" : "sandbox";

    const clientSecret = await createCheckoutSession({
      items,
      includeDelivery: !!body.includeDelivery,
      returnUrl: body.returnUrl,
      environment: env,
    });

    return new Response(JSON.stringify({ clientSecret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("create-checkout error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
