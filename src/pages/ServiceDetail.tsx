import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Wrench, ArrowUpCircle, Bug, Sparkles, CheckCircle, Clock, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";

const serviceData: Record<string, {
  icon: typeof Wrench;
  title: string;
  tagline: string;
  price: string;
  turnaround: string;
  description: string;
  includes: string[];
  process: { step: string; desc: string }[];
}> = {
  "custom-pc-building": {
    icon: Wrench,
    title: "Custom PC Building",
    tagline: "Your vision, our craftsmanship.",
    price: "Starting at $75 (labor)",
    turnaround: "1 - 2 weeks",
    description: "We work with you from concept to completion. Whether it's a high-end gaming rig, a silent workstation, or a compact ITX build, every PC is assembled with precision, tested rigorously, and delivered ready to perform.",
    includes: [
      "Free consultation on part selection",
      "Full system assembly with cable management",
      "BIOS configuration and OS installation",
      "Thermal paste application with premium compound",
      "48-hour stress testing and benchmarking",
      "Detailed build photos provided",
    ],
    process: [
      { step: "Consultation", desc: "We discuss your needs, budget, and preferences to create the perfect parts list." },
      { step: "Parts Sourcing", desc: "We help you source the best deals or work with parts you already have." },
      { step: "Assembly", desc: "Meticulous assembly with clean cable management and optimal airflow." },
      { step: "Testing", desc: "Comprehensive stress tests, thermal checks, and benchmarks before delivery." },
    ],
  },
  "upgrades": {
    icon: ArrowUpCircle,
    title: "Upgrades",
    tagline: "Breathe new life into your current setup.",
    price: "Starting at $40",
    turnaround: "1 - 3 days",
    description: "Not ready for a full build? We can upgrade specific components to boost your performance. From swapping in a new GPU to adding more RAM or migrating to an SSD, we handle it all professionally.",
    includes: [
      "Component compatibility verification",
      "Professional installation",
      "Driver updates and optimization",
      "Before/after benchmark comparison",
      "Cable management cleanup",
      "System stability testing",
    ],
    process: [
      { step: "Assessment", desc: "We evaluate your current system and identify the best upgrade path." },
      { step: "Recommendation", desc: "We suggest parts that give you the biggest performance boost for your budget." },
      { step: "Installation", desc: "Clean, professional installation with updated drivers and BIOS if needed." },
      { step: "Verification", desc: "We run benchmarks to confirm improved performance and stability." },
    ],
  },
  "troubleshooting-repair": {
    icon: Bug,
    title: "Troubleshooting & Repair",
    tagline: "We diagnose what others can't.",
    price: "Starting at $50",
    turnaround: "1 - 5 days",
    description: "Blue screens, random crashes, boot failures, overheating? We systematically diagnose hardware and software issues to get your PC back up and running. No guesswork, just methodical problem-solving.",
    includes: [
      "Full hardware diagnostic scan",
      "Software and driver conflict resolution",
      "Boot repair and recovery",
      "Malware removal",
      "Component-level failure testing",
      "Post-repair stability verification",
    ],
    process: [
      { step: "Intake", desc: "You describe the issue and we document symptoms, history, and any recent changes." },
      { step: "Diagnosis", desc: "We run systematic tests to isolate the root cause, whether hardware or software." },
      { step: "Repair", desc: "We fix the issue, replace failed components, or reinstall software as needed." },
      { step: "Testing", desc: "Extended testing to make sure the problem is fully resolved before return." },
    ],
  },
  "cleaning-optimization": {
    icon: Sparkles,
    title: "Cleaning & Optimization",
    tagline: "Keep your system running cool and fast.",
    price: "Starting at $35",
    turnaround: "Same day - 1 day",
    description: "Dust buildup, dried thermal paste, and cluttered software can silently kill your PC's performance. Our deep cleaning and optimization service restores your system to peak condition.",
    includes: [
      "Complete internal dust removal",
      "Thermal paste replacement",
      "Fan cleaning and inspection",
      "Cable management refresh",
      "OS optimization and startup cleanup",
      "Temperature monitoring post-service",
    ],
    process: [
      { step: "Inspection", desc: "We assess the current state: dust levels, thermal performance, and software bloat." },
      { step: "Deep Clean", desc: "Careful disassembly and compressed air cleaning of all components." },
      { step: "Thermal Service", desc: "Old thermal paste removed and replaced with premium compound." },
      { step: "Optimization", desc: "Software cleanup, startup programs trimmed, and drivers updated." },
    ],
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Service Not Found</h1>
            <Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">
              Back to Services
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const Icon = service.icon;

  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-heading uppercase tracking-widest mb-12"
            >
              <ArrowLeft className="w-4 h-4" /> All Services
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Icon className="w-14 h-14 text-foreground mb-6" />
            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-foreground mb-3">{service.title}</h1>
            <p className="text-muted-foreground text-xl">{service.tagline}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-6 mt-10"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{service.price}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{service.turnaround}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-foreground/80 text-lg lg:text-xl leading-relaxed"
          >
            {service.description}
          </motion.p>
        </div>
      </section>

      {/* What's Included */}
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-8"
          >
            What's Included
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.includes.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 py-3"
              >
                <CheckCircle className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="pb-24 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-12"
          >
            Our Process
          </motion.h2>
          <div className="space-y-0">
            {service.process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative border-b border-border py-8 pl-16"
              >
                <span className="absolute left-0 top-8 font-heading text-4xl font-bold text-foreground/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{step.step}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">Interested?</h2>
            <p className="text-muted-foreground mb-8">Reach out and let's talk about your project.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
