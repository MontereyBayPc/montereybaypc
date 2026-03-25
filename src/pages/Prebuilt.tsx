import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import pcBudget from "@/assets/pc-budget.jpg";
import pcGaming from "@/assets/pc-gaming.jpg";
import pcHighend from "@/assets/pc-highend.jpg";
import pcWorkstation from "@/assets/pc-workstation.jpg";

const builds = [
  {
    name: "Starter",
    category: "Budget",
    price: 799,
    image: pcBudget,
    specs: ["AMD Ryzen 5 7600", "RTX 4060", "16GB DDR5", "500GB NVMe SSD", "650W PSU"],
    badge: "Best Value",
  },
  {
    name: "Apex",
    category: "Gaming",
    price: 1499,
    image: pcGaming,
    specs: ["AMD Ryzen 7 7800X3D", "RTX 4070 Super", "32GB DDR5", "1TB NVMe SSD", "750W PSU"],
    badge: "Most Popular",
  },
  {
    name: "Titan",
    category: "High-End",
    price: 2999,
    image: pcHighend,
    specs: ["Intel Core i9-14900K", "RTX 4090", "64GB DDR5", "2TB NVMe SSD", "1000W PSU"],
    badge: "Ultimate",
  },
  {
    name: "Creator Pro",
    category: "Workstation",
    price: 2199,
    image: pcWorkstation,
    specs: ["AMD Ryzen 9 7950X", "RTX 4080 Super", "64GB DDR5", "2TB NVMe SSD", "850W PSU"],
    badge: "Pro",
  },
];

const Prebuilt = () => (
  <Layout>
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          label="Prebuilt Systems"
          title="Ready to Ship"
          description="Curated builds for every need and budget. Each system is fully tested and backed by our warranty."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {builds.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-xl overflow-hidden group hover:rgb-glow transition-shadow duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={b.image} alt={b.name} loading="lazy" width={800} height={800} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-3 right-3 gradient-rgb-bg text-primary-foreground border-0 font-display text-[10px] tracking-wider">
                  {b.badge}
                </Badge>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-primary text-xs font-display uppercase tracking-wider">{b.category}</span>
                <h3 className="font-heading text-2xl font-bold text-foreground mt-1">{b.name}</h3>
                <ul className="mt-3 flex-1 flex flex-col gap-1">
                  {b.specs.map((s) => (
                    <li key={s} className="text-muted-foreground text-xs flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-2xl font-bold gradient-rgb-text">${b.price.toLocaleString()}</span>
                  <Button asChild size="sm" className="font-heading font-bold uppercase text-xs tracking-wider gradient-rgb-bg text-primary-foreground hover:opacity-90">
                    <Link to="/contact">Inquire</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Prebuilt;
