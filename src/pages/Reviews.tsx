import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const testimonials = [
  { name: "Alex R.", text: "Monterey Bay PCs built me the perfect streaming rig. Incredible cable management and runs silently!", rating: 5 },
  { name: "Sarah K.", text: "Best investment I've made. My workstation handles 4K video editing like a dream.", rating: 5 },
  { name: "Mike T.", text: "Fast turnaround, great communication, and the PC looks absolutely insane. 10/10.", rating: 5 },
];

const Reviews = () => (
  <Layout>
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <SectionHeading title="What Our Customers Say" />
        <div className="flex flex-col gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-border rounded-lg p-6 bg-card/40 hover:bg-card/60 transition-colors duration-500"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-foreground text-sm italic mb-4">"{t.text}"</p>
              <span className="text-muted-foreground text-xs font-heading font-semibold uppercase tracking-wider">— {t.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Reviews;
