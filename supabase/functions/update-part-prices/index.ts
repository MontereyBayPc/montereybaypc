import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

import { consensusPrice, type Hit } from "../_shared/price-consensus.ts";

const BATCH = 200; // once-daily run checks every active part
const CONCURRENCY = 2;
const TIME_BUDGET_MS = 110_000; // stay under the function time limit; next run continues
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


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const fcKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!lovableKey || !fcKey) return json({ error: "Price lookup is not configured" }, 500);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Paused-state guard + single-flight lock
  const { data: state } = await db.from("price_job_state").select("*").eq("id", 1).single();
  const token = req.headers.get("x-cron-token") ?? "";
  if (!state?.cron_token || token !== state.cron_token) return json({ error: "Unauthorized" }, 401);
  // Out-of-credit pauses retry automatically after 6 hours.
  const pausedRecently = state?.last_run_at && Date.now() - new Date(state.last_run_at).getTime() < 6 * 3600_000;
  if (state?.paused_reason && pausedRecently) return json({ skipped: "paused", reason: state.paused_reason });
  if (state?.paused_reason) await db.from("price_job_state").update({ paused_reason: null }).eq("id", 1);
  const now = new Date();
  const { data: locked } = await db
    .from("price_job_state")
    .update({ locked_until: new Date(now.getTime() + 10 * 60_000).toISOString(), last_run_at: now.toISOString() })
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

    let stop = false;
    const queue = [...(parts ?? [])];
    const worker = async () => {
    while (queue.length && !stop && Date.now() - now.getTime() < TIME_BUDGET_MS) {
      const p = queue.shift()!;
      const res = await fetch(`${GATEWAY}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": fcKey,
        },
        body: JSON.stringify({ query: `${p.name} price newegg amazon bestbuy microcenter`, limit: 10, country: "us" }),
      });

      if (res.status === 402 || res.status === 403) {
        const body = await res.text();
        await db.from("price_job_state").update({ paused_reason: `[${res.status}] ${body.slice(0, 300)}` }).eq("id", 1);
        results.push({ name: p.name, error: res.status });
        stop = true;
        break;
      }
      if (res.status === 429) {
        if (++rateLimited >= 20) stop = true;
        queue.push(p);
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }
      await db.from("parts").update({ last_checked_at: new Date().toISOString() }).eq("id", p.id);
      if (!res.ok) {
        results.push({ name: p.name, error: res.status });
        continue;
      }
      const data = await res.json();
      const hits = (data?.data?.web ?? data?.data ?? []) as { title?: string; description?: string; url?: string }[];
      const base = Math.max(Number(p.base_price), Number(p.price));
      const found: Hit[] = [];
      for (const h of hits) {
        for (const v of extractPrices(`${h.title ?? ""} ${h.description ?? ""}`)) {
          if (v >= base * 0.5 && v <= base * 3) found.push({ price: v, url: h.url });
        }
      }
      const c = consensusPrice(found, Number(p.price));
      if (c.price === null) {
        results.push({ name: p.name, updated: false, reason: c.reason });
        continue;
      }
      await db
        .from("parts")
        .update({ price: c.price, price_source: c.sources.join(" | "), price_updated_at: new Date().toISOString() })
        .eq("id", p.id);
      results.push({ name: p.name, updated: true, price: c.price, sources: c.sources.length });
    }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  } finally {
    await db.from("price_job_state").update({ locked_until: null }).eq("id", 1);
  }
  return json({ results });
});
