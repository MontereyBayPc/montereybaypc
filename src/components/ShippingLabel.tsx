import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

type Rate = { id: string; carrier: string; service: string; amount: number; days: number | null };
type Saved = { id: string; tracking_number: string; carrier: string; label_url: string; label_cost: number | null };

const FROM_KEY = 'mbpc-ship-from';
const PARCEL_KEY = 'mbpc-parcel';
const emptyFrom = { name: 'Monterey Bay PCs', street1: '', street2: '', city: 'Monterey', state: 'CA', zip: '', phone: '(831) 718-7730', email: 'montereybaypc@gmail.com' };
const defaultParcel = { length: 26, width: 14, height: 24, weight: 35 };

const load = <T,>(key: string, fallback: T): T => {
  try { return { ...fallback, ...JSON.parse(localStorage.getItem(key) ?? '{}') }; } catch { return fallback; }
};

async function readError(failure: unknown, data: { error?: string } | null) {
  if (data?.error) return data.error;
  const ctx = (failure as { context?: Response } | null)?.context;
  if (ctx) { try { return (await ctx.json()).error ?? 'Request failed.'; } catch { /* ignore */ } }
  return 'Request failed. Please try again.';
}

export default function ShippingLabel({ buildId, labelUrl, labelCost, onSaved }: {
  buildId: string; labelUrl?: string | null; labelCost?: number | null; onSaved: (b: Saved) => void;
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(() => load(FROM_KEY, emptyFrom));
  const [parcel, setParcel] = useState(() => load(PARCEL_KEY, defaultParcel));
  const [rates, setRates] = useState<Rate[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  const getRates = async () => {
    setBusy('rates'); setMsg(''); setRates([]);
    localStorage.setItem(FROM_KEY, JSON.stringify(from));
    localStorage.setItem(PARCEL_KEY, JSON.stringify(parcel));
    const { data, error } = await supabase.functions.invoke('shipping-label', { body: { action: 'rates', id: buildId, from, parcel } });
    setBusy('');
    if (error || data?.error) { setMsg(await readError(error, data)); return; }
    setRates(data.rates ?? []); setNotes(data.messages ?? []);
    if (!data.rates?.length) setMsg('No UPS, FedEx, or USPS rates came back. Check the addresses and box size.');
  };

  const buy = async (rate: Rate) => {
    if (!confirm(`Buy ${rate.carrier} ${rate.service} label for $${rate.amount.toFixed(2)}?`)) return;
    setBusy(rate.id); setMsg('');
    const { data, error } = await supabase.functions.invoke('shipping-label', { body: { action: 'buy', id: buildId, rate_id: rate.id } });
    setBusy('');
    if (error || data?.error) { setMsg(await readError(error, data)); if (data?.label_url) window.open(data.label_url, '_blank'); return; }
    onSaved(data.build as Saved);
    setRates([]); setOpen(false);
    setMsg('Label bought. Tracking number saved for the customer.');
    window.open(data.build.label_url, '_blank', 'noopener');
  };

  const field = 'bg-transparent border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-brand';
  const setF = (k: keyof typeof from) => (e: React.ChangeEvent<HTMLInputElement>) => setFrom({ ...from, [k]: e.target.value });
  const setP = (k: keyof typeof parcel) => (e: React.ChangeEvent<HTMLInputElement>) => setParcel({ ...parcel, [k]: Number(e.target.value) });

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        {labelUrl && (
          <Button size="sm" variant="outline" asChild>
            <a href={labelUrl} target="_blank" rel="noopener noreferrer">Print label{labelCost ? ` ($${Number(labelCost).toFixed(2)})` : ''}</a>
          </Button>
        )}
        <Button size="sm" variant={labelUrl ? 'ghost' : 'default'} onClick={() => setOpen(!open)}>
          {open ? 'Close' : labelUrl ? 'Buy another label' : 'Create shipping label'}
        </Button>
      </div>

      {open && (
        <div className="border border-border rounded-md p-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Ship from (saved on this device)</p>
            <div className="grid sm:grid-cols-2 gap-2">
              <input className={field} placeholder="Name" value={from.name} onChange={setF('name')} />
              <input className={field} placeholder="Phone" value={from.phone} onChange={setF('phone')} />
              <input className={field} placeholder="Street address" value={from.street1} onChange={setF('street1')} />
              <input className={field} placeholder="Apt / suite (optional)" value={from.street2} onChange={setF('street2')} />
              <input className={field} placeholder="City" value={from.city} onChange={setF('city')} />
              <div className="flex gap-2">
                <input className={`${field} w-16`} placeholder="ST" maxLength={2} value={from.state} onChange={setF('state')} />
                <input className={`${field} flex-1`} placeholder="ZIP" value={from.zip} onChange={setF('zip')} />
              </div>
              <input className={`${field} sm:col-span-2`} placeholder="Email" value={from.email} onChange={setF('email')} />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Box (inches / pounds)</p>
            <div className="grid grid-cols-4 gap-2">
              {(['length', 'width', 'height', 'weight'] as const).map((k) => (
                <label key={k} className="text-xs text-muted-foreground">
                  {k[0].toUpperCase() + k.slice(1)}
                  <input type="number" min={1} className={`${field} w-full mt-1`} value={parcel[k]} onChange={setP(k)} />
                </label>
              ))}
            </div>
          </div>
          <Button size="sm" disabled={busy === 'rates' || !from.street1 || !from.zip} onClick={() => void getRates()}>
            {busy === 'rates' ? 'Getting rates...' : 'Get live rates'}
          </Button>
          {notes.length > 0 && <p className="text-xs text-muted-foreground">{notes.join(' ')}</p>}
          {rates.length > 0 && (
            <ul className="divide-y divide-border border border-border rounded-md">
              {rates.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span><strong>{r.carrier}</strong> {r.service}{r.days ? ` - ${r.days} day${r.days > 1 ? 's' : ''}` : ''}</span>
                  <Button size="sm" variant="outline" disabled={!!busy} onClick={() => void buy(r)}>
                    {busy === r.id ? 'Buying...' : `$${r.amount.toFixed(2)}`}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">Includes signature confirmation and insurance for the order value.</p>
        </div>
      )}
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
    </div>
  );
}
