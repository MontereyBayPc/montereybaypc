// Single source of truth for public routes: titles, descriptions, and static text
// used by the sitemap, per-page head tags, and build-time HTML snapshots.
// Keep this file free of asset imports and "@/" aliases (it is loaded by vite.config.ts).
import { prebuiltCatalog } from "../data/prebuilts-catalog";

export const SITE_URL = "https://montereybaypcs.com";

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  h1: string;
  body: string[];
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
      "Monterey Bay PCs builds custom gaming PCs, workstations, and everyday systems by hand in Monterey, California. Founded in 2024.",
      "How it works: tell us what you need, approve your build, we build and stress-test it, then pick it up or get it delivered locally.",
      "Services: custom PC building, upgrades, troubleshooting and repair, cleaning and optimization. Builds take 1-2 weeks.",
      "Contact: montereybaypc@gmail.com, (831) 718-7730.",
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
    title: `${p.name} ${p.tier} Gaming PC | Monterey Bay PCs`,
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
