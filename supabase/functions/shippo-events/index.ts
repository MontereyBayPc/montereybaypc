import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';
const hint = z.object({ event: z.literal('track_updated'), data: z.object({ carrier: z.enum(['ups','usps','fedex']), tracking_number: z.string().regex(/^[A-Z0-9]{8,40}$/) }) });
const json = (body: unknown, status=200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type':'application/json', 'Cache-Control':'no-store' } });
Deno.serve(async req => {
  if (req.method !== 'POST') return json({error:'Method not allowed'},405);
  try {
    if (Number(req.headers.get('content-length') ?? 0) > 100000) return json({error:'Payload too large'},413);
    const raw = await req.text(); if (raw.length > 100000) return json({error:'Payload too large'},413);
    const parsed = hint.safeParse(JSON.parse(raw)); if (!parsed.success) return json({received:true});
    const {carrier,tracking_number}=parsed.data.data;
    const db=createClient(Deno.env.get('SUPABASE_URL') ?? '',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const {data:build,error}=await db.from('build_tracking').select('id,stage,refunded_at,carrier_updated_at,delivered_at').eq('carrier',carrier).eq('tracking_number',tracking_number).maybeSingle();
    if(error)return json({error:'Lookup unavailable'},503);
    if(!build || build.refunded_at || build.stage==='refunded')return json({received:true});
    // Webhooks are untrusted hints. Independently fetch the authoritative status
    // through our authenticated Shippo connection; never apply webhook body status.
    const api=Deno.env.get('LOVABLE_API_KEY'),connection=Deno.env.get('UDC_SHIPPO_API_KEY');
    if(!api || !connection)return json({error:'Carrier connection unavailable'},503);
    const response=await fetch(`https://connector-gateway.lovable.dev/udc_shippo/tracks/${carrier}/${encodeURIComponent(tracking_number)}`,{headers:{Authorization:`Bearer ${api}`,'X-Connection-Api-Key':connection},signal:AbortSignal.timeout(10000)});
    if(!response.ok)return json({error:'Carrier verification unavailable'},502);
    const verified=await response.json();
    if(verified.test===true || verified.tracking_number!==tracking_number || verified.carrier!==carrier)return json({received:true});
    const status=verified.tracking_status?.status;
    const date=verified.tracking_status?.status_date;
    if(!['PRE_TRANSIT','TRANSIT','DELIVERED','RETURNED','FAILURE','UNKNOWN'].includes(status) || !date || !Number.isFinite(Date.parse(date)))return json({received:true});
    if(build.carrier_updated_at && Date.parse(date)<=Date.parse(build.carrier_updated_at))return json({received:true});
    const patch:Record<string,unknown>={carrier_status:status,carrier_updated_at:date};
    if(status==='TRANSIT'||status==='DELIVERED') {patch.workshop_status='shipped';patch.held_at=null;patch.hold_reason=null;patch.hold_until=null;patch.hold_previous_status=null;}
    if(status==='DELIVERED'){patch.delivered_at=build.delivered_at ?? date;patch.stage='completed';}
    let update=db.from('build_tracking').update(patch).eq('id',build.id).is('refunded_at',null).neq('stage','refunded');
    update=build.carrier_updated_at?update.eq('carrier_updated_at',build.carrier_updated_at):update.is('carrier_updated_at',null);
    const {error:saveError}=await update;
    return saveError?json({error:'Status update unavailable'},503):json({received:true});
  }catch{return json({error:'Event could not be processed'},503);}
});