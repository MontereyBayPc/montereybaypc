import { useState } from 'react';
import { CalendarDays, Save, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { addDays, dayHasCapacity, localDate, scheduleError, WORKSHOP_LABELS, type WorkshopBuild } from '@/lib/workshop';

function Assignment<T extends WorkshopBuild>({ build, builds, onChange }: {build:T; builds:T[]; onChange:(b:T)=>void}) {
  const [date,setDate]=useState(build.scheduled_build_date ?? '');
  const [ship,setShip]=useState(build.planned_ship_date ?? '');
  const [state,setState]=useState(build.workshop_status ?? 'queued');
  const [note,setNote]=useState(build.internal_note ?? '');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const input='w-full bg-transparent border-b border-border py-2 text-sm outline-none focus:border-brand';
  const nextSlot=()=>{
    let next=localDate();
    for(let i=0;i<366;i++) { if(dayHasCapacity(builds,next,build.id)) {setDate(next);return;} next=addDays(next,1); }
    setMessage('No free day in the next year.');
  };
  const save=async(e:React.FormEvent)=>{
    e.preventDefault();
    const invalid=scheduleError(date || null,ship || null);
    if(invalid) {setMessage(invalid);return;}
    if(date && !dayHasCapacity(builds,date,build.id)) {setMessage('That day already has its one build. Choose another day.');return;}
    setBusy(true);setMessage('');
    try {
      const {data,error}=await supabase.functions.invoke('manage-build',{body:{action:'update',id:build.id,scheduled_build_date:date || null,planned_ship_date:ship || null,workshop_status:state,internal_note:note}});
      let failure=data?.error;
      if(error && 'context' in error) {try {failure=(await (error.context as Response).json()).error;}catch{/* use fallback */}}
      if(error || failure) {setMessage(failure || 'Could not save the schedule.');return;}
      onChange(data.build as T);setMessage('Schedule saved.');
    } catch {setMessage('Could not save. Try again.');} finally {setBusy(false);}
  };
  return <form onSubmit={save} className="border border-border rounded-md p-5 space-y-4">
    <div className="flex flex-wrap justify-between gap-2"><h3 className="font-heading text-lg font-semibold">{build.build_name}</h3><span className={state==='blocked'?'text-destructive text-sm':'text-brand text-sm'}>{WORKSHOP_LABELS[build.workshop_status ?? 'queued']}</span></div>
    <p className="text-xs text-muted-foreground">{build.fulfillment==='us_shipping'?'US shipping':build.fulfillment==='local_delivery'?'Local delivery':'Local pickup'} · {build.stage.replace(/_/g,' ')}</p>
    <div className="grid sm:grid-cols-2 gap-4">
      <label className="text-sm text-muted-foreground">Queue status<select aria-label={`Queue status for ${build.build_name}`} value={state} onChange={e=>setState(e.target.value)} className="w-full bg-background border-b border-border py-2 text-sm">{Object.entries(WORKSHOP_LABELS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
      <label className="text-sm text-muted-foreground">Build date<input aria-label={`Build date for ${build.build_name}`} type="date" value={date} onChange={e=>setDate(e.target.value)} className={input}/></label>
      <label className="text-sm text-muted-foreground">Planned ship / handoff date<input aria-label={`Ship date for ${build.build_name}`} type="date" value={ship} onChange={e=>setShip(e.target.value)} className={input}/></label>
    </div>
    <label className="block text-sm text-muted-foreground">Internal workshop note<textarea aria-label={`Internal note for ${build.build_name}`} value={note} onChange={e=>setNote(e.target.value)} rows={2} maxLength={2000} className={input}/></label>
    <div className="flex flex-wrap gap-3"><Button size="sm" type="submit" disabled={busy}><Save className="w-4 h-4 mr-2"/>{busy?'Saving...':'Save schedule'}</Button><Button size="sm" variant="outline" type="button" onClick={nextSlot}><ArrowRight className="w-4 h-4 mr-2"/>Next free day</Button></div>
    {message && <p role="status" className="text-sm text-brand">{message}</p>}
  </form>;
}

export default function Workshop<T extends WorkshopBuild>({builds,onChange,view}:{builds:T[];onChange:(b:T)=>void;view:'queue'|'schedule'}) {
  const [start,setStart]=useState(localDate());
  const [filter,setFilter]=useState('all');
  const active=builds.filter(b=>b.stage!=='completed');
  const sorted=[...active].sort((a,b)=>(a.scheduled_build_date ?? '9999').localeCompare(b.scheduled_build_date ?? '9999') || (a.created_at ?? '').localeCompare(b.created_at ?? ''));
  const visible=sorted.filter(b=>filter==='all' || b.workshop_status===filter);
  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between gap-4"><div><h2 className="font-heading text-2xl font-semibold">{view==='queue'?'Build queue':'Build schedule'}</h2><p className="text-sm text-muted-foreground mt-2">{active.length} active · {active.filter(b=>!b.scheduled_build_date).length} unscheduled · {active.filter(b=>b.workshop_status==='blocked').length} blocked · 1 build per day</p></div></div>
    {view==='schedule' && <>
      <label className="flex items-center gap-3 text-sm"><CalendarDays className="w-4 h-4 text-brand"/>Week starting<input aria-label="Schedule week starting" type="date" value={start} onChange={e=>{if(e.target.value)setStart(e.target.value);}} className="bg-transparent border-b border-border p-2"/></label>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({length:7},(_,i)=>addDays(start,i)).map(day=>{
        const entries=active.filter(b=>b.scheduled_build_date===day);
        const handoffs=active.filter(b=>b.planned_ship_date===day);
        return <div key={day} className="border-t border-border py-4"><h3 className="font-heading font-semibold">{new Date(`${day}T12:00:00`).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</h3><p className="text-xs text-muted-foreground mt-1">{entries.length}/1 build slot</p>{entries.length?entries.map(b=><div key={b.id} className="mt-3 text-sm"><p>{b.build_name}</p><p className="text-brand text-xs">{WORKSHOP_LABELS[b.workshop_status ?? 'queued']}</p></div>):<p className="text-sm text-muted-foreground mt-3">Available</p>}{handoffs.map(b=><p key={b.id} className="mt-3 text-xs text-muted-foreground">Planned handoff: {b.build_name}</p>)}</div>;
      })}</div>
    </>}
    <div className="flex flex-wrap gap-4"><select aria-label="Filter queue status" value={filter} onChange={e=>setFilter(e.target.value)} className="bg-background border-b border-border py-2 text-sm"><option value="all">All statuses</option>{Object.entries(WORKSHOP_LABELS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></div>
    {visible.length===0 && <p className="text-muted-foreground">No active orders match this view.</p>}
    <div className="space-y-4">{visible.map(b=><Assignment key={b.id} build={b} builds={builds} onChange={onChange}/>)}</div>
  </div>;
}