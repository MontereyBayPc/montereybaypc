import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import SectionHeading from "@/components/SectionHeading";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

type Plan = {
  id: string;
  priceId: string;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    id: "essential",
    priceId: "detail_essential_yearly",
    name: "Essential",
    price: 50,
    tagline: "One deep PC cleaning every year.",
    features: [
      "1 annual PC cleaning",
      "Full dust removal",
      "Thermal paste refresh",
      "Airflow & fan check",
    ],
  },
  {
    id: "pro",
    priceId: "detail_pro_yearly",
    name: "Pro",
    price: 100,
    tagline: "The whole setup, cleaned once a year.",
    features: [
      "Everything in Essential",
      "Peripherals cleaned (keyboard, mouse, headset)",
      "Monitor & desk detailing",
      "Cable management refresh",
    ],
    highlight: true,
  },
  {
    id: "premium",
    priceId: "detail_premium_yearly",
    name: "Premium",
    price: 200,
    tagline: "Full setup detailing, twice a year.",
    features: [
      "Everything in Pro",
      "Two full setup detailings per year",
      "Priority scheduling",
      "OS & performance tune-up",
    ],
  },
];

const Subscriptions = () => {
  const [activePriceId, setActivePriceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useMemo(
    () => async (): Promise<string> => {
      if (!activePriceId) throw new Error("No plan selected");
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{ priceId: activePriceId, quantity: 1 }],
          includeDelivery: false,
          returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.clientSecret) {
        throw new Error(error?.message || data?.error || "Failed to start checkout");
      }
      return data.clientSecret;
    },
    [activePriceId],
  );

  const handleSubscribe = (priceId: string) => {
    setError(null);
    try {
      getStripeEnvironment();
      setActivePriceId(priceId);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <Layout>
      <CanonicalHome
      title={"PC Detailing Subscriptions | Monterey Bay PCs"}
      description={"Yearly PC detailing plans in Monterey Bay: Essential, Pro, and Premium cleaning subscriptions to keep your PC and setup running cool."}
    />
      <PaymentTestModeBanner />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="PC Detailing Subscriptions"
            description="Keep your rig running cool, clean, and quiet. Yearly plans, cancel anytime."
          />

          {!activePriceId ? (
            <>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {plans.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative border rounded-2xl p-8 flex flex-col bg-muted/10 ${
                      plan.highlight ? "border-foreground" : "border-border"
                    }`}
                  >
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-foreground text-background text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" /> Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="font-heading text-2xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{plan.tagline}</p>
                    </div>
                    <div className="mb-6">
                      <span className="font-heading text-5xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-2">/ year</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSubscribe(plan.priceId)}
                      className={`w-full font-heading text-sm font-semibold uppercase tracking-widest py-3 rounded-full transition-all ${
                        plan.highlight
                          ? "bg-foreground text-background hover:scale-[1.02]"
                          : "border border-foreground/40 text-foreground hover:border-foreground"
                      }`}
                    >
                      Subscribe
                    </button>
                  </motion.div>
                ))}
              </div>
              {error && (
                <div className="max-w-2xl mx-auto mt-8 border border-red-300 bg-red-50 text-red-800 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}
              <p className="text-center text-xs text-muted-foreground mt-8 flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" /> Secure yearly billing powered by Stripe. Local Monterey Bay service only.
              </p>
            </>
          ) : (
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => setActivePriceId(null)}
                className="mb-6 font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                ← Back to plans
              </button>
              <div id="checkout" className="border border-border rounded-2xl overflow-hidden bg-background">
                <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Subscriptions;
