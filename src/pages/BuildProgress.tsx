import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Circle, RefreshCw, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BUILD_STAGES } from '@/lib/build-stages';
type Progress={name:string;stage:string;note:string;updated_at:string;photos:string[];shipment?:{carrier:string;number:string;url:string}|null};
export default function BuildProgress(){
  const {token=''}=useParams();
  const [data,setData]=useState<Progress|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [refresh,setRefresh]=useState(0);
  useEffect(()=>{
    let active=true; let terminal=false;
    const load=async()=>{
      if(terminal || document.hidden)return;
      const {data:result,error:failure}=await supabase.functions.invoke('get-build-progress',{body:{token}});
      if(!active)return;
      if(failure || result?.error){
        const response=failure && 'context' in failure ? failure.context as Response : undefined;
        terminal=response?.status===404;
        setError(terminal ? 'This private link is invalid or has expired. Contact us for a new link.' : 'Updates are temporarily unavailable. Please try again later.');
      }else{setData(result as Progress);setError('');}
      setLoading(false);
    };
    void load(); const timer=setInterval(()=>{void load();},15000);
    const visible=()=>{if(!document.hidden)void load();}; document.addEventListener('visibilitychange',visible);
    return()=>{active=false;clearInterval(timer);document.removeEventListener('visibilitychange',visible);};
  },[token,refresh]);
  const current=BUILD_STAGES.findIndex(s=>s.key===data?.stage);
  return <Layout><Helmet><title>Your Private Build Progress | Monterey Bay PCs</title><meta name="robots" content="noindex,nofollow" /><meta name="referrer" content="no-referrer" /></Helmet>
    <section className="container mx-auto max-w-4xl px-4 lg:px-8 py-16 lg:py-24"><div className="flex justify-between items-start gap-4"><div><p className="text-xs font-heading text-brand uppercase mb-3">Private customer update</p><h1 className="font-heading text-4xl font-bold">{data?.name || 'Your Build Progress'}</h1></div><Button variant="outline" size="icon" title="Refresh build update" aria-label="Refresh build update" onClick={()=>setRefresh(r=>r+1)}><RefreshCw /></Button></div>
      {loading && <p className="text-muted-foreground mt-8">Loading your build...</p>}
      {error && <p role="alert" className="text-destructive mt-8">{error}</p>}
      {data && <><p className="text-muted-foreground mt-4">Last updated {new Date(data.updated_at).toLocaleString()}. Updates refresh automatically.</p>{data.shipment && <div className="mt-8 border border-brand rounded-md p-5 flex flex-wrap items-center gap-4"><Package className="w-6 h-6 text-brand"/><div><p className="font-heading font-semibold">Package tracking with {data.shipment.carrier}</p><p className="text-sm text-muted-foreground font-mono">{data.shipment.number}</p><p className="text-xs text-muted-foreground mt-1">A label may be created before carrier acceptance. Check the carrier for delivery updates.</p></div><Button asChild className="ml-auto"><a href={data.shipment.url} target="_blank" rel="noopener noreferrer">Track your package</a></Button></div>}<ol className="my-10 border-y border-border">{BUILD_STAGES.map((stage,i)=><li key={stage.key} className={`flex items-center gap-4 py-5 border-b border-border last:border-b-0 ${i<=current?'text-foreground':'text-muted-foreground'}`} aria-current={i===current?'step':undefined}>{i<current?<Check className="w-5 h-5 text-brand"/>:<Circle className={`w-5 h-5 ${i===current?'text-brand':''}`} />}<span className="font-heading">{stage.name}</span>{i===current && <span className="ml-auto text-xs text-brand">Current stage</span>}</li>)}</ol>{data.note && <p className="whitespace-pre-wrap text-muted-foreground mb-8">{data.note}</p>}<h2 className="font-heading text-2xl font-semibold mb-5">From the workbench</h2>{data.photos.length ? <div className="grid sm:grid-cols-2 gap-4">{data.photos.map((url,i)=><img key={i} src={url} alt={`Your build progress photo ${i+1}`} className="w-full aspect-[4/3] object-contain bg-muted rounded-md" loading="lazy" referrerPolicy="no-referrer" />)}</div>:<p className="text-muted-foreground">No progress photos have been attached yet.</p>}</>}
      <p className="mt-10 text-sm text-muted-foreground">Keep this link private. Questions? <a href="tel:+18317187730" className="underline">(831) 718-7730</a></p>
    </section></Layout>;
}