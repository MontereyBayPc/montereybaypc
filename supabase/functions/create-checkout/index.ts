import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { shippingZoneForZip } from "../_shared/shipping.ts";
import { serviceClient } from "../_shared/orders.ts";

type LineItemInput = { priceId: string; quantity: number };
type Fulfillment = "pickup" | "delivery" | "shipping";

async function createCheckoutSession(options: {
  items: LineItemInput[];
  fulfillment: Fulfillment;
  shipZip: string | null;
  returnUrl: string;
  environment: StripeEnv;
  quote?: { id: string; total: number } | null;
}) {
  const stripe = createStripeClient(options.environment);
  const includeDelivery = options.fulfillment === "delivery";
  const shipZone = options.fulfillment === "shipping" ? shippingZoneForZip(options.shipZip ?? "") : null;
  if (options.fulfillment === "shipping" && !shipZone) throw new Error("Enter a valid 5-digit US ZIP code for shipping");

  const priceIds = [...options.items.map((i) => i.priceId)];
  if (includeDelivery) priceIds.push("local_delivery");

  const prices = await stripe.prices.list({
    lookup_keys: priceIds,
    limit: 100,
  });
  const priceByLookup = new Map(prices.data.map((p) => [p.lookup_key!, p]));

  // deno-lint-ignore no-explicit-any
  const line_items: any[] = options.quote ? [{
    price_data: { currency: "usd", product_data: { name: "Approved Custom PC Build" }, unit_amount: Math.round(options.quote.total * 100) },
    quantity: 1,
  }] : options.items.map((i) => {
    const p = priceByLookup.get(i.priceId);
    if (!p) throw new Error(`Price not found: ${i.priceId}`);
    return { price: p.id, quantity: i.quantity };
  });

  const isSubscription = options.items.some((i) => {
    const p = priceByLookup.get(i.priceId);
    return p?.type === "recurring";
  });

  if (isSubscription && (options.items.length > 1 || options.fulfillment !== "pickup")) {
    throw new Error("Subscription checkout supports a single item and no delivery");
  }

  if (includeDelivery) {
    const p = priceByLookup.get("local_delivery");
    if (!p) throw new Error("Delivery price not found");
    line_items.push({ price: p.id, quantity: 1 });
  }
  if (shipZone) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: `Insured US Shipping (${shipZone.label}, ZIP ${options.shipZip})` },
        unit_amount: shipZone.price * 100,
      },
      quantity: 1,
    });
  }

  const baseParams = {
    line_items,
    mode: isSubscription ? "subscription" : "payment",
    ui_mode: "embedded_page",
    return_url: options.returnUrl,
    phone_number_collection: { enabled: true },
    allow_promotion_codes: true,
    ...(options.fulfillment !== "pickup" && !isSubscription && {
      shipping_address_collection: { allowed_countries: ["US"] },
    }),
    ...(!isSubscription && {
      payment_intent_data: {
        description: options.quote ? "Monterey Bay PC order - approved custom build" : `Monterey Bay PC order - ${options.items
          .map((i) => `${i.priceId} x${i.quantity}`)
          .join(", ")}`,
      },
    }),
    metadata: {
      fulfillment: isSubscription
        ? "subscription"
        : options.fulfillment === "shipping"
          ? "us_shipping"
          : includeDelivery
            ? "local_delivery"
            : "local_pickup",
      ...(options.quote && { quote_request_id: options.quote.id }),
      ...(shipZone && { ship_zip: options.shipZip!, ship_zone: shipZone.key }),
    },
  } as const;

  let session;
  try {
    // deno-lint-ignore no-explicit-any
    session = await stripe.checkout.sessions.create({ ...baseParams, automatic_tax: { enabled: true } } as any);
  } catch (e) {
    const msg = (e as Error).message?.toLowerCase() ?? "";
    if (msg.includes("head office") || msg.includes("automatic tax") || msg.includes("tax")) {
      console.warn("Automatic tax unavailable, retrying without it:", (e as Error).message);
      // deno-lint-ignore no-explicit-any
      session = await stripe.checkout.sessions.create({ ...baseParams, automatic_tax: { enabled: false } } as any);
    } else {
      throw e;
    }
  }

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
    let quote: { id: string; total: number } | null = null;
    if (typeof body?.quoteToken === "string") {
      if (!/^[a-f0-9]{64}$/.test(body.quoteToken)) throw new Error("Invalid quote link");
      const { data: q } = await serviceClient().from("quote_requests").select("id, status, approved_total").eq("payment_token", body.quoteToken).maybeSingle();
      if (!q || q.status !== "approved" || !q.approved_total) throw new Error("This quote is not ready for payment");
      quote = { id: q.id, total: Number(q.approved_total) };
    }
    const items: LineItemInput[] = quote ? [] : Array.isArray(body?.items) ? body.items : [];
    if (!items.length && !quote) throw new Error("No items");
    for (const i of items) {
      if (!/^[a-zA-Z0-9_-]+$/.test(i.priceId)) throw new Error("Invalid priceId");
      if (!Number.isInteger(i.quantity) || i.quantity < 1) throw new Error("Invalid quantity");
      if (i.priceId === "the_beast" && i.quantity !== 1) throw new Error("Only one Beast is available");
      if (i.priceId === "rush_build" && i.quantity !== 1) throw new Error("Rush build can only be added once");
    }
    const env: StripeEnv = body.environment === "live" ? "live" : "sandbox";

    // Only send buyers back to our own site after paying.
    let returnUrl: string;
    try {
      const u = new URL(String(body.returnUrl ?? ""));
      const allowed = u.protocol === "https:" && (
        u.hostname === "montereybaypcs.com" ||
        u.hostname === "www.montereybaypcs.com" ||
        u.hostname.endsWith(".lovable.app") ||
        u.hostname.endsWith(".lovableproject.com")
      );
      const local = u.protocol === "http:" && u.hostname === "localhost";
      if (!(allowed || local) || u.pathname !== "/checkout/return") throw new Error();
      returnUrl = `${u.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`;
    } catch {
      throw new Error("Invalid return URL");
    }

    const clientSecret = await createCheckoutSession({
      items,
      fulfillment: body.fulfillment === "shipping"
        ? body.fulfillment
        : "pickup",
      shipZip: typeof body.shipZip === "string" ? body.shipZip.trim() : null,
      returnUrl,
      environment: env,
      quote,
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
