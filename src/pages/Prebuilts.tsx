import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, MemoryStick, HardDrive } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import { prebuilts } from "@/data/prebuilts";

const FILTERS = ["All", "1080p Esports", "1440p High Refresh", "4K Ultra", "Video Editing"];

const Prebuilts = () => {
  const [filter, setFilter] = useState("All");
  const [compare, setCompare] = useState(false);
  const shown = filter === "All" ? prebuilts : prebuilts.filter((p) => p.useCases.includes(filter));
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
            <button type="button" onClick={() => setCompare((c) => !c)} className="ml-auto btn-outline !py-2 !text-xs">
              {compare ? "Hide comparison" : "Compare all builds"}
            </button>
          </div>

          {compare && (
            <div className="mb-12 overflow-x-auto border border-border rounded-2xl">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4" />
                    {prebuilts.map((p) => (
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
                      {prebuilts.map((p) => <td key={p.slug} className="p-4 text-foreground">{get(p)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {shown.map((pc, i) => (
              <motion.div
                key={pc.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
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
