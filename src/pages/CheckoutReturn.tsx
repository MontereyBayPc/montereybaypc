import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { BUILD_STAGES } from "@/lib/build-stages";

type Order = {
  name: string;
  stage: string;
  note: string;
  items: { name: string; quantity: number; amount: number }[];
  total: number | null;
  fulfillment: string | null;
  token: string;
};

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!sessionId);

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let tries = 0;
    const load = async () => {
      const { data } = await supabase.functions.invoke("get-order-status", { body: { sessionId } });
      if (cancelled) return;
      if (data?.order) { setOrder(data.order as Order); setLoading(false); return; }
      if (data?.pending && tries++ < 10) { setTimeout(load, 3000); return; }
      setLoading(false);
    };
    void load();
    return () => { cancelled = true; };
  }, [sessionId]);

  const current = order ? BUILD_STAGES.findIndex((s) => s.key === order.stage) : -1;
  const trackUrl = order ? `/build/${order.token}` : "";

  return (
    <Layout>
      <CanonicalHome />
      <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>
      <section className="py-24 container mx-auto px-4 max-w-2xl">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-8"
          >
            <Check className="w-10 h-10" />
          </motion.div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">Order Confirmed</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Thanks for your order! We'll reach out within 24 hours to confirm build details and lead time.
          </p>
        </div>

        {loading && <p className="text-center text-muted-foreground mt-10">Loading your order...</p>}

        {order && (
          <div className="mt-12 space-y-10">
            <div className="border border-border rounded-md p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Your purchase</h2>
              <ul className="space-y-2">
                {order.items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4 text-sm">
                    <span>{it.name}{it.quantity > 1 ? ` x${it.quantity}` : ""}</span>
                    <span className="text-muted-foreground">${it.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              {order.total != null && (
                <p className="flex justify-between font-heading font-semibold border-t border-border mt-4 pt-4">
                  <span>Total paid</span><span>${Number(order.total).toLocaleString()}</span>
                </p>
              )}
              {order.fulfillment && (
                <p className="text-xs text-muted-foreground mt-2">
                  {order.fulfillment === "local_delivery" ? "Local delivery" : "Free local pickup in Monterey"}
                </p>
              )}
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold mb-2">Build progress</h2>
              <p className="text-sm text-muted-foreground">Bookmark your private tracking page to follow each step and see workbench photos.</p>
              <ol className="my-6 border-y border-border">
                {BUILD_STAGES.map((stage, i) => (
                  <li key={stage.key} className={`flex items-center gap-4 py-4 border-b border-border last:border-b-0 ${i <= current ? "text-foreground" : "text-muted-foreground"}`} aria-current={i === current ? "step" : undefined}>
                    {i < current ? <Check className="w-5 h-5 text-brand" /> : <Circle className={`w-5 h-5 ${i === current ? "text-brand" : ""}`} />}
                    <span className="font-heading">{stage.name}</span>
                    {i === current && <span className="ml-auto text-xs text-brand">Current stage</span>}
                  </li>
                ))}
              </ol>
              <Link to={trackUrl} className="inline-block font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-6 py-3 rounded-full">
                Open my tracking page
              </Link>
            </div>
          </div>
        )}

        {!loading && !order && sessionId && (
          <p className="text-center text-xs text-muted-foreground mt-8 break-all">Reference: {sessionId}</p>
        )}

        <div className="mt-12 flex gap-4 justify-center">
          <Link to="/" className="font-heading text-sm font-semibold uppercase tracking-widest border border-border px-6 py-3 rounded-full hover:border-foreground">Back Home</Link>
          <Link to="/prebuilts" className="font-heading text-sm font-semibold uppercase tracking-widest border border-border px-6 py-3 rounded-full hover:border-foreground">Browse More</Link>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutReturn;
