import { motion } from "framer-motion";
import { ArrowRight, Box, Check, Cpu, Gem, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CanonicalHome from "@/components/CanonicalHome";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import beastImage from "@/assets/the-beast-showcase.png.asset.json";
import { toast } from "sonner";

const beastImageUrl = `https://montereybaypcs.com${beastImage.url}`;

const beast = {
  slug: "the-beast",
  name: "The Beast",
  price: 100000,
};

const visibleParts = [
  ["Processor platform", "AMD Ryzen Threadripper PRO 9000 WX-Series"],
  ["Motherboard", "ASUS Pro WS WRX90E-SAGE SE workstation board"],
  ["Graphics", "NVIDIA RTX PRO 6000 Blackwell workstation GPU"],
  ["Power", "ASUS Pro WS 3000W power supply"],
  ["Primary storage", "Samsung 9100 PRO NVMe SSD"],
  ["Additional storage", "Samsung 990 PRO NVMe SSDs"],
  ["CPU cooling", "EK-Quantum Velocity water block"],
  ["Radiators", "EK-Quantum Surface liquid-cooling radiators"],
  ["Cooling hardware", "Bitspower pumps, blocks, fittings and reservoirs"],
  ["Chassis", "One-of-one spherical panoramic showcase enclosure"],
];

const TheBeast = () => {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const inCart = items.some((item) => item.slug === beast.slug);

  const addBeast = () => {
    if (inCart) {
      toast.info("The Beast is already reserved in your cart");
      return;
    }
    addToCart(beast);
    toast.success("The Beast is reserved in your cart");
  };

  const buyNow = () => {
    if (!inCart) addToCart(beast);
    navigate("/checkout");
  };

  return (
    <Layout>
      <CanonicalHome
        title="The Beast | One-of-One $100,000 PC | Monterey Bay PCs"
        description="Meet The Beast, a one-of-one $100,000 custom workstation and gaming PC with RTX PRO Blackwell graphics and a spherical liquid-cooled showcase chassis."
      />

      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden border-b border-border lg:min-h-[calc(100svh-5rem)]">
        <img
          src={beastImageUrl}
          alt="The Beast spherical custom PC with its workstation hardware and liquid-cooling components"
          width={1365}
          height={767}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        <div className="container relative mx-auto flex min-h-[calc(100svh-4rem)] items-end px-4 pb-12 pt-28 lg:min-h-[calc(100svh-5rem)] lg:px-8 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand/15 px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-brand">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> Only 1 available
              </span>
              <span className="font-heading text-xs font-semibold uppercase tracking-widest text-foreground/80">
                One of one
              </span>
            </div>
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-widest text-brand">Monterey Bay PCs presents</p>
            <h1 className="font-heading text-6xl font-extrabold uppercase leading-[0.85] text-foreground sm:text-7xl lg:text-9xl">
              The Beast
            </h1>
            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-2xl text-base text-foreground/80 sm:text-lg">
                A no-compromise spherical showpiece built around professional Blackwell graphics, Threadripper PRO power and an exhibition-grade custom liquid-cooling system.
              </p>
              <p className="shrink-0 font-heading text-4xl font-bold text-foreground lg:text-6xl">$100,000</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border py-16 lg:py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-heading text-xs font-semibold uppercase tracking-widest text-brand">Unrepeatable by design</span>
            <h2 className="mt-4 font-heading text-4xl font-bold text-foreground lg:text-6xl">Not a PC. A centerpiece.</h2>
            <p className="mt-6 max-w-lg text-muted-foreground">
              The Beast combines workstation-class hardware with a transparent panoramic shell and a fully custom cooling loop. Every visible component is staged as part of the build.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
              {[
                ["1 of 1", "Availability"],
                ["3000W", "Power platform"],
                ["Blackwell", "Graphics"],
              ].map(([value, label]) => (
                <div key={label} className="bg-background p-4 text-center sm:p-6">
                  <div className="font-heading text-lg font-bold text-foreground sm:text-2xl">{value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            {[
              { icon: Cpu, title: "Workstation core", copy: "Threadripper PRO and RTX PRO Blackwell hardware for extreme creative and compute workloads." },
              { icon: Sparkles, title: "Museum-grade presence", copy: "A panoramic spherical chassis turns the machine into the focal point of any room." },
              { icon: Gem, title: "Custom water cooling", copy: "Premium EK and Bitspower components form a purpose-built cooling system." },
              { icon: ShieldCheck, title: "One client only", copy: "Only one Beast is available. Once reserved, this configuration is gone." },
            ].map(({ icon: Icon, title, copy }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-background p-7 lg:p-8"
              >
                <Icon className="h-6 w-6 text-brand" />
                <h3 className="mt-8 font-heading text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-heading text-xs font-semibold uppercase tracking-widest text-brand">Hardware shown</span>
              <h2 className="mt-3 font-heading text-4xl font-bold text-foreground lg:text-6xl">The parts behind the spectacle</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">Final component revisions and exact capacities are confirmed with the buyer before assembly.</p>
          </div>

          <div className="border-y border-border">
            {visibleParts.map(([label, value], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.04, 0.24) }}
                className="grid gap-2 border-b border-border px-2 py-5 last:border-b-0 sm:grid-cols-[220px_1fr] sm:items-center lg:px-6"
              >
                <span className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
                <span className="text-base text-foreground sm:text-lg">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <Box className="mx-auto h-8 w-8 text-brand" />
          <p className="mt-5 font-heading text-xs font-bold uppercase tracking-widest text-brand">Only 1 available</p>
          <h2 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-bold text-foreground lg:text-7xl">Once it is claimed, it is gone.</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">Reserve The Beast for $100,000. Monterey Bay PCs will contact you to confirm the final specification, build schedule, pickup or delivery.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={buyNow} className="h-auto rounded-full bg-brand px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-brand-foreground hover:bg-brand/90">
              Reserve The Beast <ArrowRight />
            </Button>
            <Button onClick={addBeast} disabled={inCart} variant="outline" className="h-auto rounded-full px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest">
              {inCart ? "Reserved in cart" : "Add to cart"}
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Check className="h-4 w-4 text-brand" /> One unit maximum per order
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TheBeast;