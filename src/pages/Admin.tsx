import { detectCarrier } from '../../supabase/functions/_shared/carrier';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { oauthReturnPath } from '@/lib/oauth-return-path';
import { Check, Copy, Camera, LogOut, Trash2, Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BUILD_STAGES } from '@/lib/build-stages';
import Workshop from '@/components/Workshop';
import ShippingLabel from '@/components/ShippingLabel';
import type { WorkshopBuild } from '@/lib/workshop';

type Build = WorkshopBuild & {
  id: string;
  build_name: string;
  tracking_token: string;
  stage: string;
  customer_note: string;
  photo_paths: string[];
  updated_at: string;
  expires_at: string;
  order_ref: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  items: { name: string; quantity: number; amount: number }[];
  amount_total: number | null;
  fulfillment: string | null;
  shipping_address?: ShippingAddress | null;
  carrier?: 'ups' | 'fedex' | 'usps' | null;
  tracking_number?: string | null;
  label_url?: string | null;
  label_cost?: number | null;
};
type ShippingAddress = { name: string; line1: string; line2: string; city: string; state: string; postal_code: string; country: string; quoted_zip: string | null };
type Inquiry = { id: string; created_at: string; name: string; email: string; phone: string | null; kind: string; message: string; status: string };
type Quote = { id: string; created_at: string; name: string; email: string; phone: string | null; estimated_total: number; notes: string | null; status: string };

const stageName = (key: string) => BUILD_STAGES.find((s) => s.key === key)?.name ?? key;
const FULFILLMENT_LABEL: Record<string, string> = { local_pickup: 'Local pickup', local_delivery: 'Local delivery', us_shipping: 'US shipping (UPS/FedEx)' };
const addressText = (a: ShippingAddress) =>
  [a.name, a.line1, a.line2, `${a.city}, ${a.state} ${a.postal_code}`].filter(Boolean).join('\n');

// ---------- Sign in / first-time setup ----------
const OwnerAuth = ({ onReady }: { onReady: () => void }) => {
  const [mode, setMode] = useState<'signin' | 'setup'>('signin');
  // The one-time setup form only appears at /portal?setup (it locks itself once an owner exists).
  const setupAllowed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('setup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: failure } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (failure) {
      setError('Wrong email or password.');
      return;
    }
    const next = new URLSearchParams(window.location.search).get('next');
    if (next) {
      const target = oauthReturnPath(next);
      if (target !== '/') { window.location.assign(target); return; }
    }
    onReady();
  };

  const setup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { data, error: failure } = await supabase.functions.invoke('manage-build', {
      body: { action: 'create-owner', passcode, email, password },
    });
    if (failure || data?.error) {
      let message: string | undefined = data?.error;
      // Non-2xx responses arrive as an error; read the server's message from the response body.
      const ctx = (failure as { context?: Response } | null)?.context;
      if (!message && ctx && typeof ctx.json === 'function') {
        try { message = (await ctx.json())?.error; } catch { /* ignore */ }
      }
      setBusy(false);
      setError(message ?? 'Setup failed. Please try again.');
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) {
      setError('Account created. Now sign in above.');
      setMode('signin');
      return;
    }
    onReady();
  };

  const inputCls = 'w-full bg-transparent border-b border-border py-2 outline-none focus:border-brand';

  return (
    <div className="max-w-sm mx-auto">
      <p className="text-xs font-heading text-brand uppercase mb-3">Monterey Bay PCs</p>
      <h1 className="font-heading text-4xl font-bold mb-2">{mode === 'signin' ? 'Staff sign in' : 'First-time setup'}</h1>
      <p className="text-sm text-muted-foreground mb-8">Authorized staff only.</p>
      <form onSubmit={mode === 'signin' ? signIn : setup} className="space-y-5">
        {mode === 'setup' && (
          <div>
            <label htmlFor="passcode" className="block text-sm text-muted-foreground mb-1">Owner passcode</label>
            <input id="passcode" type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} required className={inputCls} autoComplete="off" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm text-muted-foreground mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-muted-foreground mb-1">Password{mode === 'setup' ? ' (at least 8 characters)' : ''}</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === 'setup' ? 8 : 1} className={inputCls} autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} />
        </div>
        {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'One moment...' : mode === 'signin' ? 'Sign in' : 'Create owner account'}
        </Button>
      </form>
      {mode === 'signin' && <button
        onClick={async () => {
          if (!email) { setError('Enter your email above first.'); return; }
          setError('');
          const { error: failure } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/portal?reset` });
          setError(failure ? 'Could not send the reset email. Try again shortly.' : 'If that email has an account, a reset link is on its way.');
        }}
        className="mt-6 block text-sm text-muted-foreground underline"
      >
        Forgot password?
      </button>}
      {setupAllowed && <button
        onClick={() => { setMode(mode === 'signin' ? 'setup' : 'signin'); setError(''); }}
        className="mt-6 text-sm text-muted-foreground underline"
      >
        {mode === 'signin' ? 'First time here? Set up your owner account' : 'Already set up? Sign in'}
      </button>}
    </div>
  );
};

// ---------- Set a new password (from the emailed reset link) ----------
const NewPassword = ({ onDone }: { onDone: () => void }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error: failure } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (failure) { setMessage(/weak|pwned|guess/i.test(failure.message) ? 'That password is too common. Pick a longer, unique one.' : 'Reset link expired or invalid. Request a new one.'); return; }
    onDone();
  };
  return (
    <form onSubmit={save} className="max-w-sm mx-auto space-y-5">
      <h1 className="font-heading text-4xl font-bold">Set a new password</h1>
      <input type="password" aria-label="New password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-brand" />
      {message && <p role="alert" className="text-destructive text-sm">{message}</p>}
      <Button type="submit" disabled={busy} className="w-full">{busy ? 'One moment...' : 'Save password'}</Button>
    </form>
  );
};

// ---------- Build card ----------
const BuildCard = ({ build, onChange }: { build: Build; onChange: (b: Build) => void }) => {
  const [note, setNote] = useState(build.customer_note ?? '');
  const [trackNo, setTrackNo] = useState(build.tracking_number ?? '');
  const [carrier, setCarrier] = useState<string>(build.carrier ?? '');
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setNote(build.customer_note ?? ''), [build.customer_note]);

  const call = async (body: Record<string, unknown>, okMessage: string) => {
    setStatus('Saving...');
    const { data, error: failure } = await supabase.functions.invoke('manage-build', { body: { ...body, id: build.id } });
    if (failure || data?.error) {
      setStatus(data?.error ?? 'Could not save. Please try again.');
      return;
    }
    onChange(data.build as Build);
    setStatus(okMessage);
    setTimeout(() => setStatus(''), 2500);
  };

  const uploadPhoto = (file: File) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setStatus('Photos must be JPG, PNG, or WebP.'); return; }
    if (file.size > 9_000_000) { setStatus('Photo is too large. Keep it under 9 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => void call({ action: 'upload-photo', photo: reader.result as string }, 'Photo added.');
    reader.readAsDataURL(file);
  };

  const copyCustomerLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/build/${build.tracking_token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [addrCopied, setAddrCopied] = useState(false);
  const copyAddress = async () => {
    if (!build.shipping_address) return;
    await navigator.clipboard.writeText(addressText(build.shipping_address));
    setAddrCopied(true);
    setTimeout(() => setAddrCopied(false), 2000);
  };

  return (
    <div className="border border-border rounded-md p-5 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-xl font-semibold">{build.build_name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {stageName(build.stage)} - updated {new Date(build.updated_at).toLocaleString()} - link expires {new Date(build.expires_at).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={copyCustomerLink}>
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied' : 'Copy customer link'}
        </Button>
      </div>

      {build.order_ref && (
        <div className="bg-muted/40 rounded-md p-4 text-sm space-y-1">
          <p className="font-heading font-semibold">
            Paid order {build.amount_total != null && <span className="text-brand">${Number(build.amount_total).toLocaleString()}</span>}
            {build.fulfillment && <span className="text-muted-foreground font-normal"> - {FULFILLMENT_LABEL[build.fulfillment] ?? build.fulfillment}</span>}
          </p>
          <p className="text-muted-foreground">{[build.customer_name, build.customer_email, build.customer_phone].filter(Boolean).join(' - ')}</p>
          <ul className="list-disc pl-5">
            {build.items.map((it, i) => <li key={i}>{it.name} x{it.quantity}</li>)}
          </ul>
          {build.shipping_address && (
            <div className="pt-3 mt-2 border-t border-border">
              <p className="text-xs font-heading uppercase text-muted-foreground mb-1">Ship to</p>
              <p className="whitespace-pre-line">{addressText(build.shipping_address)}</p>
              {build.shipping_address.quoted_zip && build.shipping_address.quoted_zip !== build.shipping_address.postal_code.slice(0, 5) && (
                <p className="text-destructive text-xs mt-1">
                  Shipping was priced for ZIP {build.shipping_address.quoted_zip}, but the address ZIP is {build.shipping_address.postal_code}. Check the shipping charge.
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={copyAddress}>
                  {addrCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {addrCopied ? 'Copied' : 'Copy shipping label'}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText(build.shipping_address).replace(/\n/g, ', '))}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {BUILD_STAGES.map((stage) => (
          <button
            key={stage.key}
            onClick={() => void call({ action: 'update', stage: stage.key }, 'Stage updated.')}
            className={`px-3 py-1.5 rounded-full text-sm font-heading border transition-colors ${
              build.stage === stage.key ? 'border-brand text-brand' : 'border-border text-muted-foreground hover:border-foreground'
            }`}
          >
            {stage.name}
          </button>
        ))}
      </div>
      {build.stage === 'completed' ? (
        <Button variant="outline" size="sm" onClick={() => void call({ action: 'update', stage: 'ready_for_pickup' }, 'Moved back to active.')}>Move back to active</Button>
      ) : (
        <Button size="sm" onClick={() => void call({ action: 'update', stage: 'completed' }, 'Moved to Completed.')}>Move to Completed</Button>
      )}

      <div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={2000}
          placeholder="Note for the customer..."
          className="w-full bg-transparent border border-border rounded-md p-3 text-sm outline-none focus:border-brand"
        />
        <Button size="sm" className="mt-2" onClick={() => void call({ action: 'update', customer_note: note }, 'Note saved.')}>Save note</Button>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Package tracking</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={trackNo}
            onChange={(e) => { setTrackNo(e.target.value); const c = detectCarrier(e.target.value); if (c) setCarrier(c); }}
            maxLength={40}
            placeholder="Paste tracking number"
            className="flex-1 min-w-[180px] bg-transparent border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-brand font-mono"
          />
          <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="bg-background border border-border rounded-md px-3 py-2 text-sm">
            <option value="">Carrier</option>
            <option value="ups">UPS</option>
            <option value="fedex">FedEx</option>
            <option value="usps">USPS</option>
          </select>
          <Button size="sm" disabled={!!trackNo.trim() && !carrier} onClick={() => void call({ action: 'update', tracking_number: trackNo.trim() || null, carrier: trackNo.trim() ? carrier : null }, trackNo.trim() ? 'Tracking saved. Customer can now track the package.' : 'Tracking removed.')}>Save tracking</Button>
        </div>
        {build.fulfillment === 'us_shipping' && build.shipping_address && (
          <ShippingLabel
            buildId={build.id}
            labelUrl={build.label_url}
            labelCost={build.label_cost}
            onSaved={(s) => {
              setTrackNo(s.tracking_number); setCarrier(s.carrier);
              onChange({ ...build, tracking_number: s.tracking_number, carrier: s.carrier as Build['carrier'], label_url: s.label_url, label_cost: s.label_cost });
            }}
          />
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">{build.photo_paths.length} of 20 photos</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); e.target.value = ''; }}
        />
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Camera className="w-4 h-4 mr-2" /> Add photo
          </Button>
          {build.photo_paths.map((p) => (
            <button
              key={p}
              title="Remove photo"
              onClick={() => void call({ action: 'delete-photo', path: p }, 'Photo removed.')}
              className="text-muted-foreground hover:text-destructive text-xs flex items-center gap-1 border border-border rounded px-2 py-1"
            >
              <Trash2 className="w-3 h-3" /> {p.split('/').pop()?.slice(0, 8)}
            </button>
          ))}
        </div>
      </div>

      {status && <p role="status" className="text-sm text-brand">{status}</p>}
    </div>
  );
};

// ---------- Dashboard ----------
const Dashboard = ({ onSignOut }: { onSignOut: () => void }) => {
  const [tab, setTab] = useState<'builds' | 'leads' | 'queue' | 'schedule'>(() => {
    const view = new URLSearchParams(window.location.search).get('view');
    return view === 'queue' || view === 'schedule' || view === 'leads' ? view : 'builds';
  });
  const changeTab = (next: 'builds' | 'leads' | 'queue' | 'schedule') => {
    setTab(next); window.history.replaceState(null, '', `${window.location.pathname}?view=${next}`);
  };
  const [builds, setBuilds] = useState<Build[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const loadBuilds = useCallback(async () => {
    const { data, error: failure } = await supabase.functions.invoke('manage-build', { body: { action: 'list' } });
    if (failure || data?.error) setError(data?.error ?? 'Could not load builds.');
    else setBuilds(data.builds as Build[]);
  }, []);

  const loadLeads = useCallback(async () => {
    const [{ data: inq }, { data: quo }] = await Promise.all([
      supabase.from('contact_inquiries').select('id, created_at, name, email, phone, kind, message, status').order('created_at', { ascending: false }).limit(50),
      supabase.from('quote_requests').select('id, created_at, name, email, phone, estimated_total, notes, status').order('created_at', { ascending: false }).limit(50),
    ]);
    setInquiries((inq ?? []) as Inquiry[]);
    setQuotes((quo ?? []) as Quote[]);
  }, []);

  useEffect(() => { void loadBuilds(); void loadLeads(); }, [loadBuilds, loadLeads]);

  const createBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const { data, error: failure } = await supabase.functions.invoke('manage-build', {
      body: { action: 'create', build_name: newName.trim() },
    });
    if (failure || data?.error) { setError(data?.error ?? 'Could not create the build.'); return; }
    setBuilds((prev) => [data.build as Build, ...prev]);
    setNewName('');
  };

  const replaceBuild = (updated: Build) => setBuilds((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));

  const tabCls = (t: string) =>
    `px-4 py-2 font-heading text-sm border-b-2 ${tab === t ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground'}`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-heading text-brand uppercase mb-2">Staff portal</p>
          <h1 className="font-heading text-4xl font-bold">Your workshop</h1>
        </div>
        <Button variant="outline" size="sm" onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border mb-8">
        <Button variant="ghost" className={tabCls('builds')} onClick={() => changeTab('builds')}>Orders & builds ({builds.filter((b) => b.stage !== 'completed').length})</Button>
        <Button variant="ghost" className={tabCls('queue')} onClick={() => changeTab('queue')}>Build queue</Button>
        <Button variant="ghost" className={tabCls('schedule')} onClick={() => changeTab('schedule')}>Build schedule</Button>
        <Button variant="ghost" className={tabCls('leads')} onClick={() => changeTab('leads')}>Leads ({inquiries.length + quotes.length})</Button>
      </div>

      {error && <p role="alert" className="text-destructive text-sm mb-6">{error}</p>}

      {(tab === 'queue' || tab === 'schedule') && <Workshop builds={builds} onChange={replaceBuild} view={tab} />}

      {tab === 'builds' && (
        <div className="space-y-6">
          <form onSubmit={createBuild} className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={120}
              placeholder="New build name, e.g. Sarah's Bay Mid Gaming PC"
              className="flex-1 bg-transparent border-b border-border py-2 outline-none focus:border-brand"
            />
            <Button type="submit"><Plus className="w-4 h-4 mr-2" /> New build</Button>
          </form>
          {builds.filter((b) => b.stage !== 'completed').length === 0 && <p className="text-muted-foreground">No active builds. Create one above, then send the customer their link.</p>}
          {builds.filter((b) => b.stage !== 'completed').map((b) => <BuildCard key={b.id} build={b} onChange={replaceBuild} />)}
          <details className="border-t border-border pt-6">
            <summary className="cursor-pointer font-heading text-2xl font-semibold">Completed ({builds.filter((b) => b.stage === 'completed').length})</summary>
            <p className="text-sm text-muted-foreground mt-2 mb-4">Tap "Completed" on a build once it is picked up or delivered. Tap another stage to reopen it.</p>
            <div className="space-y-6">
              {builds.filter((b) => b.stage === 'completed').map((b) => <BuildCard key={b.id} build={b} onChange={replaceBuild} />)}
            </div>
          </details>
        </div>
      )}

      {tab === 'leads' && (
        <div className="space-y-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold mb-4">Quote requests</h2>
            {quotes.length === 0 && <p className="text-muted-foreground text-sm">No quote requests yet.</p>}
            <div className="space-y-3">
              {quotes.map((q) => (
                <div key={q.id} className="border border-border rounded-md p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-heading font-semibold">{q.name} <span className="text-brand">${q.estimated_total.toLocaleString()}</span></p>
                    <p className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{q.email}{q.phone ? ` - ${q.phone}` : ''}</p>
                  {q.notes && <p className="text-sm mt-2 whitespace-pre-wrap">{q.notes}</p>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold mb-4">Messages & requests</h2>
            {inquiries.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
            <div className="space-y-3">
              {inquiries.map((i) => (
                <div key={i.id} className="border border-border rounded-md p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-heading font-semibold">{i.name} <span className="text-xs text-brand uppercase">{i.kind}</span></p>
                    <p className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{i.email}{i.phone ? ` - ${i.phone}` : ''}</p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{i.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Page ----------
export default function Admin() {
  const [sessionReady, setSessionReady] = useState(false);
  const [resetting, setResetting] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('reset'));
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const checkAdmin = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsAdmin(null); return; }
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
    setIsAdmin(!!data);
  }, []);

  useEffect(() => {
    void checkAdmin();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => void checkAdmin());
    return () => subscription.unsubscribe();
  }, [checkAdmin]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(null);
  };

  return (
    <Layout>
      <Helmet>
        <title>Staff Portal | Monterey Bay PCs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {resetting ? <NewPassword onDone={() => { setResetting(false); window.history.replaceState(null, '', '/portal'); }} /> : <>
        {isAdmin === null && !sessionReady && <OwnerAuth onReady={() => setSessionReady(true)} />}
        {isAdmin === null && sessionReady && <p className="text-muted-foreground text-center">Checking your account...</p>}
        {isAdmin === false && (
          <div className="max-w-sm mx-auto text-center">
            <p className="text-destructive mb-4">This account is not the owner account.</p>
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        )}
        {isAdmin === true && <Dashboard onSignOut={signOut} />}
        </>}
      </section>
    </Layout>
  );
}
