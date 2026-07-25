import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import { useCart } from "@/context/CartContext";

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  return (
    <Layout>
      <section className="py-32 container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-8"
        >
          <Check className="w-10 h-10" />
        </motion.div>
        <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">Order Confirmed</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-2">
          Thanks for your order! We'll reach out within 24 hours to confirm build details and lead time.
        </p>
        {sessionId && (
          <p className="text-xs text-muted-foreground mt-4 break-all">Reference: {sessionId}</p>
        )}
        <div className="mt-10 flex gap-4 justify-center">
          <Link
            to="/"
            className="font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-6 py-3 rounded-full"
          >
            Back Home
          </Link>
          <Link
            to="/prebuilts"
            className="font-heading text-sm font-semibold uppercase tracking-widest border border-border px-6 py-3 rounded-full hover:border-foreground"
          >
            Browse More
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutReturn;
