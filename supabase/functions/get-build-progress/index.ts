import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { trackingUrl, CARRIER_NAME, type Carrier } from '../_shared/carrier.ts';
const schema=z.object({token:z.string().regex(/^[a-f0-9]{64}$/)});
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  try{
    const parsed=schema.safeParse(await req.json());if(!parsed.success)return json({error:'This private link is invalid or has expired.'},404);
    const client=createClient(Deno.env.get('SUPABASE_URL') ?? '',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const {data,error}=await client.from('build_tracking').select('id,build_name,stage,customer_note,photo_paths,updated_at,carrier,tracking_number,amount_total,created_at,refunded_at').eq('tracking_token',parsed.data.token).gt('expires_at',new Date().toISOString()).maybeSingle();
    if(error)return json({error:'Build updates are temporarily unavailable.'},503);
    if(!data)return json({error:'This private link is invalid or has expired.'},404);
    const paths=(data.photo_paths ?? []).filter((path:string)=>path.startsWith(`${data.id}/`) && !path.includes('..')).slice(0,20);
    const {data:photos,error:photoError}=paths.length ? await client.storage.from('build-progress-photos').createSignedUrls(paths,300) : {data:[],error:null};
    if(photoError)return json({error:'Build photos are temporarily unavailable.'},503);
    const refundable=!data.refunded_at&&data.stage!=='refunded'&&data.stage!=='completed'&&!data.tracking_number&&Date.now()-new Date(data.created_at).getTime()<48*3600_000;
    return json({name:data.build_name,amount:data.amount_total,created_at:data.created_at,refundable,stage:data.stage,note:data.customer_note,updated_at:data.updated_at,photos:(photos ?? []).map(p=>p.signedUrl).filter(Boolean),shipment:data.carrier&&data.tracking_number?{carrier:CARRIER_NAME[data.carrier as Carrier],number:data.tracking_number,url:trackingUrl(data.carrier as Carrier,data.tracking_number)}:null});
  }catch{return json({error:'This private link is invalid or has expired.'},404);}
});