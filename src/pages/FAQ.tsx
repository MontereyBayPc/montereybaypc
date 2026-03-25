import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const faqs = [
  { q: "How long does a custom build take?", a: "Custom PCs take 1–2 weeks to build, thoroughly test, and prepare for pickup." },
  { q: "Do you offer warranties?", a: "We do not offer warranties on builds, but every system comes with lifetime technical support from our team." },
  { q: "Can I bring my own parts?", a: "Absolutely. We're happy to build with parts you've already purchased." },
  { q: "Do you ship nationwide?", a: "No, we do not ship nationwide. All builds are available for local pickup or delivery in the Monterey Bay area." },
  { q: "What kind of support do you offer?", a: "We offer lifetime technical support for every build. If you ever have questions or issues, we're here to help." },
];

const FAQ = () => (
  <Layout>
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <SectionHeading title="Frequently Asked Questions" />
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border border-border rounded-lg group bg-card/40 hover:bg-card/60 transition-colors duration-500"
            >
              <summary className="px-6 py-4 cursor-pointer font-heading text-lg font-semibold text-foreground list-none flex items-center justify-between">
                {faq.q}
                <span className="text-muted-foreground ml-2 group-open:rotate-45 transition-transform duration-300 text-xl">+</span>
              </summary>
              <p className="px-6 pb-4 text-muted-foreground text-sm">{faq.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default FAQ;
