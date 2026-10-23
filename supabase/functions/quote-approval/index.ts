import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { serviceClient } from "../_shared/orders.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const randomToken = () => {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await req.json();
    const db = serviceClient();

    // Public: customer reads an approved quote by its private payment token.
    if (body?.action === "get") {
      const token = String(body.token ?? "");
      if (!/^[a-f0-9]{64}$/.test(token)) return json({ error: "Invalid link" }, 400);
      const { data } = await db.from("quote_requests")
        .select("name, parts, approved_total, approved_at, status")
        .eq("payment_token", token).maybeSingle();
      if (!data || !["approved", "paid"].includes(data.status)) return json({ error: "Quote not found" }, 404);
      return json({ name: data.name.split(" ")[0], parts: data.parts, total: Number(data.approved_total), paid: data.status === "paid" });
    }

    // Staff only: approve a quote at a confirmed total.
    if (body?.action === "approve") {
      const auth = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
      const anon = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");
      const { data: u } = await anon.auth.getUser(auth);
      if (!u?.user) return json({ error: "Sign in required" }, 401);
      const { data: isAdmin } = await db.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      if (!isAdmin) return json({ error: "Not allowed" }, 403);

      const id = String(body.id ?? "");
      const total = Number(body.total);
      if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: "Invalid quote" }, 400);
      if (!Number.isFinite(total) || total < 1 || total > 50000) return json({ error: "Enter a total between $1 and $50,000" }, 400);

      const { data: existing } = await db.from("quote_requests").select("payment_token, status").eq("id", id).maybeSingle();
      if (!existing) return json({ error: "Quote not found" }, 404);
      if (existing.status === "paid") return json({ error: "Quote is already paid" }, 400);
      const token = existing.payment_token ?? randomToken();
      const { error } = await db.from("quote_requests").update({
        status: "approved", approved_total: Math.round(total * 100) / 100,
        approved_at: new Date().toISOString(), payment_token: token,
      }).eq("id", id);
      if (error) throw error;
      return json({ token });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("quote-approval error:", e);
    return json({ error: "Something went wrong" }, 500);
  }
});
