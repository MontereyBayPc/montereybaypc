import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { ensureOrderTracker } from "../_shared/orders.ts";

const schema = z.object({
  sessionId: z.string().regex(/^cs_(test|live)_[A-Za-z0-9]{10,200}$/),
});
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Order not found." }, 404);
    const env = parsed.data.sessionId.startsWith("cs_live_") ? "live" : "sandbox";
    const order = await ensureOrderTracker(parsed.data.sessionId, env);
    if (!order) return json({ pending: true });
    return json({
      order: {
        name: order.build_name,
        stage: order.stage,
        note: order.customer_note,
        items: order.items,
        total: order.amount_total,
        fulfillment: order.fulfillment,
        token: order.tracking_token,
      },
    });
  } catch (e) {
    console.error("get-order-status error:", e);
    return json({ error: "Order details are temporarily unavailable." }, 503);
  }
});
