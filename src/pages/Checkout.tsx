import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    delivery: "pickup",
    card: "",
    expiry: "",
    cvc: "",
    notes: "",
  });

  const tax = Math.round(subtotal * 0.0925);
  const deliveryFee = form.delivery === "delivery" ? 75 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitted(true);
    clearCart();
    setTimeout(() => navigate("/"), 5000);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-32 container mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10" />
          </motion.div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">Order Received</h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-2">
            Thanks {form.name || "friend"}! We've received your order and will reach out within 24 hours to confirm details and start your build.
          </p>
          <p className="text-muted-foreground text-sm">Redirecting home...</p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <h1 className="font-heading text-4xl lg:text-6xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-10 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Demo checkout — no real charge will be processed.
          </p>

          {items.length === 0 ? (
            <div className="text-center py-20 border border-border rounded-2xl">
              <p className="text-muted-foreground mb-6">Your cart is empty.</p>
              <Link to="/prebuilts" className="font-heading text-sm font-semibold uppercase tracking-widest underline">
                Browse prebuilts
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-10">
              <div className="space-y-10">
                <Section title="Contact">
                  <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                  <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                </Section>

                <Section title="Delivery">
                  <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                    {[
                      { id: "pickup", label: "Local Pickup", desc: "Free — Monterey Bay" },
                      { id: "delivery", label: "Local Delivery", desc: "$75 — Within 30mi" },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setForm({ ...form, delivery: opt.id })}
                        className={`text-left border rounded-xl p-4 transition-colors ${
                          form.delivery === opt.id ? "border-foreground bg-muted/30" : "border-border hover:border-foreground/50"
                        }`}
                      >
                        <div className="font-heading font-bold text-foreground">{opt.label}</div>
                        <div className="text-muted-foreground text-sm">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                  {form.delivery === "delivery" && (
                    <>
                      <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required className="sm:col-span-2" />
                      <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
                      <Field label="Zip" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} required />
                    </>
                  )}
                </Section>

                <Section title="Payment">
                  <Field label="Card Number" placeholder="4242 4242 4242 4242" value={form.card} onChange={(v) => setForm({ ...form, card: v })} required className="sm:col-span-2" />
                  <Field label="Expiry" placeholder="MM/YY" value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} required />
                  <Field label="CVC" placeholder="123" value={form.cvc} onChange={(v) => setForm({ ...form, cvc: v })} required />
                </Section>

                <Section title="Notes (optional)">
                  <div className="sm:col-span-2">
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      placeholder="Anything we should know about your build?"
                      className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground focus:border-foreground outline-none"
                    />
                  </div>
                </Section>
              </div>

              {/* Order summary */}
              <aside className="lg:sticky lg:top-28 h-fit border border-border rounded-2xl p-6 bg-muted/20">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Order Summary</h3>
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
                  <Row label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
                  <Row label="Delivery" value={deliveryFee ? `$${deliveryFee}` : "Free"} />
                  <Row label="Tax (9.25%)" value={`$${tax.toLocaleString()}`} />
                </div>
                <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                  <span className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total</span>
                  <span className="font-heading text-2xl font-bold text-foreground">${total.toLocaleString()}</span>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background py-4 rounded-full hover:scale-[1.02] transition-transform"
                >
                  Place Order
                </button>
                <p className="text-xs text-muted-foreground mt-3 text-center">Demo only — no card will be charged.</p>
              </aside>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{title}</h2>
    <div className="grid sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) => (
  <label className={`block ${className}`}>
    <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="mt-1 w-full bg-transparent border border-border rounded-xl px-4 py-3 text-foreground focus:border-foreground outline-none"
    />
  </label>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground">{value}</span>
  </div>
);

export default Checkout;
