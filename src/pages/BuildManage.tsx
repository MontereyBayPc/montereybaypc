import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Copy, Camera } from 'lucide-react';
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

export default function BuildManage() {
  const { token = '' } = useParams();
  const [build, setBuild] = useState<Build | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error: failure } = await supabase.functions.invoke('manage-build', {
      body: { action: 'get', manage_token: token },
    });
    if (failure || data?.error) {
      setError('This update link is invalid. Start a new build from the owner page.');
    } else {
      setBuild(data.build as Build);
      setNote((data.build as Build).customer_note ?? '');
      setError('');
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  const call = async (body: Record<string, unknown>, okMessage: string) => {
    setStatus('Saving...');
    const { data, error: failure } = await supabase.functions.invoke('manage-build', {
      body: { ...body, manage_token: token },
    });
    if (failure || data?.error) {
      setStatus(data?.error ?? 'Could not save. Please try again.');
      return;
    }
    setBuild(data.build as Build);
    setStatus(okMessage);
    setTimeout(() => setStatus(''), 2500);
  };

  const uploadPhoto = (file: File) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setStatus('Photos must be JPG, PNG, or WebP.');
      return;
    }
    if (file.size > 9_000_000) {
      setStatus('Photo is too large. Keep it under 9 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      void call({ action: 'upload-photo', photo: reader.result as string }, 'Photo added.');
    };
    reader.readAsDataURL(file);
  };

  const copyCustomerLink = async () => {
    if (!build) return;
    await navigator.clipboard.writeText(`${window.location.origin}/build/${build.tracking_token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <Helmet>
        <title>Update Build | Monterey Bay PCs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="container mx-auto max-w-2xl px-4 lg:px-8 py-16 lg:py-24">
        <p className="text-xs font-heading text-brand uppercase mb-3">Owner update page</p>
        {loading && <p className="text-muted-foreground mt-8">Loading build...</p>}
        {error && <p role="alert" className="text-destructive mt-8">{error}</p>}
        {build && (
          <>
            <h1 className="font-heading text-4xl font-bold">{build.build_name}</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Last updated {new Date(build.updated_at).toLocaleString()} - customer link expires {new Date(build.expires_at).toLocaleDateString()}
            </p>

            <div className="mt-6 border border-border rounded-md p-4 flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground break-all flex-1 min-w-0">
                {window.location.origin}/build/{build.tracking_token}
              </p>
              <Button variant="outline" size="sm" onClick={copyCustomerLink}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy customer link'}
              </Button>
            </div>

            <h2 className="font-heading text-2xl font-semibold mt-10 mb-4">Current stage</h2>
            <div className="grid gap-2">
              {BUILD_STAGES.map((stage) => (
                <button
                  key={stage.key}
                  onClick={() => void call({ action: 'update', stage: stage.key }, 'Stage updated.')}
                  className={`flex items-center gap-3 border rounded-md px-4 py-3 text-left font-heading transition-colors ${
                    build.stage === stage.key
                      ? 'border-brand text-brand'
                      : 'border-border text-muted-foreground hover:border-foreground'
                  }`}
                >
                  {build.stage === stage.key && <Check className="w-4 h-4" />}
                  {stage.name}
                </button>
              ))}
            </div>

            <h2 className="font-heading text-2xl font-semibold mt-10 mb-4">Note for the customer</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="e.g. Parts arrived today, starting assembly tomorrow morning."
              className="w-full bg-transparent border border-border rounded-md p-3 outline-none focus:border-brand"
            />
            <Button className="mt-3" onClick={() => void call({ action: 'update', customer_note: note }, 'Note saved.')}>
              Save note
            </Button>

            <h2 className="font-heading text-2xl font-semibold mt-10 mb-4">Workbench photos</h2>
            <p className="text-sm text-muted-foreground mb-3">{build.photo_paths.length} of 20 photos added.</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadPhoto(file);
                e.target.value = '';
              }}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Camera className="w-4 h-4 mr-2" /> Add a photo
            </Button>

            {status && <p role="status" className="mt-6 text-sm text-brand">{status}</p>}
          </>
        )}
      </section>
    </Layout>
  );
}
