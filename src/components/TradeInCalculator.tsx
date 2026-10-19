import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { tradeCredit } from '@/lib/trade-in';

type Part = { id: string; category: string; name: string; price: number };
export default function TradeInCalculator() {
  const [parts, setParts] = useState<Part[]>([]);
  const [selected, setSelected] = useState('');
  const [condition, setCondition] = useState<'excellent' | 'good' | 'fair' | 'not-working'>('good');
  const [loading,setLoading] = useState(true);
  const [failed,setFailed] = useState(false);
  useEffect(() => { let active = true; supabase.from('parts').select('id,category,name,price').in('category',['cpu','gpu']).order('name').then(({data,error}) => { if (active) { setParts((data ?? []) as Part[]); setFailed(!!error); setLoading(false); } }); return () => { active = false; }; },[]);
  const part = parts.find(p => p.id === selected);
  const credit = part ? tradeCredit(part.category,Number(part.price),condition) : 0;
  return <section className="border-y border-border py-8 mb-12"><h2 className="font-heading text-2xl font-semibold mb-5">Estimate your trade credit</h2>
    {loading ? <p className="text-muted-foreground">Loading reference prices...</p> : failed || !parts.length ? <p className="text-muted-foreground">Reference prices are unavailable right now. Send your CPU or GPU model below for an inspected offer.</p> : <div className="grid sm:grid-cols-2 gap-5">
      <label className="grid gap-2 text-sm">CPU or graphics card<select aria-label="Trade-in component" className="bg-background border border-border rounded-md p-3 w-full" value={selected} onChange={e => setSelected(e.target.value)}><option value="">Choose your model</option>{parts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <label className="grid gap-2 text-sm">Condition<select aria-label="Trade-in condition" className="bg-background border border-border rounded-md p-3" value={condition} onChange={e => setCondition(e.target.value as typeof condition)}><option value="excellent">Excellent, working</option><option value="good">Good, working</option><option value="fair">Fair, working</option><option value="not-working">Not working</option></select></label>
      {part && <div className="sm:col-span-2"><p className="font-heading text-3xl font-bold text-brand">Estimated credit ${credit}</p><p className="text-sm text-muted-foreground mt-2">Reference catalog price ${Number(part.price)}. Provisional offer only, final credit after inspection and never above 50% of reference price. No credit is applied automatically.</p></div>}
    </div>}
  </section>;
}