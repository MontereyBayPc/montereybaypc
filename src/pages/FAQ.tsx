import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";

const faqs = [
  { q: "How long does a custom build take?", a: "Custom PCs take 1-2 weeks to build, thoroughly test, and prepare for pickup." },
  { q: "Do you offer warranties?", a: "We do not offer warranties on builds. However, every system comes with technical support included with your purchase." },
  { q: "Can I bring my own parts?", a: "Absolutely. We're happy to build with parts you've already purchased." },
  { q: "Do you ship nationwide?", a: "No, we do not ship nationwide. All builds are available for local pickup or delivery in the Monterey Bay area." },
  { q: "What kind of support do you offer?", a: "We offer technical support with every PC purchase. If you ever have questions or issues, we're here to help." },
];

const FAQItem = ({ faq, index, isOpen, onToggle }: { faq: typeof faqs[0]; index: number; isOpen: boolean; onToggle: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
  >
    <button
      onClick={onToggle}
      className="w-full text-left group"
    >
      <div className="flex items-center justify-between py-6 border-b border-border">
        <div className="flex items-center gap-6">
          <span className="font-heading text-xs font-semibold text-muted-foreground/40 tracking-widest">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className={`font-heading text-lg lg:text-xl font-semibold transition-colors duration-300 ${isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
            {faq.q}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isOpen ? "text-foreground" : "text-muted-foreground"}`} />
        </motion.div>
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="py-5 pl-12 lg:pl-16 pr-4">
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed max-w-2xl">{faq.a}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Layout>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "3rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-px bg-foreground/40 mb-8"
            />
            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-foreground">
              Frequently Asked
              <br />
              <span className="text-muted-foreground">Questions</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">Everything you need to know before your build.</p>
          </motion.div>

          <div>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
