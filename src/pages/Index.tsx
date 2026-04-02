import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Cpu, HardDrive, ArrowRight, Star } from "lucide-react";
import Layout from "@/components/Layout";
import heroImg1 from "@/assets/hero-pc.jpg";
import heroImg2 from "@/assets/hero-pc-2.jpg";
import heroImg3 from "@/assets/hero-pc-3.jpg";

const heroImages = [heroImg1, heroImg2, heroImg3];

const floatingParts = [
  { icon: Cpu, label: "CPU", x: "10%", y: "20%", delay: 0 },
  { icon: HardDrive, label: "GPU", x: "80%", y: "30%", delay: 0.3 },
  { icon: Monitor, label: "Display", x: "70%", y: "70%", delay: 0.6 },
];

const reviews = [
  { name: "James R.", text: "Monterey Bay PCs built me the perfect streaming rig. Incredible cable management and runs silently!", rating: 5 },
  { name: "Tyler K.", text: "Best investment I've made. My workstation handles 4K video editing like a dream.", rating: 5 },
  { name: "Marcus T.", text: "Fast turnaround, great communication, and the PC looks absolutely insane. 10/10.", rating: 5 },
  { name: "Brandon L.", text: "Got a budget build that outperforms everything in its price range. Super happy!", rating: 5 },
  { name: "Ryan W.", text: "The attention to detail is next level. Clean cables, quiet fans, and blazing fast.", rating: 5 },
];

const infoItems = [
  { number: "01", title: "Build Time", desc: "Custom PCs take 1-2 weeks to build, test, and deliver.", icon: "⏱" },
  { number: "02", title: "Local Only", desc: "We do not ship nationwide. Pickup or local delivery only.", icon: "📍" },
  { number: "03", title: "No Warranties", desc: "We do not offer warranties on builds.", icon: "📋" },
  { number: "04", title: "Technical Support", desc: "Every build comes with technical support included with your purchase.", icon: "🛠" },
];

const Index = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={heroImages[currentImage]}
              alt="Custom gaming PC"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentImage ? "bg-foreground w-6" : "bg-foreground/30"
              }`}
            />
          ))}
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
              Handcrafted gaming rigs, workstations, and everyday PCs, engineered for performance. Based in Monterey Bay, CA.
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

      {/* What to Know - Redesigned */}
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
          <div className="max-w-4xl mx-auto space-y-0">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group relative border-b border-border py-8 flex items-start gap-6 hover:pl-4 transition-all duration-500"
              >
                <span className="font-heading text-5xl lg:text-7xl font-bold text-foreground/5 group-hover:text-foreground/10 transition-colors duration-500 select-none leading-none">
                  {item.number}
                </span>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-heading text-xl lg:text-2xl font-bold text-foreground group-hover:tracking-wider transition-all duration-500">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm lg:text-base max-w-md">{item.desc}</p>
                </div>
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-px bg-foreground group-hover:w-12 transition-all duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-foreground">What Our Customers Say</h2>
          </motion.div>

          <div className="max-w-2xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: reviews[currentReview].rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-foreground text-xl lg:text-2xl font-light italic leading-relaxed mb-8">
                  "{reviews[currentReview].text}"
                </p>
                <span className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {reviews[currentReview].name}
                </span>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    i === currentReview ? "bg-foreground w-6" : "bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Redesigned */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-muted text-foreground p-12 lg:p-20 text-center"
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-background blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-background blur-3xl translate-x-1/3 translate-y-1/3" />
            </div>
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-heading text-4xl lg:text-6xl font-bold mb-4"
              >
                Ready for Your Dream PC?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg"
              >
                Reach out for a custom quote. We'd love to build something for you.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300"
                >
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
