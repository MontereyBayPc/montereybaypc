import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, MemoryStick, HardDrive } from "lucide-react";
import Layout from "@/components/Layout";
import { prebuilts } from "@/data/prebuilts";

const Prebuilts = () => {
  return (
    <Layout>
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

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {prebuilts.map((pc, i) => (
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
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {pc.tier}
                    </span>
                    <span className="font-heading text-2xl font-bold text-foreground">
                      ${pc.price.toLocaleString()}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-2">{pc.name}</h2>
                  <p className="text-muted-foreground mb-6">{pc.tagline}</p>

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
