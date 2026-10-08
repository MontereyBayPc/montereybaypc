import { useEffect, useMemo, useState } from "react";
import { Mail, Link2, AlertTriangle, Printer, Save } from "lucide-react";
import { boardRam, boardSocket, cpuSocket, minPsu, psuWatts, ramGen, RECOMMENDED, systemWatts, formatPhone } from "@/lib/compat";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS } from "@/lib/business";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Part = { id: string; category: string; name: string; price: number; price_updated_at: string | null };

const CATEGORIES: { key: string; title: string; multi?: boolean }[] = [
  { key: "cpu", title: "Processor" },
  { key: "gpu", title: "Graphics card" },
  { key: "motherboard", title: "Motherboard" },
  { key: "ram", title: "Memory" },
  { key: "storage", title: "Storage" },
  { key: "case", title: "Case" },
  { key: "psu", title: "Power supply" },
  { key: "cooler", title: "CPU cooler" },
  { key: "fans", title: "Extra fans" },
  { key: "os", title: "Operating system" },
  { key: "extras", title: "Extras", multi: true },
];

const NONE = "none";
const BUILD_FEE_PCT = 0.1;
const MIN_BUILD_FEE = 75;

const Quote = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<Record<string, string>>({});
  const [extras, setExtras] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); setLoadError((e) => e || true); }, 15000);
    supabase
      .from("parts")
      .select("id,category,name,price,price_updated_at")
      .order("sort")
      .then(({ data, error }) => {
        clearTimeout(timer);
        setParts((data ?? []) as Part[]);
        setLoadError(!!error || !data?.length);
        setLoading(false);
        try {
          const b = new URLSearchParams(window.location.search).get("b");
          if (b) {
            const parsed = JSON.parse(atob(b));
            if (parsed.s) setSel(parsed.s);
            if (Array.isArray(parsed.e)) setExtras(parsed.e);
          }
        } catch { /* ignore bad link */ }
      });
    return () => clearTimeout(timer);
  }, []);

  const byCat = useMemo(() => {
    const m: Record<string, Part[]> = {};
    for (const p of parts) (m[p.category] ??= []).push(p);
    return m;
  }, [parts]);
  const byId = useMemo(() => Object.fromEntries(parts.map((p) => [p.id, p])), [parts]);

  const chosen = [
    ...Object.values(sel).filter((id) => id && id !== NONE).map((id) => byId[id]),
    ...extras.map((id) => byId[id]),
  ].filter(Boolean) as Part[];

  const pick = (cat: string) => { const id = sel[cat]; return id && id !== NONE ? byId[id] : undefined; };
  const cpu = pick("cpu"), board = pick("motherboard"), ram = pick("ram"), gpu = pick("gpu"), psu = pick("psu");
  const isIncompatible = (cat: string, p: Part): string | null => {
    if (cat === "motherboard" && cpu && cpuSocket(cpu.name) && boardSocket(p.name) && cpuSocket(cpu.name) !== boardSocket(p.name)) return "wrong socket";
    if (cat === "cpu" && board && boardSocket(board.name) && cpuSocket(p.name) && cpuSocket(p.name) !== boardSocket(board.name)) return "wrong socket";
    if (cat === "ram" && board && boardRam(board.name) && ramGen(p.name) && ramGen(p.name) !== boardRam(board.name)) return `needs ${boardRam(board.name)}`;
    if (cat === "motherboard" && ram && boardRam(p.name) && ramGen(ram.name) && ramGen(ram.name) !== boardRam(p.name)) return "wrong memory type";
    return null;
  };
  const warnings: string[] = [];
  if (board && isIncompatible("motherboard", board) && cpu) warnings.push(`${cpu.name} does not fit the ${board.name}.`);
  if (ram && board && isIncompatible("ram", ram)) warnings.push(`${board.name} needs ${boardRam(board.name)} memory.`);
  const watts = systemWatts(cpu?.name, gpu?.name);
  const neededPsu = minPsu(watts);
  const psuW = psu ? psuWatts(psu.name) : null;
  if (psuW && (cpu || gpu) && psuW < neededPsu) warnings.push(`Your power supply (${psuW}W) is too weak. Pick ${neededPsu}W or more.`);

  const DRAFTS_KEY = "mbpc_quote_drafts";
  const [drafts, setDrafts] = useState<{ name: string; s: Record<string, string>; e: string[]; total: number }[]>(() => {
    try { return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]"); } catch { return []; }
  });
  const persistDrafts = (d: typeof drafts) => { setDrafts(d); localStorage.setItem(DRAFTS_KEY, JSON.stringify(d)); };
  const saveDraft = () => {
    if (!chosen.length) { toast.error("Pick at least one part first."); return; }
    persistDrafts([{ name: `Build ${drafts.length + 1} (${new Date().toLocaleDateString()})`, s: sel, e: extras, total }, ...drafts].slice(0, 6));
    toast.success("Build saved on this device");
  };

  const shareLink = () => {
    const b = btoa(JSON.stringify({ s: sel, e: extras }));
    const url = `${window.location.origin}/quote?b=${b}`;
    navigator.clipboard?.writeText(url).then(() => toast.success("Build link copied"), () => toast.message(url));
  };

  const partsTotal = chosen.reduce((s, p) => s + Number(p.price), 0);
  const buildFee = Math.max(MIN_BUILD_FEE, Math.round(partsTotal * BUILD_FEE_PCT));
  const total = partsTotal + buildFee;

  const lastUpdated = parts.reduce<string | null>(
    (a, p) => (p.price_updated_at && (!a || p.price_updated_at > a) ? p.price_updated_at : a),
    null,
  );

  const summary = CATEGORIES.map((c) => {
    if (c.multi) return `${c.title}: ${extras.map((id) => byId[id]?.name).join(", ") || "None"}`;
    const id = sel[c.key];
    const label = id === NONE ? "None / I already have one" : id ? byId[id]?.name : "Not chosen";
    return `${c.title}: ${label}`;
  }).join("\n");

  const mailto = `mailto:${BUSINESS.email}?subject=${encodeURIComponent("Custom PC quote request")}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${summary}\n\nParts: $${partsTotal}\nBuild fee: $${buildFee}\nEstimate: $${total}\n\nNotes: ${notes}`,
  )}`;

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (warnings.length) {
      toast.error("Fix the compatibility warnings first.");
      return;
    }
    if (!chosen.length) {
      toast.error("Pick at least one part first.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("quote_requests").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      notes: notes.trim() || null,
      parts: CATEGORIES.map((c) => ({ category: c.title, choice: summary.split("\n").find((l) => l.startsWith(c.title + ":"))?.slice(c.title.length + 2) })),
      parts_total: partsTotal,
      build_fee: buildFee,
      estimated_total: total,
    });
    setSending(false);
    if (error) {
      toast.error("Could not send. Please email or call us instead.");
      return;
    }
    setSent(true);
  };

  const selectCls =
    "w-full bg-transparent border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand";

  return (
    <Layout>
      <CanonicalHome title={`Custom PC Quote | ${BUSINESS.name}`} description="Pick every part and get a live price estimate for a custom PC built in Monterey, CA." />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <Breadcrumbs items={[{ label: "Get a Quote" }]} />
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">Get a Quote</h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Pick each part, or choose "None" if you already have it. Parts that do not fit together are blocked, and ★ marks our best-value picks. Prices are checked against stores every day.
          </p>

          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            <div className="space-y-6">
              {loading && <p className="text-muted-foreground">Loading parts...</p>}
              {loadError && (
                <div className="border border-border rounded-2xl p-6 text-muted-foreground">
                  Parts list could not load right now. Call <a className="text-foreground underline" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> or email <a className="text-foreground underline" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> and we will quote you directly.
                </div>
              )}
              {!loading &&
                CATEGORIES.map((c) => (
                  <fieldset key={c.key}>
                    <legend className="font-heading text-sm font-semibold uppercase tracking-widest text-foreground mb-3">{c.title}{c.key === "psu" && (cpu || gpu) && <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">Recommended: {neededPsu}W+ (est. draw {watts}W)</span>}</legend>
                    {c.multi ? (
                      <div className="flex flex-wrap gap-2">
                        {(byCat[c.key] ?? []).map((p) => {
                          const on = extras.includes(p.id);
                          return (
                            <button
                              type="button"
                              key={p.id}
                              aria-pressed={on}
                              onClick={() => setExtras((x) => (on ? x.filter((i) => i !== p.id) : [...x, p.id]))}
                              className={`px-4 py-2 rounded-full border text-sm transition-colors ${on ? "border-brand text-foreground bg-brand/10" : "border-border text-muted-foreground hover:text-foreground"}`}
                            >
                              {p.name} <span className="opacity-60">${Number(p.price)}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <select
                        className={selectCls}
                        value={sel[c.key] ?? ""}
                        onChange={(e) => setSel((s) => ({ ...s, [c.key]: e.target.value }))}
                      >
                        <option value="" className="bg-background">Choose...</option>
                        <option value={NONE} className="bg-background">None / I already have one</option>
                        {(byCat[c.key] ?? []).map((p) => {
                          const bad = isIncompatible(c.key, p);
                          return (
                            <option key={p.id} value={p.id} disabled={!!bad} className="bg-background">
                              {RECOMMENDED.includes(p.name) ? "★ " : ""}{p.name} - ${Number(p.price)}{bad ? ` (${bad})` : ""}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </fieldset>
                ))}
            </div>

            <aside className="lg:sticky lg:top-24 h-fit border border-border rounded-2xl p-6 bg-card/30">
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">Estimated price</span>
              <p className="font-heading text-4xl font-bold text-foreground mt-2">${total.toLocaleString()}</p>
              {warnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {warnings.map((w) => (
                    <p key={w} className="flex gap-2 text-sm text-destructive"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{w}</p>
                  ))}
                </div>
              )}
              {chosen.length > 0 && (
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer text-foreground">Itemized parts ({chosen.length})</summary>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {chosen.map((p) => (
                      <li key={p.id} className="flex justify-between gap-3"><span>{p.name}</span><span>${Number(p.price).toLocaleString()}</span></li>
                    ))}
                  </ul>
                </details>
              )}
              <div className="text-sm text-muted-foreground mt-3 space-y-1">
                <div className="flex justify-between"><span>Parts</span><span>${partsTotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Build fee (10%, min $75)</span><span>${buildFee.toLocaleString()}</span></div>
              </div>
              <div className="mt-4 flex flex-col gap-2 print:hidden">
                <button type="button" onClick={shareLink} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Link2 className="w-4 h-4" /> Copy a link to this build</button>
                <button type="button" onClick={saveDraft} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Save className="w-4 h-4" /> Save this build</button>
                <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Printer className="w-4 h-4" /> Print or save as PDF</button>
              </div>
              {drafts.length > 0 && (
                <div className="mt-4 print:hidden">
                  <p className="text-xs font-heading uppercase tracking-widest text-muted-foreground mb-2">Saved builds</p>
                  <ul className="space-y-1 text-sm">
                    {drafts.map((d, i) => (
                      <li key={i} className="flex justify-between gap-2">
                        <button type="button" className="text-foreground underline text-left" onClick={() => { setSel(d.s); setExtras(d.e); }}>{d.name}</button>
                        <span className="text-muted-foreground">${d.total.toLocaleString()}</span>
                        <button type="button" aria-label="Delete saved build" className="text-muted-foreground" onClick={() => persistDrafts(drafts.filter((_, j) => j !== i))}>×</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Tax and delivery not included.{lastUpdated && ` Prices last checked ${new Date(lastUpdated).toLocaleDateString()}.`}
              </p>
              {sent ? (
                <div className="mt-6 border border-brand rounded-2xl p-5 text-sm text-foreground">
                  Quote request received. We will reply within 1 business day.
                  <a href={mailto} className="block mt-3 text-muted-foreground underline">Email a copy instead</a>
                </div>
              ) : (
                <form onSubmit={submitQuote} className="grid gap-4 mt-6">
                  <Input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
                  <Input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
                  <Input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} maxLength={30} />
                  <Textarea placeholder="Anything else? Games, budget, style..." value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} />
                  <button type="submit" disabled={sending} className="btn-brand justify-center"><Mail className="w-4 h-4" /> {sending ? "Sending..." : "Send quote request"}</button>
                </form>
              )}
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Quote;
