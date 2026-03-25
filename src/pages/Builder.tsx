import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Cpu, MonitorSmartphone, HardDrive, MemoryStick, Fan, Box, Zap, Send } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PartOption {
  name: string;
  price: number;
}

interface PartCategory {
  id: string;
  label: string;
  icon: typeof Cpu;
  options: PartOption[];
}

const parts: PartCategory[] = [
  {
    id: "cpu", label: "Processor (CPU)", icon: Cpu,
    options: [
      { name: "Intel Core i5-14600K", price: 280 },
      { name: "AMD Ryzen 5 7600X", price: 250 },
      { name: "Intel Core i7-14700K", price: 400 },
      { name: "AMD Ryzen 7 7800X3D", price: 380 },
      { name: "Intel Core i9-14900K", price: 580 },
      { name: "AMD Ryzen 9 7950X", price: 550 },
    ],
  },
  {
    id: "gpu", label: "Graphics Card (GPU)", icon: MonitorSmartphone,
    options: [
      { name: "NVIDIA RTX 4060", price: 300 },
      { name: "NVIDIA RTX 4070 Super", price: 600 },
      { name: "NVIDIA RTX 4080 Super", price: 1000 },
      { name: "NVIDIA RTX 4090", price: 1600 },
      { name: "AMD RX 7800 XT", price: 480 },
    ],
  },
  {
    id: "ram", label: "Memory (RAM)", icon: MemoryStick,
    options: [
      { name: "16GB DDR5-5600", price: 60 },
      { name: "32GB DDR5-5600", price: 110 },
      { name: "32GB DDR5-6000", price: 140 },
      { name: "64GB DDR5-6000", price: 260 },
    ],
  },
  {
    id: "storage", label: "Storage", icon: HardDrive,
    options: [
      { name: "500GB NVMe SSD", price: 50 },
      { name: "1TB NVMe SSD", price: 80 },
      { name: "2TB NVMe SSD", price: 150 },
      { name: "1TB + 2TB HDD Combo", price: 120 },
    ],
  },
  {
    id: "cooling", label: "Cooling", icon: Fan,
    options: [
      { name: "Air Cooler (Tower)", price: 40 },
      { name: "240mm AIO Liquid", price: 100 },
      { name: "360mm AIO Liquid", price: 150 },
      { name: "Custom Water Loop", price: 400 },
    ],
  },
  {
    id: "case", label: "Case", icon: Box,
    options: [
      { name: "Mid Tower (Airflow)", price: 80 },
      { name: "Mid Tower (RGB)", price: 120 },
      { name: "Full Tower (Premium)", price: 180 },
      { name: "Compact ITX", price: 100 },
    ],
  },
  {
    id: "psu", label: "Power Supply", icon: Zap,
    options: [
      { name: "650W 80+ Gold", price: 80 },
      { name: "750W 80+ Gold", price: 100 },
      { name: "850W 80+ Gold", price: 130 },
      { name: "1000W 80+ Platinum", price: 200 },
    ],
  },
];

const Builder = () => {
  const [selected, setSelected] = useState<Record<string, number>>({});

  const total = useMemo(
    () => parts.reduce((sum, cat) => sum + (selected[cat.id] !== undefined ? cat.options[selected[cat.id]].price : 0), 0),
    [selected]
  );

  const buildFee = 75;
  const allSelected = parts.every((c) => selected[c.id] !== undefined);

  const handleSubmit = () => {
    toast.success("Build request submitted! We'll reach out within 24 hours.");
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            label="PC Builder"
            title="Design Your Dream Machine"
            description="Select your components below. We'll handle the rest — assembly, cable management, testing, and shipping."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Parts Selection */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {parts.map((cat, ci) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: ci * 0.05 }}
                  className="glass rounded-lg p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <cat.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-heading text-lg font-bold text-foreground">{cat.label}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.options.map((opt, oi) => (
                      <button
                        key={opt.name}
                        onClick={() => setSelected((s) => ({ ...s, [cat.id]: oi }))}
                        className={`text-left px-4 py-3 rounded-md border text-sm transition-all duration-200 ${
                          selected[cat.id] === oi
                            ? "border-primary bg-primary/10 text-foreground rgb-glow"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        <span className="block font-medium">{opt.name}</span>
                        <span className="text-primary text-xs font-display">${opt.price}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass rounded-lg p-6 sticky top-24">
                <h3 className="font-heading text-xl font-bold text-foreground mb-4">Build Summary</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {parts.map((cat) => (
                    <div key={cat.id} className="flex justify-between">
                      <span className="text-muted-foreground">{cat.label}</span>
                      <span className="text-foreground font-medium">
                        {selected[cat.id] !== undefined ? `$${cat.options[selected[cat.id]].price}` : "—"}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border mt-3 pt-3 flex justify-between">
                    <span className="text-muted-foreground">Build Fee</span>
                    <span className="text-foreground font-medium">${buildFee}</span>
                  </div>
                  <div className="border-t border-border mt-2 pt-3 flex justify-between text-lg">
                    <span className="font-heading font-bold text-foreground">Total</span>
                    <span className="font-display font-bold gradient-rgb-text">${total + (allSelected ? buildFee : 0)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!allSelected}
                  className="w-full mt-6 font-heading font-bold uppercase tracking-wider gradient-rgb-bg text-primary-foreground hover:opacity-90 disabled:opacity-40"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Build Request
                </Button>
                {!allSelected && (
                  <p className="text-xs text-muted-foreground text-center mt-2">Select all components to submit</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Builder;
