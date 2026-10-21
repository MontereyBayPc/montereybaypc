import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    (async () => {
      if (!authorizationId) return setError("Missing authorization request.");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/portal?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) { window.location.href = immediate; return; }
      setDetails(data);
    })();
    return () => { active = false; meta.remove(); };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (error) { setBusy(false); return setError(error.message); }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); return setError("No redirect was returned. Please try again."); }
    window.location.href = target;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full border border-border rounded-2xl p-8 grid gap-5">
        {error ? (
          <p className="text-sm text-muted-foreground">Could not load this request: {error}</p>
        ) : !details ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <>
            <h1 className="font-heading text-2xl font-semibold">Connect {details.client?.name ?? "an app"}</h1>
            <p className="text-sm text-muted-foreground">
              This lets {details.client?.name ?? "the app"} use Monterey Bay PCs tools as you.
            </p>
            <div className="flex gap-3">
              <button disabled={busy} onClick={() => decide(true)} className="btn-brand">Approve</button>
              <button disabled={busy} onClick={() => decide(false)} className="rounded-full border border-border px-5 py-2 text-sm">Deny</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
