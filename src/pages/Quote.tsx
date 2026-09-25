import { useMemo, useState } from "react";
import { Mail } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS } from "@/lib/business";

type Opt = { label: string; price: number };
const groups: { key: string; title: string; options: Opt[] }[] = [
  { key: "use", title: "Main use", options: [
    { label: "Esports / 1080p", price: 0 }, { label: "1440p gaming", price: 0 }, { label: "4K gaming", price: 0 }, { label: "Content creation", price: 0 },
  ] },
  { key: "cpu", title: "Processor", options: [
    { label: "Ryzen 5 / Core i5", price: 180 }, { label: "Ryzen 7 / Core i7", price: 330 }, { label: "Ryzen 9 / Core i9", price: 550 },
  ] },
  { key: "gpu", title: "Graphics card", options: [
    { label: "RTX 4060 class", price: 300 }, { label: "RTX 4070 Super class", price: 600 }, { label: "RTX 4080 Super class", price: 1000 }, { label: "RTX 5090 class", price: 2000 },
  ] },
  { key: "ram", title: "Memory", options: [
    { label: "16GB", price: 50 }, { label: "32GB", price: 100 }, { label: "64GB", price: 200 },
  ] },
  { key: "storage", title: "Storage", options: [
    { label: "1TB SSD", price: 70 }, { label: "2TB SSD", price: 130 }, { label: "4TB SSD", price: 260 },
  ] },
];
const BASE = 350; // case, board, PSU, cooling, OS baseline estimate
const LABOR = 75;

const Quote = () => {
  const [sel, setSel] = useState<Record<string, number>>({ use: 1, cpu: 1, gpu: 1, ram: 1, storage: 1 });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const total = useMemo(
    () => BASE + LABOR + groups.reduce((s, g) => s + g.options[sel[g.key]].price, 0),
    [sel],
  );
  const low = Math.round((total * 0.9) / 50) * 50;
  const high = Math.round((total * 1.1) / 50) * 50;

  const summary = groups.map((g) => `${g.title}: ${g.options[sel[g.key]].label}`).join("\n");
  const mailto = `mailto:${BUSINESS.email}?subject=${encodeURIComponent("Custom PC quote request")}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${summary}\n\nEstimate shown: $${low}-$${high}\n\nNotes: ${notes}`,
  )}`;

  return (
    <Layout>
      <CanonicalHome title={`Custom PC Quote | ${BUSINESS.name}`} description="Pick your parts and get an instant price estimate for a custom PC built in Monterey, CA." />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <Breadcrumbs items={[{ label: "Get a Quote" }]} />
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">Get a Quote</h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Choose what you want and see a rough price right away. We will follow up with an exact parts list and price.
          </p>

          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            <div className="space-y-8">
              {groups.map((g) => (
                <fieldset key={g.key}>
                  <legend className="font-heading text-sm font-semibold uppercase tracking-widest text-foreground mb-3">{g.title}</legend>
                  <div className="flex flex-wrap gap-2">
                    {g.options.map((o, i) => (
                      <button
                        type="button"
                        key={o.label}
                        onClick={() => setSel((s) => ({ ...s, [g.key]: i }))}
                        aria-pressed={sel[g.key] === i}
                        className={`px-4 py-2 rounded-full border text-sm transition-colors ${sel[g.key] === i ? "border-brand text-foreground bg-brand/10" : "border-border text-muted-foreground hover:text-foreground"}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 h-fit border border-border rounded-2xl p-6 bg-card/30">
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">Estimated price</span>
              <p className="font-heading text-4xl font-bold text-foreground mt-2">${low.toLocaleString()} - ${high.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Includes parts and ${LABOR} build fee. Tax and delivery not included. Final price depends on current part prices.</p>
              <form onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }} className="grid gap-4 mt-6">
                <Input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
                <Input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
                <Textarea placeholder="Anything else? Games, budget, style..." value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} />
                <button type="submit" className="btn-brand justify-center"><Mail className="w-4 h-4" /> Send quote request</button>
              </form>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Quote;
