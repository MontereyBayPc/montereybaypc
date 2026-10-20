import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Copy, Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

type NewBuild = { build_name: string; tracking_token: string; manage_token: string };

const CopyRow = ({ label, url }: { label: string; url: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="border border-border rounded-md p-4">
      <p className="text-xs font-heading text-brand uppercase mb-2">{label}</p>
      <p className="text-sm text-muted-foreground break-all mb-3">{url}</p>
      <Button variant="outline" size="sm" onClick={copy}>
        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
        {copied ? 'Copied' : 'Copy link'}
      </Button>
    </div>
  );
};

export default function BuildAdmin() {
  const [passcode, setPasscode] = useState('');
  const [buildName, setBuildName] = useState('');
  const [build, setBuild] = useState<NewBuild | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { data, error: failure } = await supabase.functions.invoke('manage-build', {
      body: { action: 'create', passcode, build_name: buildName.trim() },
    });
    setBusy(false);
    if (failure || data?.error) {
      setError(data?.error === 'Wrong passcode.' ? 'Wrong passcode.' : 'Could not create the build. Please try again.');
      return;
    }
    setBuild(data.build as NewBuild);
    setBuildName('');
  };

  const origin = window.location.origin;

  return (
    <Layout>
      <Helmet>
        <title>Start a Build | Monterey Bay PCs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="container mx-auto max-w-xl px-4 lg:px-8 py-16 lg:py-24">
        <p className="text-xs font-heading text-brand uppercase mb-3">Owner only</p>
        <h1 className="font-heading text-4xl font-bold mb-8">Start a new build</h1>
        <form onSubmit={create} className="space-y-5">
          <div>
            <label htmlFor="passcode" className="block text-sm text-muted-foreground mb-1">Your passcode</label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-brand"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="buildName" className="block text-sm text-muted-foreground mb-1">Build name (customer sees this)</label>
            <input
              id="buildName"
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              required
              maxLength={120}
              placeholder="e.g. Sarah's Bay Mid Gaming PC"
              className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-brand"
            />
          </div>
          {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Create build tracker'}</Button>
        </form>

        {build && (
          <div className="mt-10 space-y-4">
            <h2 className="font-heading text-2xl font-semibold">{build.build_name}</h2>
            <CopyRow label="Customer link - send this to them" url={`${origin}/build/${build.tracking_token}`} />
            <CopyRow label="Your update link - bookmark this, keep it private" url={`${origin}/build-manage/${build.manage_token}`} />
            <p className="text-sm text-muted-foreground">The customer link expires in 90 days. Your update link works as long as the build exists.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
