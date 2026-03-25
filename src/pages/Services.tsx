import { motion } from "framer-motion";
import { Wrench, ArrowUpCircle, Bug, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const services = [
  { icon: Wrench, title: "Custom PC Building", desc: "From part selection to final testing — we build your dream rig from scratch with meticulous attention to detail.", price: "Starting at $75" },
  { icon: ArrowUpCircle, title: "Upgrades", desc: "CPU, GPU, RAM, storage upgrades — we'll help you pick the right parts and install them professionally.", price: "Starting at $40" },
  { icon: Bug, title: "Troubleshooting & Repair", desc: "Diagnosing hardware failures, software issues, boot problems, and more. Fast turnaround.", price: "Starting at $50" },
  { icon: Sparkles, title: "Cleaning & Optimization", desc: "Deep cleaning, thermal paste replacement, dust removal, OS optimization, and cable management refresh.", price: "Starting at $35" },
];

const Services = () => (
  <Layout>
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
              className="border border-border rounded-xl p-8 group hover:border-foreground/20 transition-all duration-500 bg-card/40"
            >
              <s.icon className="w-10 h-10 text-foreground mb-5 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{s.desc}</p>
              <span className="font-display text-xs text-muted-foreground uppercase tracking-wider">{s.price}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Services;
