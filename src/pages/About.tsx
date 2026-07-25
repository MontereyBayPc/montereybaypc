import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import SectionHeading from "@/components/SectionHeading";
import heroImg from "@/assets/hero-pc.jpg";

const About = () => (
  <Layout>
    <CanonicalHome />
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="About Us" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src={heroImg} alt="Monterey Bay PCs workshop" loading="lazy" width={1920} height={1080} className="rounded-xl border border-border w-full" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Story</h3>
            <p className="text-muted-foreground mb-4">
              Monterey Bay PCs is a small business started by a high schooler with a deep passion for technology and a mission to spread the joy of PCs to everyone.
            </p>
            <p className="text-muted-foreground mb-4">
              What began as building PCs for friends and family quickly grew into something bigger. Based in the Monterey Bay area of California, we pour our heart into every build, from meticulous cable management to thorough stress testing.
            </p>
            <p className="text-muted-foreground">
              Whether you're a competitive gamer, a creative professional, or someone who just wants a reliable everyday PC, we build it right, the first time. Every system is a reflection of our love for what we do.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { value: "15+", label: "PCs Built" },
                { value: "100%", label: "Satisfaction" },
                { value: "24/7", label: "Support" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="font-display text-2xl font-bold text-foreground block">{s.value}</span>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
