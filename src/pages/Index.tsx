import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Shield, Zap, Star, Wrench, MonitorSmartphone } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-pc.jpg";

const features = [
  { icon: Zap, title: "Peak Performance", desc: "Every build is optimized for maximum speed and reliability." },
  { icon: Shield, title: "Quality Parts", desc: "We only use top-tier, trusted components in every system." },
  { icon: Cpu, title: "Custom Tailored", desc: "Each PC is built to match your exact needs and budget." },
  { icon: Star, title: "Premium Aesthetics", desc: "Clean builds with stunning RGB and cable management." },
  { icon: Wrench, title: "Expert Support", desc: "Lifetime support and guidance from our experienced team." },
  { icon: MonitorSmartphone, title: "Full Service", desc: "From building to upgrades, troubleshooting, and cleaning." },
];

const testimonials = [
  { name: "Alex R.", text: "Monterey Bay PCs built me the perfect streaming rig. Incredible cable management and runs silently!", rating: 5 },
  { name: "Sarah K.", text: "Best investment I've made. My workstation handles 4K video editing like a dream.", rating: 5 },
  { name: "Mike T.", text: "Fast turnaround, great communication, and the PC looks absolutely insane. 10/10.", rating: 5 },
];

const faqs = [
  { q: "How long does a custom build take?", a: "Most builds are completed within 5–7 business days, depending on part availability." },
  { q: "Do you offer warranties?", a: "Yes! Every build comes with a 1-year parts & labor warranty, plus lifetime technical support." },
  { q: "Can I bring my own parts?", a: "Absolutely. We're happy to build with parts you've already purchased." },
  { q: "Do you ship nationwide?", a: "Yes, we offer fully insured shipping across the US with careful packaging." },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Custom gaming PC with RGB lighting" width={1920} height={1080} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 block">
            Monterey Bay PCs
          </span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-foreground">
            Custom PCs
            <br />
            <span className="gradient-rgb-text">Built for Power</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-6 max-w-lg">
            Handcrafted gaming rigs, workstations, and everyday PCs — engineered for performance and built with care.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button asChild size="lg" className="font-heading font-bold uppercase tracking-wider gradient-rgb-bg text-primary-foreground hover:opacity-90 transition-opacity">
              <Link to="/builder">Build Your PC</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-heading font-bold uppercase tracking-wider border-primary/30 text-primary hover:bg-primary/10">
              <Link to="/prebuilt">Shop Builds</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading label="Why Choose Us" title="Performance. Reliability. Aesthetics." description="We obsess over every detail so you get a PC that looks as good as it performs." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-lg p-6 group hover:rgb-glow transition-shadow duration-300"
            >
              <f.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 lg:py-28 bg-card/30">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading label="Reviews" title="What Our Customers Say" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-lg p-6"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground text-sm italic mb-4">"{t.text}"</p>
              <span className="text-muted-foreground text-xs font-heading font-semibold uppercase tracking-wider">— {t.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <SectionHeading label="FAQ" title="Frequently Asked Questions" />
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass rounded-lg group"
            >
              <summary className="px-6 py-4 cursor-pointer font-heading text-lg font-semibold text-foreground list-none flex items-center justify-between">
                {faq.q}
                <span className="text-primary ml-2 group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="px-6 pb-4 text-muted-foreground text-sm">{faq.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="gradient-rgb-bg rounded-2xl p-10 lg:p-16 text-center">
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">Ready to Build Your Dream PC?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">Get started with our interactive PC builder or browse our curated prebuilt systems.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="font-heading font-bold uppercase tracking-wider bg-background text-foreground hover:bg-background/90">
              <Link to="/builder">Start Building</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-heading font-bold uppercase tracking-wider border-background/30 text-primary-foreground hover:bg-background/10">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
