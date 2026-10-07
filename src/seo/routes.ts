// Single source of truth for public routes: titles, descriptions, and static text
// used by the sitemap, per-page head tags, and build-time HTML snapshots.
// Keep this file free of asset imports and "@/" aliases (it is loaded by vite.config.ts).
import { prebuiltCatalog } from "../data/prebuilts-catalog";
import { infoPages } from "../data/info-pages";

export const SITE_URL = "https://montereybaypcs.com";

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  h1: string;
  body: string[];
  sections?: { h: string; items: string[] }[];
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
};

const services = [
  { slug: "custom-pc-building", title: "Custom PC Building", text: "Hand-built custom gaming PCs and workstations, built to your budget, stress-tested, and ready for local pickup or delivery in the Monterey Bay area." },
  { slug: "upgrades", title: "Upgrades", text: "GPU, CPU, RAM, storage, and cooling upgrades for your existing PC, installed and tested by a local builder." },
  { slug: "troubleshooting-repair", title: "Troubleshooting & Repair", text: "Diagnosis and repair for PCs that crash, won't boot, overheat, or run slow." },
  { slug: "cleaning-optimization", title: "Cleaning & Optimization", text: "Deep cleaning, fan replacement, fresh thermal paste, and software tune-ups for quieter, cooler, faster performance." },
];

const legal = [
  { slug: "warranty", title: "Warranty & Support", text: "Components keep their manufacturer warranty and every PC purchase includes technical support." },
  { slug: "returns", title: "Returns & Refunds", text: "How returns, cancellations, and refunds work for prebuilt and custom PCs." },
  { slug: "shipping", title: "Pickup & Delivery", text: "Free local pickup in Monterey, CA, and local delivery within 30 miles for $75. We do not ship nationwide." },
  { slug: "terms", title: "Terms of Service", text: "The basic rules for using this website and buying from Monterey Bay PCs." },
  { slug: "privacy", title: "Privacy Policy", text: "What information we collect and how we use it. We never sell your information." },
  { slug: "accessibility", title: "Accessibility", text: "We aim to keep the site readable, keyboard friendly, and usable with screen readers." },
];

export const seoRoutes: SeoRoute[] = [
  {
    path: "/",
    title: "Monterey Bay PCs | Custom Gaming PCs Built in Monterey, CA",
    description: "Custom-built gaming PCs, workstations, and everyday systems from Monterey Bay, CA. Handcrafted for performance, reliability, and style.",
    h1: "Custom Gaming PCs Built in Monterey, CA",
    body: [
      "Custom PCs Built for Power. Handcrafted gaming rigs, workstations, and everyday PCs, engineered for performance. Based in Monterey Bay, CA. Founded in 2024.",
    ],
    sections: [
      { h: "How It Works", items: [
        "01 Tell Us What You Need: Share your budget and what the PC is for. We'll spec the right parts and send you a quote.",
        "02 Approve Your Build: You pick the final parts and price, then we order everything and get started.",
        "03 Built & Stress-Tested: Hand-assembled with clean cable management and stress-tested before it ever leaves the bench.",
        "04 Pickup or Delivery: Ready in 1-2 weeks. Pick it up locally or have it delivered to your door in the Monterey Bay area.",
      ] },
      { h: "What to Know", items: [
        "Build Time: Custom PCs take 1-2 weeks to build, test, and deliver.",
        "Local Only: We do not ship nationwide. Pickup or local delivery only.",
        "Satisfaction Guaranteed: We work with you until you are 100% happy with your build.",
        "Technical Support: Every build comes with technical support included with your purchase.",
      ] },
      { h: "Why Choose Us", items: [
        "Founded in Monterey in 2024. 15+ custom builds. 1-2 week turnaround.",
        "Local Craftsmanship: Every PC is hand-built, cable-managed, and stress-tested right here in Monterey, California.",
        "Performance Obsessed: Parts are chosen for real-world speed and reliability, never for marketing numbers.",
        "Support Included: Technical support comes with your build, and we work with you until you're 100% happy.",
      ] },
      { h: "Services", items: services.map((s) => `${s.title}: ${s.text}`) },
      { h: "Prebuilt Gaming PCs", items: [
        ...prebuiltCatalog.map((p) => `${p.name} (${p.tier}) - $${p.price.toLocaleString("en-US")}: ${p.tagline} ${p.specs.cpu}, ${p.specs.gpu}, ${p.specs.ram}.`),
        "The Beast - $100,000: a one-of-one custom PC with NVIDIA RTX PRO 6000 Blackwell graphics in a spherical liquid-cooled showcase. Only 1 available.",
      ] },
      { h: "What Our Customers Say", items: [
        "5 stars - Michael T.: \"I'm really happy with the quality that Monterey Bay PCs delivers. The work was done professionally, and the pricing was fair for the quality of service I received. I would definitely recommend them to anyone looking for reliable PC service.\"",
        "5 stars - Nicholas O.: \"I was very happy with the turnaround time from Monterey Bay PCs. They replaced my fans and cleaned up my PC, and the whole process was quick and easy. I'm very satisfied with the service.\"",
      ] },
      { h: "Frequently Asked Questions", items: [
        "How long does a custom build take? Custom PCs take 1-2 weeks to build, test, and prepare for pickup.",
        "Can I bring my own parts? Yes, we're happy to build with parts you already purchased.",
        "Do you ship nationwide? No. All builds are available for local pickup or delivery in the Monterey Bay area.",
        "What support do you offer? Technical support is included with every PC purchase.",
      ] },
      { h: "Ready for Your Dream PC?", items: [
        "Reach out for a custom quote. Email montereybaypc@gmail.com or call (831) 718-7730. Serving Monterey, Salinas, Seaside, Marina, Pacific Grove, Carmel and the greater Monterey Bay area.",
      ] },
    ],
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/services",
    title: "PC Repair & Upgrade Services in Monterey Bay, CA | Monterey Bay PCs",
    description: "PC repair and upgrade services in Monterey Bay, CA: custom builds, GPU and RAM upgrades, troubleshooting, deep cleaning. Fast local turnaround.",
    h1: "PC Services in Monterey Bay, CA",
    body: services.map((s) => `${s.title}: ${s.text}`),
    changefreq: "monthly",
    priority: "0.9",
  },
  ...services.map<SeoRoute>((s) => ({
    path: `/services/${s.slug}`,
    title: `${s.title} in Monterey, CA | Monterey Bay PCs`,
    description: s.text,
    h1: s.title,
    body: [s.text, "Serving Monterey, Salinas, Seaside, Marina, Pacific Grove, Carmel and the greater Monterey Bay area."],
    changefreq: "monthly",
    priority: "0.7",
  })),
  {
    path: "/prebuilts",
    title: "Prebuilt Gaming PCs for Sale | Monterey Bay PCs",
    description: "Shop hand-assembled prebuilt gaming PCs from Monterey Bay PCs. Four tiers from 1080p starter builds to 4K flagship rigs with full specs.",
    h1: "Prebuilt Gaming PCs",
    body: prebuiltCatalog.map((p) => `${p.name} (${p.tier}) - $${p.price.toLocaleString("en-US")}: ${p.tagline}`),
    changefreq: "weekly",
    priority: "0.9",
  },
  ...prebuiltCatalog.map<SeoRoute>((p) => ({
    path: `/prebuilts/${p.slug}`,
    title: `${p.name} Prebuilt Gaming PC | Monterey Bay PCs`,
    description: `${p.tagline} ${p.specs.cpu}, ${p.specs.gpu}, ${p.specs.ram}. $${p.price.toLocaleString("en-US")}.`,
    h1: p.name,
    body: [
      `$${p.price.toLocaleString("en-US")}. ${p.description}`,
      `Specs: ${Object.values(p.specs).join(", ")}.`,
      `Best for: ${p.bestFor.join(", ")}.`,
    ],
    changefreq: "weekly",
    priority: "0.7",
  })),
  {
    path: "/the-beast",
    title: "The Beast | One-of-One $100,000 PC | Monterey Bay PCs",
    description: "Meet The Beast, a one-of-one $100,000 custom workstation and gaming PC with RTX PRO Blackwell graphics and a spherical liquid-cooled showcase chassis.",
    h1: "The Beast",
    body: [
      "A one-of-one $100,000 custom PC. Only 1 available.",
      "NVIDIA RTX PRO 6000 Blackwell, ASUS Pro WS WRX90E-SAGE SE, Threadripper PRO platform, ASUS 3000W PSU, Samsung 9100 PRO and 990 PRO storage, EK-Quantum and Bitspower liquid cooling, spherical glass showcase chassis.",
    ],
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/quote",
    title: "Custom PC Quote | Monterey Bay PCs",
    description: "Pick every part and get a live price estimate for a custom PC built in Monterey, CA.",
    h1: "Custom PC Quote",
    body: ["Choose a CPU, graphics card, motherboard, memory, storage, case, power supply, cooling and more, or select none for parts you already own. Prices are checked regularly."],
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/about",
    title: "About Monterey Bay PCs | Local Custom PC Builders",
    description: "Meet Monterey Bay PCs, a local custom PC building and repair shop serving the Monterey Bay area with hand-built rigs and honest service.",
    h1: "About Monterey Bay PCs",
    body: ["A local custom PC building and repair shop in Monterey, CA, founded in 2024, with 15+ builds completed."],
    changefreq: "yearly",
    priority: "0.6",
  },
  {
    path: "/faq",
    title: "FAQ: Build Times, Pricing & Pickup | Monterey Bay PCs",
    description: "Answers about build times, pricing, local pickup and delivery, parts sourcing, and support for Monterey Bay PCs customers.",
    h1: "Frequently Asked Questions",
    body: [
      "How long does a custom build take? Custom PCs take 1-2 weeks to build, test, and prepare for pickup.",
      "Can I bring my own parts? Yes, we're happy to build with parts you already purchased.",
      "Do you ship nationwide? No. All builds are available for local pickup or delivery in the Monterey Bay area.",
      "What support do you offer? Technical support is included with every PC purchase.",
    ],
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/contact",
    title: "Contact Monterey Bay PCs | Get a Custom PC Quote",
    description: "Contact Monterey Bay PCs for a custom PC quote, repair estimate, or upgrade advice. Email us or send a message and we'll reply quickly.",
    h1: "Contact Us",
    body: ["Email montereybaypc@gmail.com or call (831) 718-7730. Based in Monterey, CA."],
    changefreq: "yearly",
    priority: "0.7",
  },
  {
    path: "/order-status",
    title: "Order Status | Monterey Bay PCs",
    description: "Check on your Monterey Bay PCs order. See our build stages and request an update.",
    h1: "Order Status",
    body: ["See the stages of your build and request an update by email or by calling (831) 718-7730."],
    changefreq: "yearly",
    priority: "0.4",
  },
  ...legal.map<SeoRoute>((l) => ({
    path: `/legal/${l.slug}`,
    title: `${l.title} | Monterey Bay PCs`,
    description: l.text,
    h1: l.title,
    body: [l.text],
    changefreq: "yearly",
    priority: "0.3",
  })),
  ...infoPages.map((p): SeoRoute => ({
    path: p.path, title: p.title, description: p.description, h1: p.h1,
    body: [p.intro], sections: p.sections, changefreq: "monthly", priority: "0.6",
  })),
];

// Utility pages: reachable directly but kept out of search results.
export const noindexRoutes = [
  { path: "/cart", title: "Your Cart | Monterey Bay PCs", description: "Review the PCs in your cart." },
  { path: "/checkout", title: "Checkout | Monterey Bay PCs", description: "Secure checkout for your Monterey Bay PCs order." },
  { path: "/checkout/return", title: "Order Confirmation | Monterey Bay PCs", description: "Thanks for your order." },
];

export const findSeoRoute = (path: string) => {
  const clean = path !== "/" ? path.replace(/\/+$/, "") : path;
  return seoRoutes.find((r) => r.path === clean) ?? noindexRoutes.find((r) => r.path === clean);
};
