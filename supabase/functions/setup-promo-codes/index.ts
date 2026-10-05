import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createStripeClient } from "../_shared/stripe.ts";

const CODES = [
  { code: "WELCOME50", name: "$50 off", amount_off: 5000 },
  { code: "SAVE100", name: "$100 off orders $1,000+", amount_off: 10000, min: 100000 },
  { code: "BIGBUILD250", name: "$250 off orders $2,500+", amount_off: 25000, min: 250000 },
  { code: "MONTEREY10", name: "10% off", percent_off: 10 },
  { code: "LOCAL5", name: "5% off", percent_off: 5 },
  { code: "GAMER15", name: "15% off (first order)", percent_off: 15, first: true },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const stripe = createStripeClient("sandbox");
  const out: unknown[] = [];
  for (const c of CODES) {
    const existing = await stripe.promotionCodes.list({ code: c.code, limit: 1 });
    if (existing.data.length) { out.push({ code: c.code, status: "exists" }); continue; }
    const coupon = await stripe.coupons.create({
      name: c.name,
      duration: "once",
      ...(c.amount_off ? { amount_off: c.amount_off, currency: "usd" } : { percent_off: c.percent_off }),
    });
    const restrictions: Record<string, unknown> = {};
    if (c.min) { restrictions.minimum_amount = c.min; restrictions.minimum_amount_currency = "usd"; }
    if (c.first) restrictions.first_time_transaction = true;
    await stripe.promotionCodes.create({
      code: c.code,
      promotion: { type: "coupon", coupon: coupon.id },
      ...(Object.keys(restrictions).length && { restrictions }),
    } as any);
    out.push({ code: c.code, status: "created" });
  }
  return new Response(JSON.stringify(out), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
