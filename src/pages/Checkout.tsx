import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  "the-beast": "the_beast",
  "upgrade-storage-1tb": "upgrade_storage_1tb",
  "upgrade-ram-64gb": "upgrade_ram_64gb",
  "rush-build": "rush_build",
};

type Fulfillment = "pickup" | "shipping";

const Checkout = () => {
  const cart = useCart();
  const [params] = useSearchParams();
  const quoteToken = params.get("quote");
  const [quote, setQuote] = useState<{ name: string; total: number; paid: boolean } | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteUpdated, setQuoteUpdated] = useState(false);
  const [started, setStarted] = useState(false);
  const lastTotal = useRef<number | null>(null);
  useEffect(() => {
    if (!quoteToken) return;
    let cancelled = false;
    const load = () =>
      supabase.functions.invoke("quote-approval", { body: { action: "get", token: quoteToken } }).then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.total) {
          setQuoteError("This quote link is not valid or has not been approved yet.");
          return;
        }
        if (lastTotal.current !== null && data.total !== lastTotal.current) {
          setQuoteUpdated(true);
          setStarted(false);
        }
        lastTotal.current = data.total;
        setQuote(data);
      });
    load();
    const timer = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [quoteToken]);
  const items = quoteToken
    ? (quote && !quote.paid ? [{ slug: "approved-quote", name: "Approved Custom PC Build", price: quote.total, quantity: 1 }] : [])
    : cart.items;
  const subtotal = quoteToken ? (quote?.total ?? 0) : cart.subtotal;
  const [delivery, setDelivery] = useState<Fulfillment>("pickup");
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [zone, setZone] = useState<{ price: number; label: string } | null>(null);
  const [zoneLoading, setZoneLoading] = useState(false);
  useEffect(() => {
    setZone(null);
    if (delivery !== "shipping" || !/^\d{5}$/.test(zip)) return;
    let cancelled = false;
    setZoneLoading(true);
    supabase.functions.invoke("shipping-quote", { body: { zip } }).then(({ data }) => {
      if (cancelled) return;
      setZoneLoading(false);
      if (data?.price) setZone({ price: data.price, label: data.label });
    });
    return () => {
      cancelled = true;
    };
  }, [delivery, zip]);
  const deliveryFee = zone ? zone.price : 0;
  const total = subtotal + deliveryFee;

  const fetchClientSecret = useMemo(
    () => async (): Promise<string> => {
      const mappedItems = items
        .map((i) => ({ priceId: PRICE_ID_BY_SLUG[i.slug], quantity: i.quantity }))
        .filter((i) => !!i.priceId);
      if (!mappedItems.length && !quoteToken) throw new Error("Cart is empty");

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: mappedItems,
          ...(quoteToken && { quoteToken }),
          fulfillment: delivery,
          shipZip: delivery === "shipping" ? zip : undefined,
          returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.clientSecret) {
        throw new Error(error?.message || data?.error || "Failed to start checkout");
      }
      return data.clientSecret;
    },
    [items, delivery, zip, quoteToken],
  );

  const handleStart = () => {
    setError(null);
    if (delivery === "shipping" && !zone) {
      setError("Enter your 5-digit ZIP code to calculate shipping.");
      return;
    }
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
            <Lock className="w-4 h-4" /> Secure payment powered by Stripe. Card, Apple Pay and Google Pay accepted.
          </p>

          {items.length === 0 ? (
            <div className="text-center py-20 border border-border rounded-2xl">
              <p className="text-muted-foreground mb-6">{quoteToken ? (quoteError ?? (quote?.paid ? "This quote has already been paid. Thank you!" : "Loading your approved quote...")) : "Your cart is empty."}</p>
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
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: "pickup", label: "Local Pickup", desc: "Free, Monterey Bay" },
                    { id: "shipping", label: "US Shipping", desc: "Insured, priced by your ZIP" },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setDelivery(opt.id as Fulfillment)}
                      className={`text-left border rounded-xl p-4 transition-colors ${
                        delivery === opt.id ? "border-foreground bg-muted/30" : "border-border hover:border-foreground/50"
                      }`}
                    >
                      <div className="font-heading font-bold text-foreground">{opt.label}</div>
                      <div className="text-muted-foreground text-sm">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                {delivery === "shipping" && (
                  <div className="mt-6">
                    <label htmlFor="ship-zip" className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Shipping ZIP code
                    </label>
                    <input
                      id="ship-zip"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={5}
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="e.g. 90210"
                      className="mt-2 w-full bg-transparent border-b border-border py-2 text-lg outline-none focus:border-foreground"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {zoneLoading
                        ? "Getting live carrier rates for your ZIP..."
                        : zone
                        ? `Shipping to ${zone.label}: $${zone.price}, insured, foam-packed with signature on delivery.`
                        : "Enter your ZIP to see your shipping price. Use the same ZIP as your shipping address."}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-6 border border-red-300 bg-red-50 text-red-800 rounded-xl p-4 text-sm">{error}</div>
                )}

                <button
                  onClick={handleStart}
                  className="mt-8 w-full font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background py-4 rounded-full hover:scale-[1.01] transition-transform"
                >
                  Continue to Payment
                </button>
                <div className="mt-4 border border-border rounded-xl p-4 text-sm">
                  <p className="font-heading font-semibold text-foreground">48-hour refund policy</p>
                  <p className="text-muted-foreground mt-1">
                    Changed your mind? Cancel within 48 hours of purchase for a full refund to your original payment method, as long as your build has not shipped. Use the Cancel and refund button on your order tracker, no questions asked. See our <Link to="/legal/returns" className="underline">returns policy</Link>.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  You'll enter contact, shipping, card details, and any promo code on the next step.
                </p>
                <p className="text-xs text-muted-foreground mt-3 text-center">Ordering is subject to our <Link to="/legal/shipping" className="underline">shipping policy</Link>, <Link to="/legal/returns" className="underline">returns policy</Link> and <Link to="/legal/terms" className="underline">terms</Link>. Build time excludes carrier transit.</p>
              </div>

              <aside className="lg:sticky lg:top-28 h-fit border border-border rounded-2xl p-6 bg-muted/20">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Order Summary
                </h3>
                {quoteUpdated && (
                  <p className="text-xs text-brand border border-brand/40 rounded-lg px-3 py-2 mb-4">
                    Monterey Bay PCs updated your quote. Your new total is shown below.
                  </p>
                )}
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
                    <span className="text-muted-foreground">{delivery === "shipping" ? "Shipping" : "Pickup"}</span>
                    <span className="text-foreground">
                      {delivery === "shipping" && !zone ? (zoneLoading ? "..." : "Enter ZIP") : deliveryFee ? `$${deliveryFee}` : "Free"}
                    </span>
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
