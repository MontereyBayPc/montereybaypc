import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { serviceClient } from "../_shared/orders.ts";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });
export const REFUND_WINDOW_MS = 48 * 3600_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { token } = await req.json();
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return json({ error: "Invalid link" }, 404);
    const db = serviceClient();
    const { data: b } = await db.from("build_tracking")
      .select("id, order_ref, created_at, stage, tracking_number, refunded_at, stripe_env, quote_request_id")
      .eq("tracking_token", token).gt("expires_at", new Date().toISOString()).maybeSingle();
    if (!b) return json({ error: "Invalid link" }, 404);
    if (b.refunded_at || b.stage === "refunded") return json({ error: "This order was already refunded." }, 400);
    if (Date.now() - new Date(b.created_at).getTime() > REFUND_WINDOW_MS) return json({ error: "The 48-hour cancellation window has passed. Call (831) 718-7730 for help." }, 400);
    if (b.tracking_number || b.stage === "completed") return json({ error: "Your build has already shipped or been handed off." }, 400);
    if (!b.order_ref?.startsWith("cs_")) return json({ error: "This order can't be refunded online. Call (831) 718-7730." }, 400);

    const envs: StripeEnv[] = b.stripe_env === "live" || b.stripe_env === "sandbox" ? [b.stripe_env] : ["live", "sandbox"];
    let done = false;
    for (const env of envs) {
      try {
        const stripe = createStripeClient(env);
        const session = await stripe.checkout.sessions.retrieve(b.order_ref);
        const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
        if (!pi) continue;
        await stripe.refunds.create({ payment_intent: pi, reason: "requested_by_customer" });
        done = true;
        break;
      } catch (e) {
        console.warn(`Refund attempt (${env}) failed:`, (e as Error).message);
      }
    }
    if (!done) return json({ error: "We couldn't process the refund automatically. Call (831) 718-7730." }, 502);

    await db.from("build_tracking").update({
      stage: "refunded", refunded_at: new Date().toISOString(), scheduled_build_date: null,
      customer_note: "Order cancelled and fully refunded at your request. Refunds usually reach your card in 5-10 business days.",
    }).eq("id", b.id);
    if (b.quote_request_id) await db.from("quote_requests").update({ status: "approved" }).eq("id", b.quote_request_id);
    return json({ ok: true });
  } catch (e) {
    console.error("request-refund error:", e);
    return json({ error: "Something went wrong. Call (831) 718-7730." }, 500);
  }
});
