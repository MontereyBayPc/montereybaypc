import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { carrierFromProvider } from '../_shared/carrier.ts';

const GATEWAY = 'https://connector-gateway.lovable.dev/udc_shippo';
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const db = () => createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

const addressSchema = z.object({
  name: z.string().trim().min(1).max(100), street1: z.string().trim().min(1).max(120), street2: z.string().max(120).optional().default(''),
  city: z.string().trim().min(1).max(80), state: z.string().trim().length(2), zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/),
  phone: z.string().trim().min(7).max(30), email: z.string().email().max(255),
});
const parcelSchema = z.object({
  length: z.number().positive().max(108), width: z.number().positive().max(108), height: z.number().positive().max(108), weight: z.number().positive().max(150),
});
const ratesSchema = z.object({ action: z.literal('rates'), id: z.string().uuid(), from: addressSchema, parcel: parcelSchema });
const buySchema = z.object({ action: z.literal('buy'), id: z.string().uuid(), rate_id: z.string().min(8).max(64) });

async function isAdmin(req: Request): Promise<boolean> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return false;
  const anon = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
  const { data } = await anon.auth.getUser(token);
  if (!data.user) return false;
  const { data: ok } = await db().rpc('has_role', { _user_id: data.user.id, _role: 'admin' });
  return !!ok;
}

async function shippo(path: string, body: unknown) {
  const lovable = Deno.env.get('LOVABLE_API_KEY'); const key = Deno.env.get('UDC_SHIPPO_API_KEY');
  if (!lovable || !key) throw new Error('Shippo is not connected.');
  const res = await fetch(`${GATEWAY}${path}`, {
    method: 'POST', body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${lovable}`, 'X-Connection-Api-Key': key, 'Content-Type': 'application/json' },
  });
  const text = await res.text();
  if (!res.ok) { console.error(`Shippo ${path} [${res.status}]: ${text}`); throw new Error(`Shippo error ${res.status}: ${text.slice(0, 300)}`); }
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    if (!(await isAdmin(req))) return json({ error: 'Sign in as the owner to do that.' }, 401);
    const body = await req.json();
    const client = db();

    if (body?.action === 'rates') {
      const p = ratesSchema.safeParse(body);
      if (!p.success) return json({ error: 'Check the ship-from address and box size.' }, 400);
      const { data: build } = await client.from('build_tracking').select('shipping_address, customer_name, customer_email, customer_phone, amount_total, fulfillment').eq('id', p.data.id).maybeSingle();
      const to = build?.shipping_address as Record<string, string> | null;
      if (!build || build.fulfillment !== 'us_shipping' || !to?.line1) return json({ error: 'This order has no US shipping address.' }, 400);
      const shipment = await shippo('/shipments/', {
        async: false,
        address_from: { ...p.data.from, country: 'US' },
        address_to: { name: to.name || build.customer_name || 'Customer', street1: to.line1, street2: to.line2 ?? '', city: to.city, state: to.state, zip: to.postal_code, country: to.country || 'US', phone: build.customer_phone ?? p.data.from.phone, email: build.customer_email ?? undefined },
        parcels: [{ ...p.data.parcel, distance_unit: 'in', mass_unit: 'lb' }],
        extra: {
          signature_confirmation: 'STANDARD',
          ...(build.amount_total ? { insurance: { amount: String(build.amount_total), currency: 'USD', content: 'Desktop computer' } } : {}),
        },
      });
      // deno-lint-ignore no-explicit-any
      const rates = (shipment.rates ?? []).filter((r: any) => carrierFromProvider(r.provider)).map((r: any) => ({
        id: r.object_id, carrier: r.provider, service: r.servicelevel?.name ?? '', amount: Number(r.amount), days: r.estimated_days ?? null,
      })).sort((a: { amount: number }, b: { amount: number }) => a.amount - b.amount);
      const messages = (shipment.messages ?? []).map((m: { text?: string }) => m.text).filter(Boolean).slice(0, 3);
      return json({ rates, messages });
    }

    if (body?.action === 'buy') {
      const p = buySchema.safeParse(body);
      if (!p.success) return json({ error: 'Choose a rate first.' }, 400);
      const tx = await shippo('/transactions/', { rate: p.data.rate_id, label_file_type: 'PDF_4x6', async: false });
      if (tx.status !== 'SUCCESS' || !tx.tracking_number) {
        const why = (tx.messages ?? []).map((m: { text?: string }) => m.text).filter(Boolean).join(' ');
        return json({ error: why || 'The carrier did not issue a label.' }, 502);
      }
      const carrier = carrierFromProvider(tx.rate?.provider ?? '') ?? (String(tx.tracking_number).startsWith('1Z') ? 'ups' : 'fedex');
      const { data, error } = await client.from('build_tracking').update({
        tracking_number: String(tx.tracking_number).replace(/[\s-]/g, '').toUpperCase(), carrier, label_url: tx.label_url,
        label_cost: tx.rate?.amount ? Number(tx.rate.amount) : null, updated_at: new Date().toISOString(),
      }).eq('id', p.data.id).select('id, tracking_number, carrier, label_url, label_cost').maybeSingle();
      if (error || !data) return json({ error: 'Label bought but could not be saved. Copy it now.', label_url: tx.label_url, tracking_number: tx.tracking_number }, 503);
      return json({ build: data });
    }
    return json({ error: 'Unknown action.' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Something went wrong.' }, 502);
  }
});
