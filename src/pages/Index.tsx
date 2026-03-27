import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Cpu, HardDrive, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import heroImg from "@/assets/hero-pc.jpg";

const floatingParts = [
  { icon: Cpu, label: "CPU", x: "10%", y: "20%", delay: 0 },
  { icon: HardDrive, label: "GPU", x: "80%", y: "30%", delay: 0.3 },
  { icon: Monitor, label: "Display", x: "70%", y: "70%", delay: 0.6 },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          src={heroImg}
          alt="Custom gaming PC"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>

      {/* Floating animated icons */}
      {floatingParts.map((part) => (
        <motion.div
          key={part.label}
          className="absolute hidden lg:flex items-center gap-2 text-muted-foreground/30"
          style={{ left: part.x, top: part.y }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 + part.delay, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: part.delay }}
          >
            <part.icon className="w-8 h-8" />
          </motion.div>
        </motion.div>
      ))}

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px bg-foreground/40 mb-8"
          />
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-foreground"
          >
            Custom PCs
            <br />
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-muted-foreground"
            >
              Built for Power
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="text-muted-foreground text-lg mt-6 max-w-lg"
          >
            Handcrafted gaming rigs, workstations, and everyday PCs — engineered for performance. Based in Monterey Bay, CA.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            className="mt-8"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors duration-300"
            >
              Get a Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-foreground/40 to-transparent"
        />
      </motion.div>
    </section>

    {/* Info Cards */}
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-foreground">What to Know</h2>
          <p className="text-muted-foreground mt-4">A few things before you order.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Build Time", desc: "Custom PCs take 1–2 weeks to build, test, and deliver." },
            { title: "Local Only", desc: "We do not ship nationwide. Pickup or local delivery only." },
            { title: "No Warranties", desc: "We do not offer warranties on builds." },
            { title: "Technical Support", desc: "Every build comes with technical support included with your purchase." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="border border-border rounded-lg p-6 bg-card/40 hover:bg-card/60 hover:border-foreground/20 transition-all duration-500"
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border border-border rounded-2xl p-10 lg:p-16 text-center bg-card/30"
        >
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-foreground mb-4">Ready for Your Dream PC?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Reach out for a custom quote — we'd love to build something for you.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors duration-300"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Index;
