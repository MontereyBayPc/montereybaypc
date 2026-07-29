import { motion } from "framer-motion";
import { Wrench, ArrowUpCircle, Bug, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import SectionHeading from "@/components/SectionHeading";

const services = [
  { icon: Wrench, title: "Custom PC Building", slug: "custom-pc-building", desc: "From part selection to final testing, we build your dream rig from scratch with meticulous attention to detail.", price: "Starting at $75" },
  { icon: ArrowUpCircle, title: "Upgrades", slug: "upgrades", desc: "CPU, GPU, RAM, storage upgrades. We'll help you pick the right parts and install them professionally.", price: "Starting at $40" },
  { icon: Bug, title: "Troubleshooting & Repair", slug: "troubleshooting-repair", desc: "Diagnosing hardware failures, software issues, boot problems, and more. Fast turnaround.", price: "Starting at $50" },
  { icon: Sparkles, title: "Cleaning & Optimization", slug: "cleaning-optimization", desc: "Deep cleaning, thermal paste replacement, dust removal, OS optimization, and cable management refresh.", price: "Starting at $35" },
];

const Services = () => (
  <Layout>
    <CanonicalHome
      title={"PC Repair & Upgrade Services in Monterey Bay, CA | Monterey Bay PCs"}
      description={"PC repair and upgrade services in Monterey Bay, CA: custom builds, GPU and RAM upgrades, troubleshooting, deep cleaning. Fast local turnaround."}
    />
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="What We Offer" description="Professional PC services from passionate enthusiasts." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/services/${s.slug}`}
                className="block border border-border rounded-xl p-8 group hover:border-foreground/20 transition-all duration-500 bg-card/40"
              >
                <s.icon className="w-10 h-10 text-foreground mb-5 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs text-muted-foreground uppercase tracking-wider">{s.price}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Services;
