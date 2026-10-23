import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { shipmentStep } from '../_shared/shipment-progress.ts';
const schema = z.object({ token: z.string().regex(/^[a-f0-9]{64}$/) });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
type Location = { city?: string; state?: string; country?: string };
type Event = { status?: string; status_date?: string; status_details?: string; substatus?: { code?: string } | null; location?: Location | null };
const cache = new Map<string, { until: number; value: unknown }>();
const places = new Map<string, [number, number]>();
async function locate(location: Location): Promise<[number, number] | null> {
  if (!location.city) return null;
  const name = [location.city, location.state, location.country].filter(Boolean).join(', ');
  if (places.has(name)) return places.get(name) ?? null;
  try {
    const url = new URL('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates');
    url.searchParams.set('SingleLine', name); url.searchParams.set('f', 'json'); url.searchParams.set('maxLocations', '1');
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) return null;
    const result = await response.json();
    const point = result.candidates?.[0];
    if (!point || point.score < 90 || !Number.isFinite(point.location?.x) || !Number.isFinite(point.location?.y)) return null;
    const coordinates: [number, number] = [point.location.y, point.location.x];
    if (places.size > 200) places.clear();
    places.set(name, coordinates); return coordinates;
  } catch { return null; }
}
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: 'Invalid private tracking link.' }, 404);
    const client = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data, error } = await client.from('build_tracking').select('carrier,tracking_number').eq('tracking_token', parsed.data.token).gt('expires_at', new Date().toISOString()).maybeSingle();
    if (error) return json({ error: 'Shipment lookup is temporarily unavailable.' }, 503);
    if (!data) return json({ error: 'Invalid or expired private tracking link.' }, 404);
    if (!data.carrier || !data.tracking_number) return json({ shipment: null });
    if (!['ups', 'usps', 'fedex'].includes(data.carrier) || !/^[A-Z0-9]{8,40}$/.test(data.tracking_number)) return json({ error: 'Carrier tracking is unavailable.' }, 400);
    const key = `${data.carrier}/${data.tracking_number}`;
    const saved = cache.get(key); if (saved && saved.until > Date.now()) return json(saved.value);
    const api = Deno.env.get('LOVABLE_API_KEY'), connection = Deno.env.get('UDC_SHIPPO_API_KEY');
    if (!api || !connection) return json({ error: 'Shippo is not connected.' }, 503);
    const response = await fetch(`https://connector-gateway.lovable.dev/udc_shippo/tracks/${encodeURIComponent(data.carrier)}/${encodeURIComponent(data.tracking_number)}`, { headers: { Authorization: `Bearer ${api}`, 'X-Connection-Api-Key': connection }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
      const details = await response.text(); console.error(`Shippo tracking [${response.status}]: ${details}`);
      return json({ error: 'Carrier updates are unavailable. Use the carrier tracking link.', status: response.status, details }, response.status);
    }
    const tracking = await response.json();
    const current: Event = tracking.tracking_status ?? {};
    const history: Event[] = Array.isArray(tracking.tracking_history) ? tracking.tracking_history.slice(-30) : [];
    const locations = history.filter(event => event.location?.city).slice(-8);
    const points = (await Promise.all(locations.map(async event => {
      const location = event.location; if (!location) return null;
      const coords = await locate(location);
      return coords ? { coords, city: [location.city, location.state].filter(Boolean).join(', '), date: event.status_date ?? '' } : null;
    }))).filter(Boolean);
    const value = { shipment: { status: current.status ?? 'UNKNOWN', step: shipmentStep(current.status ?? 'UNKNOWN', current.substatus?.code), details: current.status_details ?? 'No carrier scans yet.', eta: tracking.eta ?? null, test: tracking.test === true, checked_at: new Date().toISOString(), points, events: history.map(event => ({ status: event.status, date: event.status_date, details: event.status_details, city: event.location ? [event.location.city, event.location.state].filter(Boolean).join(', ') : null })).reverse() } };
    if (cache.size > 200) cache.clear(); cache.set(key, { until: Date.now() + 300000, value });
    return json(value);
  } catch { return json({ error: 'Carrier updates are temporarily unavailable. Use the carrier tracking link.' }, 503); }
});