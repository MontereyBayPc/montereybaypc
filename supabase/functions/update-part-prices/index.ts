import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const BATCH = 8;
const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function extractPrices(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(/\$\s?(\d{1,2},?\d{3}|\d{2,4})(\.\d{2})?/g)) {
    out.push(parseFloat(m[1].replace(",", "") + (m[2] ?? "")));
  }
  return out;
}

const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const fcKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!lovableKey || !fcKey) return json({ error: "Price lookup is not configured" }, 500);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Paused-state guard + single-flight lock
  const { data: state } = await db.from("price_job_state").select("*").eq("id", 1).single();
  if (state?.paused_reason) return json({ skipped: "paused", reason: state.paused_reason });
  const now = new Date();
  const { data: locked } = await db
    .from("price_job_state")
    .update({ locked_until: new Date(now.getTime() + 5 * 60_000).toISOString(), last_run_at: now.toISOString() })
    .eq("id", 1)
    .or(`locked_until.is.null,locked_until.lt.${now.toISOString()}`)
    .select();
  if (!locked?.length) return json({ skipped: "already running" });

  const results: Record<string, unknown>[] = [];
  let rateLimited = 0;
  try {
    const { data: parts } = await db
      .from("parts")
      .select("id,name,base_price,price")
      .eq("active", true)
      .order("last_checked_at", { ascending: true, nullsFirst: true })
      .limit(BATCH);

    for (const p of parts ?? []) {
      const res = await fetch(`${GATEWAY}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": fcKey,
        },
        body: JSON.stringify({ query: `${p.name} price USD`, limit: 6, country: "us" }),
      });

      if (res.status === 402 || res.status === 403) {
        const body = await res.text();
        await db.from("price_job_state").update({ paused_reason: `[${res.status}] ${body.slice(0, 300)}` }).eq("id", 1);
        results.push({ name: p.name, error: res.status });
        break;
      }
      if (res.status === 429) {
        if (++rateLimited >= 2) break;
        continue;
      }
      await db.from("parts").update({ last_checked_at: new Date().toISOString() }).eq("id", p.id);
      if (!res.ok) {
        results.push({ name: p.name, error: res.status });
        continue;
      }
      const data = await res.json();
      const hits = (data?.data?.web ?? data?.data ?? []) as { title?: string; description?: string; url?: string }[];
      const base = Number(p.base_price);
      const found: { price: number; url?: string }[] = [];
      for (const h of hits) {
        for (const v of extractPrices(`${h.title ?? ""} ${h.description ?? ""}`)) {
          if (v >= base * 0.5 && v <= base * 2) found.push({ price: v, url: h.url });
        }
      }
      if (!found.length) {
        results.push({ name: p.name, updated: false });
        continue;
      }
      const m = median(found.map((f) => f.price));
      const src = found.find((f) => f.price === m)?.url ?? null;
      await db
        .from("parts")
        .update({ price: Math.round(m), price_source: src, price_updated_at: new Date().toISOString() })
        .eq("id", p.id);
      results.push({ name: p.name, updated: true, price: Math.round(m) });
    }
  } finally {
    await db.from("price_job_state").update({ locked_until: null }).eq("id", 1);
  }
  return json({ results });
});
