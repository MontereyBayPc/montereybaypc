import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingCart, Wind, Droplets, Box, Zap } from "lucide-react";
import { SITE_URL } from "@/seo/routes";
import CanonicalHome from "@/components/CanonicalHome";
import Layout from "@/components/Layout";
import { getPrebuilt } from "@/data/prebuilts";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const PrebuiltDetail = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const pc = getPrebuilt(slug);
  const { addToCart } = useCart();
  const [addStorage, setAddStorage] = useState(false);
  const [addRam, setAddRam] = useState(false);
  const [rush, setRush] = useState(false);

  if (!pc) {
    return (
      <Layout>
        <section className="py-32 container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Build not found</h1>
          <Link to="/prebuilts" className="text-muted-foreground underline">Back to prebuilts</Link>
        </section>
      </Layout>
    );
  }

  const hasRam64 = /64GB|96GB|128GB/.test(pc.specs.ram);
  const upgrades = [
    { on: addStorage, set: setAddStorage, slug: "upgrade-storage-1tb", name: "+1TB NVMe Storage", price: 150, show: true },
    { on: addRam, set: setAddRam, slug: "upgrade-ram-64gb", name: "64GB RAM Upgrade", price: 800, show: !hasRam64 },
    { on: rush, set: setRush, slug: "rush-build", name: "Rush Build (48-72 hours)", price: 100, show: true },
  ].filter((u) => u.show);
  const optionTotal = pc.price + upgrades.reduce((s, u) => s + (u.on ? u.price : 0), 0);

  const addAll = () => {
    addToCart({ slug: pc.slug, name: pc.name, price: pc.price });
    upgrades.forEach((u) => u.on && addToCart({ slug: u.slug, name: u.name, price: u.price }));
  };
  const handleAdd = () => {
    addAll();
    toast.success(`${pc.name} added to cart`);
  };
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${pc.name} Prebuilt Gaming PC`,
      description: pc.description,
      brand: { "@type": "Brand", name: "Monterey Bay PCs" },
      offers: {
        "@type": "Offer",
        price: pc.price,
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/prebuilts/${pc.slug}`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Builds", item: `${SITE_URL}/prebuilts` },
        { "@type": "ListItem", position: 3, name: pc.name, item: `${SITE_URL}/prebuilts/${pc.slug}` },
      ],
    },
  ];

  const specRows = Object.entries(pc.specs);

  return (
    <Layout>
      <CanonicalHome />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <Link to="/prebuilts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10">
            <ArrowLeft className="w-4 h-4" /> All Prebuilts
          </Link>

          <div className="mb-10 overflow-hidden rounded-2xl border border-border">
            <img
              src={pc.image}
              alt={`${pc.name} prebuilt gaming PC`}
              width={1200}
              height={600}
              loading="eager"
              decoding="async"
              className="w-full h-64 lg:h-[420px] object-cover"
            />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">{pc.tier}</span>
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground mt-2 leading-[0.95]">{pc.name}</h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl">{pc.description}</p>
            <p className="mt-4 text-sm text-brand font-heading font-semibold uppercase tracking-widest">Built to order and stress-tested, ready in 1-2 weeks</p>

            <div className="flex flex-wrap gap-2 mt-6">
              {[
                { icon: pc.cooling.startsWith("Quiet") ? Droplets : Wind, label: pc.cooling },
                { icon: Box, label: pc.formFactor },
                ...pc.useCases.map((u) => ({ icon: Zap, label: u })),
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </span>
              ))}
            </div>

            <div className="mt-8 border border-border rounded-2xl p-5 max-w-xl">
              <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Upgrades</h2>
              <div className="space-y-2">
                {upgrades.map((u) => (
                  <label key={u.slug} className="flex items-center justify-between gap-4 cursor-pointer text-foreground">
                    <span className="flex items-center gap-3">
                      <input type="checkbox" checked={u.on} onChange={(e) => u.set(e.target.checked)} className="accent-[hsl(var(--brand))] w-4 h-4" />
                      {u.name}
                    </span>
                    <span className="text-muted-foreground">+${u.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8">
              <span className="font-heading text-4xl font-bold text-foreground">${optionTotal.toLocaleString()}</span>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-6 py-3 rounded-full hover:scale-105 transition-transform"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => {
                  addAll();
                  navigate("/checkout");
                }}
                className="font-heading text-sm font-semibold uppercase tracking-widest border border-border px-6 py-3 rounded-full hover:border-foreground transition-colors"
              >
                Buy Now
              </button>
            </div>
          </motion.div>

          {/* Best For */}
          <div className="mt-16 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Best For</h2>
              <ul className="space-y-3">
                {pc.bestFor.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-foreground">
                    <Check className="w-5 h-5 mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">What's in the Box</h2>
              <ul className="space-y-3">
                {pc.whatsInTheBox.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-foreground">
                    <Check className="w-5 h-5 mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border border-border rounded-2xl p-6 bg-muted/20">
            <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Ready out of the box</h2>
            <ul className="grid sm:grid-cols-3 gap-3 text-foreground text-sm">
              <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" /> Clean Windows 11, zero bloatware</li>
              <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" /> Latest stable BIOS installed</li>
              <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" /> EXPO/XMP memory speed enabled</li>
            </ul>
          </div>

          {/* Specs */}
          <div className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Full Specs</h2>
            <div className="border border-border rounded-2xl overflow-hidden">
              {specRows.map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex justify-between items-center px-6 py-4 ${i % 2 === 0 ? "bg-muted/20" : ""}`}
                >
                  <span className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    {key}
                  </span>
                  <span className="text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Expected Performance</h2>
            <p className="text-muted-foreground mb-6">Average FPS at {pc.performance.resolution}.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {pc.performance.games.map((g) => (
                <div key={g.name} className="border border-border rounded-xl px-5 py-4 flex justify-between items-center">
                  <span className="text-foreground">{g.name}</span>
                  <span className="font-heading font-bold text-foreground">{g.fps}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-10 flex flex-wrap gap-4 justify-between items-center">
            <p className="text-muted-foreground text-sm">Built in 1-2 weeks. Local pickup or delivery in Monterey Bay.</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-6 py-3 rounded-full hover:scale-105 transition-transform"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrebuiltDetail;
