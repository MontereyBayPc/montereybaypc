import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { getPrebuilt } from "@/data/prebuilts";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const PrebuiltDetail = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const pc = getPrebuilt(slug);
  const { addToCart } = useCart();

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

  const handleAdd = () => {
    addToCart({ slug: pc.slug, name: pc.name, price: pc.price });
    toast.success(`${pc.name} added to cart`);
  };

  const specRows = Object.entries(pc.specs);

  return (
    <Layout>
      <Helmet>
        <title>{`${pc.name} Prebuilt PC — Monterey Bay PCs`}</title>
        <meta name="description" content={`${pc.name}: ${pc.tagline} ${pc.specs.cpu}, ${pc.specs.gpu}, ${pc.specs.ram}. Hand-built in Monterey Bay, CA.`} />
        <link rel="canonical" href="/" />
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

            <div className="flex flex-wrap items-center gap-6 mt-8">
              <span className="font-heading text-4xl font-bold text-foreground">${pc.price.toLocaleString()}</span>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-6 py-3 rounded-full hover:scale-105 transition-transform"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart({ slug: pc.slug, name: pc.name, price: pc.price });
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
