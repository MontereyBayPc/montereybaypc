import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient } from "./stripe.ts";

export const ORDER_SELECT =
  "id, build_name, tracking_token, stage, customer_note, items, amount_total, fulfillment, created_at, updated_at";

export const serviceClient = () =>
  createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

// Creates (once) the build tracker for a paid Stripe checkout session. Idempotent on order_ref.
export async function ensureOrderTracker(sessionId: string, env: StripeEnv) {
  const db = serviceClient();
  const { data: existing } = await db.from("build_tracking").select(ORDER_SELECT).eq("order_ref", sessionId).maybeSingle();
  if (existing) return existing;

  const stripe = createStripeClient(env);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === "unpaid") return null;
  const lines = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 50 });
  const items = lines.data.map((l) => ({
    name: l.description ?? "Item",
    quantity: l.quantity ?? 1,
    amount: (l.amount_total ?? 0) / 100,
  }));
  const customerName = session.customer_details?.name ?? "";
  const mainItem = items.find((i) => !/delivery|rush/i.test(i.name))?.name ?? items[0]?.name ?? "Order";
  const buildName = customerName ? `${customerName.split(" ")[0]}'s ${mainItem}` : mainItem;

  const { data, error } = await db
    .from("build_tracking")
    .insert({
      order_ref: sessionId,
      build_name: buildName.slice(0, 120),
      customer_name: customerName || null,
      customer_email: session.customer_details?.email ?? null,
      customer_phone: session.customer_details?.phone ?? null,
      items,
      amount_total: (session.amount_total ?? 0) / 100,
      fulfillment: session.metadata?.fulfillment ?? null,
    })
    .select(ORDER_SELECT)
    .single();
  if (error) {
    // Lost a race with the webhook: read the row the other request created.
    const { data: again } = await db.from("build_tracking").select(ORDER_SELECT).eq("order_ref", sessionId).maybeSingle();
    return again;
  }
  return data;
}
