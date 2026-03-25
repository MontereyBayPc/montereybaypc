import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-pc.jpg";

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Custom gaming PC with water cooling" width={1920} height={1080} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-foreground">
            Custom PCs
            <br />
            Built for Power
          </h1>
          <p className="text-muted-foreground text-lg mt-6 max-w-lg">
            Handcrafted gaming rigs, workstations, and everyday PCs — engineered for performance. Based in Monterey Bay, CA.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button asChild size="lg" className="font-heading font-bold uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 transition-all duration-300">
              <Link to="/prebuilt">Shop Builds</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-heading font-bold uppercase tracking-wider border-foreground/20 text-foreground hover:bg-foreground/5 transition-all duration-300">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
        </motion.div>
      </div>
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
            { title: "Lifetime Support", desc: "Every build comes with lifetime technical support from our team." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-border rounded-lg p-6 bg-card/40 hover:bg-card/60 transition-colors duration-500"
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
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Browse our prebuilt systems or reach out for a custom quote.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="font-heading font-bold uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 transition-all duration-300">
              <Link to="/prebuilt">View Builds <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-heading font-bold uppercase tracking-wider border-foreground/20 text-foreground hover:bg-foreground/5 transition-all duration-300">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Index;
