import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Copy, Camera, LogOut, Trash2, Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BUILD_STAGES } from '@/lib/build-stages';

type Build = {
  id: string;
  build_name: string;
  tracking_token: string;
  stage: string;
  customer_note: string;
  photo_paths: string[];
  updated_at: string;
  expires_at: string;
};
type Inquiry = { id: string; created_at: string; name: string; email: string; phone: string | null; kind: string; message: string; status: string };
type Quote = { id: string; created_at: string; name: string; email: string; phone: string | null; estimated_total: number; notes: string | null; status: string };

const stageName = (key: string) => BUILD_STAGES.find((s) => s.key === key)?.name ?? key;

// ---------- Sign in / first-time setup ----------
const OwnerAuth = ({ onReady }: { onReady: () => void }) => {
  const [mode, setMode] = useState<'signin' | 'setup'>('signin');
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
      setBusy(false);
      setError(data?.error ?? 'Setup failed. Please try again.');
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
      <p className="text-xs font-heading text-brand uppercase mb-3">Owner sign in</p>
      <h1 className="font-heading text-4xl font-bold mb-8">{mode === 'signin' ? 'Owner Dashboard' : 'First-time setup'}</h1>
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
      <button
        onClick={() => { setMode(mode === 'signin' ? 'setup' : 'signin'); setError(''); }}
        className="mt-6 text-sm text-muted-foreground underline"
      >
        {mode === 'signin' ? 'First time here? Set up your owner account' : 'Already set up? Sign in'}
      </button>
    </div>
  );
};

// ---------- Build card ----------
const BuildCard = ({ build, onChange }: { build: Build; onChange: (b: Build) => void }) => {
  const [note, setNote] = useState(build.customer_note ?? '');
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
  const [tab, setTab] = useState<'builds' | 'leads'>('builds');
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
          <p className="text-xs font-heading text-brand uppercase mb-2">Owner dashboard</p>
          <h1 className="font-heading text-4xl font-bold">Your workshop</h1>
        </div>
        <Button variant="outline" size="sm" onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </Button>
      </div>

      <div className="flex gap-2 border-b border-border mb-8">
        <button className={tabCls('builds')} onClick={() => setTab('builds')}>Builds ({builds.length})</button>
        <button className={tabCls('leads')} onClick={() => setTab('leads')}>Leads ({inquiries.length + quotes.length})</button>
      </div>

      {error && <p role="alert" className="text-destructive text-sm mb-6">{error}</p>}

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
          {builds.length === 0 && <p className="text-muted-foreground">No builds yet. Create one above, then send the customer their link.</p>}
          {builds.map((b) => <BuildCard key={b.id} build={b} onChange={replaceBuild} />)}
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
        <title>Owner Dashboard | Monterey Bay PCs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {isAdmin === null && !sessionReady && <OwnerAuth onReady={() => setSessionReady(true)} />}
        {isAdmin === null && sessionReady && <p className="text-muted-foreground text-center">Checking your account...</p>}
        {isAdmin === false && (
          <div className="max-w-sm mx-auto text-center">
            <p className="text-destructive mb-4">This account is not the owner account.</p>
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        )}
        {isAdmin === true && <Dashboard onSignOut={signOut} />}
      </section>
    </Layout>
  );
}
