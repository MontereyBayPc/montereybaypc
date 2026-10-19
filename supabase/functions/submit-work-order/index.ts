import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
const schema = z.object({
  name:z.string().trim().min(1).max(100), email:z.string().trim().email().max(255), hardware:z.string().trim().min(1).max(500), work:z.string().trim().min(1).max(1000),
  version:z.literal('2026-10-19'), acknowledgments:z.array(z.enum(['scope','data','property','rma','consent'])).length(5).refine(values=>new Set(values).size===5),
});
const json = (body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,'Content-Type':'application/json'}});
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  try {
    const parsed=schema.safeParse(await req.json());
    if(!parsed.success)return json({error:'Complete every field and acknowledgment before submitting.'},400);
    const client=createClient(Deno.env.get('SUPABASE_URL') ?? '',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const data=parsed.data;
    const {data:order,error}=await client.from('service_work_orders').insert({customer_name:data.name,customer_email:data.email,hardware:data.hardware,requested_work:data.work,agreement_version:data.version}).select('id,accepted_at').single();
    if(error)return json({error:'Could not save your acknowledgment. Please call (831) 718-7730.'},500);
    return json({id:order.id,accepted_at:order.accepted_at});
  }catch{return json({error:'Could not submit the work order. Please check your details.'},400);}
});