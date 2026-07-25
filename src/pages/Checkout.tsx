import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useCart } from "@/context/CartContext";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

const PRICE_ID_BY_SLUG: Record<string, string> = {
  starter: "prebuilt_starter",
  mid: "prebuilt_mid",
  "high-end": "prebuilt_high_end",
  extreme: "prebuilt_extreme",
};

const Checkout = () => {
  const { items, subtotal } = useCart();
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = delivery === "delivery" ? 75 : 0;
  const total = subtotal + deliveryFee;

  const fetchClientSecret = useMemo(
    () => async (): Promise<string> => {
      const mappedItems = items
        .map((i) => ({ priceId: PRICE_ID_BY_SLUG[i.slug], quantity: i.quantity }))
        .filter((i) => !!i.priceId);
      if (!mappedItems.length) throw new Error("Cart is empty");

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: mappedItems,
          includeDelivery: delivery === "delivery",
          returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.clientSecret) {
        throw new Error(error?.message || data?.error || "Failed to start checkout");
      }
      return data.clientSecret;
    },
    [items, delivery],
  );

  const handleStart = () => {
    setError(null);
    try {
      getStripeEnvironment();
      setStarted(true);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <Layout>
      <CanonicalHome />
      <PaymentTestModeBanner />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h1 className="font-heading text-4xl lg:text-6xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-10 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Secure payment powered by Stripe.
          </p>

          {items.length === 0 ? (
            <div className="text-center py-20 border border-border rounded-2xl">
              <p className="text-muted-foreground mb-6">Your cart is empty.</p>
              <Link to="/prebuilts" className="font-heading text-sm font-semibold uppercase tracking-widest underline">
                Browse prebuilts
              </Link>
            </div>
          ) : !started ? (
            <div className="grid lg:grid-cols-[1fr_400px] gap-10">
              <div>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Delivery
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "pickup", label: "Local Pickup", desc: "Free — Monterey Bay" },
                    { id: "delivery", label: "Local Delivery", desc: "$75 — Within 30mi" },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setDelivery(opt.id as "pickup" | "delivery")}
                      className={`text-left border rounded-xl p-4 transition-colors ${
                        delivery === opt.id ? "border-foreground bg-muted/30" : "border-border hover:border-foreground/50"
                      }`}
                    >
                      <div className="font-heading font-bold text-foreground">{opt.label}</div>
                      <div className="text-muted-foreground text-sm">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="mt-6 border border-red-300 bg-red-50 text-red-800 rounded-xl p-4 text-sm">{error}</div>
                )}

                <button
                  onClick={handleStart}
                  className="mt-8 w-full font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background py-4 rounded-full hover:scale-[1.01] transition-transform"
                >
                  Continue to Payment
                </button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  You'll enter contact, shipping, and card details on the next step.
                </p>
              </div>

              <aside className="lg:sticky lg:top-28 h-fit border border-border rounded-2xl p-6 bg-muted/20">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 mb-6">
                  {items.map((i) => (
                    <div key={i.slug} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {i.name} <span className="text-muted-foreground">× {i.quantity}</span>
                      </span>
                      <span className="text-foreground">${(i.price * i.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">{deliveryFee ? `$${deliveryFee}` : "Free"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">Tax calculated at checkout.</p>
                </div>
                <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                  <span className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Est. Total
                  </span>
                  <span className="font-heading text-2xl font-bold text-foreground">${total.toLocaleString()}</span>
                </div>
              </aside>
            </div>
          ) : (
            <div id="checkout" className="border border-border rounded-2xl overflow-hidden bg-background">
              <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
