import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { BUSINESS } from "@/lib/business";

const steps = ["Order received", "Parts sourced", "Building", "Stress testing", "Ready for pickup or delivery"];

const OrderStatus = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState("");

  const mailto = `mailto:${BUSINESS.email}?subject=${encodeURIComponent("Order status request")}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nOrder / receipt number: ${order}\n\nCould you give me an update on my order?`,
  )}`;

  return (
    <Layout>
      <CanonicalHome title={`Order Status | ${BUSINESS.name}`} description="Check on your Monterey Bay PCs order. See our build stages and request an update." />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Breadcrumbs items={[{ label: "Order Status" }]} />
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">Order Status</h1>
          <p className="text-muted-foreground text-lg mb-12">
            Every PC goes through the same stages. We will reach out when yours is ready, but you can ask for an update anytime.
          </p>

          <ol className="grid gap-3 mb-14">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-4 border border-border rounded-2xl p-4">
                <span className="font-heading text-sm font-semibold text-accent-brand w-8">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ol>

          <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">Request an update</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}
            className="grid gap-5"
          >
            <Input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            <Input required type="email" placeholder="Email used for your order" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
            <Input placeholder="Order or receipt number (optional)" value={order} onChange={(e) => setOrder(e.target.value)} maxLength={100} />
            <button type="submit" className="btn-brand w-fit"><Mail className="w-4 h-4" /> Email us for an update</button>
          </form>
          <a href={BUSINESS.phoneHref} className="mt-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Phone className="w-4 h-4" /> Or call {BUSINESS.phone}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default OrderStatus;
