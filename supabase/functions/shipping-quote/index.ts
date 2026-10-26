import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { shippingQuoteForZip } from "../_shared/shippo-quote.ts";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { zip } = await req.json();
    if (typeof zip !== "string" || !/^\d{5}$/.test(zip)) return json({ error: "Enter a valid 5-digit ZIP" }, 400);
    const q = await shippingQuoteForZip(zip);
    if (!q) return json({ error: "Enter a valid 5-digit ZIP" }, 400);
    return json(q);
  } catch {
    return json({ error: "Could not price shipping" }, 400);
  }
});
