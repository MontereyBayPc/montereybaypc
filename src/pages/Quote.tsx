import { useEffect, useMemo, useState } from "react";
import { Mail } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS } from "@/lib/business";
import { supabase } from "@/integrations/supabase/client";

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
            Pick each part, or choose "None" if you already have it. Prices are checked against stores every day.
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
                    <legend className="font-heading text-sm font-semibold uppercase tracking-widest text-foreground mb-3">{c.title}</legend>
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
                        {(byCat[c.key] ?? []).map((p) => (
                          <option key={p.id} value={p.id} className="bg-background">
                            {p.name} - ${Number(p.price)}
                          </option>
                        ))}
                      </select>
                    )}
                  </fieldset>
                ))}
            </div>

            <aside className="lg:sticky lg:top-24 h-fit border border-border rounded-2xl p-6 bg-card/30">
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">Estimated price</span>
              <p className="font-heading text-4xl font-bold text-foreground mt-2">${total.toLocaleString()}</p>
              <div className="text-sm text-muted-foreground mt-3 space-y-1">
                <div className="flex justify-between"><span>Parts</span><span>${partsTotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Build fee (10%, min $75)</span><span>${buildFee.toLocaleString()}</span></div>
              </div>
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
                  <Input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
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
