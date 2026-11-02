import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
const schema=z.object({token:z.string().regex(/^[a-f0-9]{64}$/),address:z.object({name:z.string().trim().min(1).max(100),line1:z.string().trim().min(1).max(120),line2:z.string().trim().max(120).default(''),city:z.string().trim().min(1).max(80),state:z.string().trim().regex(/^[A-Z]{2}$/),postal_code:z.string().regex(/^\d{5}$/),country:z.literal('US')})});
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 try{
 const parsed=schema.safeParse(await req.json());if(!parsed.success)return json({error:'Check all address fields and use your original five-digit ZIP.'},400);
 const client=createClient(Deno.env.get('SUPABASE_URL')??'',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')??'');
 const {data,error}=await client.rpc('correct_order_address',{p_token:parsed.data.token,p_address:parsed.data.address});
 if(error)return json({error:'Address updates are temporarily unavailable. Contact our team.'},503);
 if(!data)return json({error:'This correction cannot be saved. Use the original ZIP and contact our team if shipping preparation has started.'},409);
 return json({corrected:true});
 }catch{return json({error:'Could not save the correction. Please try again.'},400);}
});
