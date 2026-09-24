import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { BUSINESS } from "@/lib/business";

const cols = [
  {
    title: "Shop",
    links: [
      { to: "/prebuilts", label: "Prebuilt PCs" },
      { to: "/quote", label: "Custom Quote" },
      { to: "/services", label: "Repairs & Upgrades" },
      { to: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact" },
      { to: "/order-status", label: "Order Status" },
    ],
  },
  {
    title: "Policies",
    links: [
      { to: "/legal/warranty", label: "Warranty & Support" },
      { to: "/legal/returns", label: "Returns & Refunds" },
      { to: "/legal/shipping", label: "Pickup & Delivery" },
      { to: "/legal/terms", label: "Terms of Service" },
      { to: "/legal/privacy", label: "Privacy Policy" },
      { to: "/legal/accessibility", label: "Accessibility" },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo />
          <p className="text-muted-foreground text-sm max-w-xs">
            Custom PCs, hand-assembled and stress-tested in Monterey, California. Serving the Monterey Bay area since {BUSINESS.foundedYear}.
          </p>
          <ul className="space-y-2.5 text-sm">
            <li><a href={BUSINESS.phoneHref} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Phone className="w-4 h-4" />{BUSINESS.phone}</a></li>
            <li><a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Mail className="w-4 h-4" />{BUSINESS.email}</a></li>
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" />{BUSINESS.city}, {BUSINESS.region} (local pickup & delivery)</li>
            <li><a href={BUSINESS.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Instagram className="w-4 h-4" />@montereybaypc</a></li>
          </ul>
          <Link to="/quote" className="btn-brand">Get a Quote <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="font-heading text-xs font-semibold uppercase tracking-widest text-foreground mb-4">{c.title}</h2>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
        <p>&copy; {BUSINESS.foundedYear}-2026 Monterey Bay PCs. All rights reserved.</p>
        <p>Secure payments processed by Stripe.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
