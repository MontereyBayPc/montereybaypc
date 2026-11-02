import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, MemoryStick, HardDrive } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import { prebuilts } from "@/data/prebuilts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { matchesGameTarget } from "@/lib/shopping";
import { estimatedShipWindow } from '@/lib/operations';

const FILTERS = ["All", "1080p Esports", "1440p High Refresh", "4K Ultra", "Video Editing"];

const Prebuilts = () => {
  const [filter, setFilter] = useState("All");
  const [compare, setCompare] = useState(false);
  const [selected,setSelected]=useState<string[]>([]);
  const [game,setGame]=useState("All games");
  const [preset,setPreset]=useState(0);
  const [target,setTarget]=useState(60);
  const games=["All games",...new Set(prebuilts.flatMap(p=>p.performance.games.map(g=>g.name.replace(/\s*\(.*\)/,""))))];
  const compared=prebuilts.filter(p=>selected.includes(p.slug));
  const shown=prebuilts.filter(p=>(filter==="All"||p.useCases.includes(filter))&&matchesGameTarget(p,game,preset,target));
  const rows: [string, (p: (typeof prebuilts)[number]) => string][] = [
    ["Price", (p) => `$${p.price.toLocaleString()}`],
    ["Best at", (p) => p.performance.resolution],
    ["Processor", (p) => p.specs.cpu],
    ["Graphics", (p) => p.specs.gpu],
    ["Memory", (p) => p.specs.ram],
    ["Storage", (p) => p.specs.storage],
    ["Cooling", (p) => p.cooling],
    ["Size", (p) => p.formFactor],
  ];
  return (
    <Layout>
      <CanonicalHome
      title={"Prebuilt Gaming PCs for Sale | Monterey Bay PCs"}
      description={"Shop hand-assembled prebuilt gaming PCs from Monterey Bay PCs. Four tiers from 1080p starter builds to 4K flagship rigs with full specs."}
    />
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16"
          >
            <div className="h-px w-16 bg-foreground/40 mb-6" />
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground leading-[0.95]">
              Prebuilt PCs
            </h1>
            <p className="text-muted-foreground mt-6 text-lg max-w-xl">
              Curated builds, hand-assembled in Monterey Bay. Click any build for full specs, benchmarks, and to add to cart.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-2 mb-10">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${filter === f ? "border-brand text-foreground bg-brand/10" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
            <Button variant="outline" className="ml-auto rounded-full" disabled={selected.length<2} onClick={()=>setCompare(true)}>Compare selected ({selected.length}/3)</Button>
          </div>

          <div className="flex flex-wrap gap-4 mb-4"> <label className="text-sm">Game<select aria-label="Game filter" className="block bg-background border border-border rounded-md mt-2 p-2 max-w-full" value={game} onChange={e=>setGame(e.target.value)}>{games.map(g=><option key={g}>{g}</option>)}</select></label><label className="text-sm">Settings<select aria-label="Game settings" value={preset} onChange={e=>setPreset(Number(e.target.value))} className="block bg-background border border-border rounded-md mt-2 p-2">{["1080p Ultra","1440p High","4K Max"].map((v,i)=><option value={i} key={v}>{v}</option>)}</select></label><label className="text-sm">Minimum simulated FPS<select aria-label="Minimum simulated FPS" value={target} onChange={e=>setTarget(Number(e.target.value))} className="block bg-background border border-border rounded-md mt-2 p-2">{[30,60,120,144,240].map(n=><option key={n} value={n}>{n}</option>)}</select></label></div><p className="text-xs text-muted-foreground mb-8">FPS filtering uses simulations, not complete-system measurements. Actual results vary.</p>
          <Dialog open={compare} onOpenChange={setCompare}><DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto"><DialogTitle>Compare your builds</DialogTitle><DialogDescription>Listed specifications and intended resolution. Frame rates remain simulated estimates.</DialogDescription><div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4" />
                    {compared.map((p) => (
                      <th key={p.slug} className="text-left p-4 font-heading text-foreground">
                        <Link to={`/prebuilts/${p.slug}`} className="hover:text-brand">{p.name}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, get], i) => (
                    <tr key={label} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="p-4 font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</td>
                      {compared.map((p) => <td key={p.slug} className="p-4 text-foreground">{get(p)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent></Dialog>

          {!shown.length && <p className="py-10 text-muted-foreground">No builds match these targets. Try a lower FPS target or different settings.</p>}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {shown.map((pc, i) => (
              <motion.div
                key={pc.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <label className="flex items-center gap-3 mb-3 text-sm"><Checkbox checked={selected.includes(pc.slug)} disabled={selected.length>=3&&!selected.includes(pc.slug)} aria-label={`Compare ${pc.name}`} onCheckedChange={v=>setSelected(s=>v?[...s,pc.slug]:s.filter(id=>id!==pc.slug))}/>Compare {pc.name}</label>
                <Link
                  to={`/prebuilts/${pc.slug}`}
                  className="group block border border-border rounded-2xl p-8 hover:border-foreground/60 transition-all duration-500 hover:-translate-y-1 bg-muted/20"
                >
                  <div className="mb-6 overflow-hidden rounded-xl border border-border bg-background/40">
                    <img
                      src={pc.image}
                      alt={`${pc.name} prebuilt gaming PC`}
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {pc.tier}
                    </span>
                    <span className="font-heading text-2xl font-bold text-foreground">
                      ${pc.price.toLocaleString()}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-2">{pc.name}</h2>
                  <p className="text-muted-foreground mb-4">{pc.tagline}</p>
                  <span className="inline-block mb-6 rounded-full border border-brand/50 px-3 py-1 text-xs font-heading font-semibold uppercase tracking-widest text-brand">Built to order, 1-2 weeks</span>
                  <p className="text-sm text-foreground mb-2">Estimated ship window: {estimatedShipWindow()}</p>
                  <p className="text-xs text-muted-foreground mb-5">Order today. Subject to parts availability and workshop schedule. Carrier transit is additional.</p>

                  <div className="space-y-2 text-sm border-t border-border pt-5">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Cpu className="w-4 h-4" /> {pc.specs.cpu}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <HardDrive className="w-4 h-4" /> {pc.specs.gpu}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MemoryStick className="w-4 h-4" /> {pc.specs.ram}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-foreground">
                    View Build <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Prebuilts;
