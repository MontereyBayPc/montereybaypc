import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { PDFDocument } from 'npm:pdf-lib@1.17.1';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const money = z.number().min(0).max(1000000).nullable();
const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('costs'), id: z.string().uuid(), parts_cost: money, labor_cost: money, other_cost: money, net_revenue: money }),
  z.object({ action: z.literal('parts') }),
  z.object({ action: z.literal('part-cost'), id: z.string().uuid(), cost: money }),
  z.object({ action: z.literal('labels'), ids: z.array(z.string().uuid()).min(1).max(25) }),
  z.object({ action: z.literal('hold'), id: z.string().uuid(), reason: z.string().trim().min(1).max(1000), until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }),
  z.object({ action: z.literal('release'), id: z.string().uuid() }),
]);
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const db = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const { data: auth } = await db.auth.getUser(token);
    if (!auth.user) return json({ error: 'Staff sign in required.' }, 401);
    const { data: admin } = await db.rpc('has_role', { _user_id: auth.user.id, _role: 'admin' });
    if (!admin) return json({ error: 'Staff access required.' }, 403);
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: 'Check the entered details.' }, 400);
    const p = parsed.data;
    if (p.action === 'parts') {
      const { data, error } = await db.from('parts').select('id,name,category,base_price,price,cost_override').eq('active', true).order('sort').order('name').order('id');
      if (error) throw error; return json({ parts: data });
    }
    if (p.action === 'part-cost') {
      const { error } = await db.from('parts').update({ cost_override: p.cost }).eq('id', p.id);
      if (error) throw error; return json({ ok: true });
    }
    if (p.action === 'labels') {
      const { data: builds, error } = await db.from('build_tracking').select('id,label_url').in('id', p.ids);
      if (error) throw error;
      if (builds?.length !== p.ids.length || builds.some(b => !b.label_url)) return json({ error: 'Every selected order needs a purchased label first.' }, 400);
      const pdf = await PDFDocument.create();
      for (const id of p.ids) {
        const build = builds.find(b => b.id === id);
        const url = new URL(build?.label_url ?? '');
        if (url.protocol !== 'https:' || !(url.hostname.endsWith('.goshippo.com') || url.hostname === 'goshippo.com' || url.hostname.endsWith('.amazonaws.com'))) return json({ error: 'This label host is not supported.' }, 400);
        const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'error' });
        if (!response.ok) return json({ error: 'Label expired or unavailable. Please try again.' }, 502);
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length > 5000000 || new TextDecoder().decode(bytes.slice(0,5)) !== '%PDF-') return json({ error: 'The carrier label is not a PDF.' }, 502);
        const source = await PDFDocument.load(bytes);
        const pages = await pdf.copyPages(source, source.getPageIndices()); pages.forEach(page => pdf.addPage(page));
      }
      const bytes = await pdf.save();
      return new Response(bytes, { headers: { ...corsHeaders, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="shipping-labels-4x6.pdf"', 'Cache-Control': 'no-store' } });
    }
    const { data: build, error: lookup } = await db.from('build_tracking').select('*').eq('id', p.id).maybeSingle();
    if (lookup) throw lookup; if (!build) return json({ error: 'Order not found.' }, 404);
    if (p.action === 'costs') {
      const { action, id, ...values } = p;
      const { data, error } = await db.from('build_tracking').update(values).eq('id', id).select().single();
      if (error) throw error; return json({ build: data });
    }
    if (build.stage === 'refunded' || build.stage === 'completed' || build.workshop_status === 'shipped' || ['TRANSIT','DELIVERED'].includes(build.carrier_status)) return json({ error: 'This order can no longer be held.' }, 409);
    if (p.action === 'hold') {
      const day = new Date(`${p.until}T12:00:00Z`);
      if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0,10) !== p.until || p.until < new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }) || (build.scheduled_build_date && p.until < build.scheduled_build_date)) return json({ error: 'Choose a revised date on or after today and the build date.' }, 400);
      const { data, error } = await db.from('build_tracking').update({ held_at: build.held_at ?? new Date().toISOString(), hold_previous_status: build.hold_previous_status ?? build.workshop_status, hold_reason: p.reason, hold_until: p.until, workshop_status: 'blocked', planned_ship_date: p.until, customer_note: `Order on hold: ${p.reason}\nRevised estimated handoff date: ${p.until}.` }).eq('id', p.id).select().single();
      if (error) throw error; return json({ build: data, email_sent: false });
    }
    const { data, error } = await db.from('build_tracking').update({ held_at: null, hold_reason: null, hold_until: null, hold_previous_status: null, workshop_status: build.hold_previous_status ?? 'queued', customer_note: 'Your order hold has been released. Work is resuming; your revised handoff date remains an estimate.' }).eq('id', p.id).select().single();
    if (error) throw error; return json({ build: data });
  } catch { return json({ error: 'Workshop action could not be completed. Please try again.' }, 503); }
});