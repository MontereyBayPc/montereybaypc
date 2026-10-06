// Content for simple info pages. No asset imports: also read by src/seo/routes.ts.
export type InfoPage = {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { h: string; items: string[] }[];
  form?: { kind: string; heading: string; placeholder: string; submit: string; checklist?: string[] };
};

const cities = ["Salinas", "Carmel", "Seaside", "Marina", "Pacific Grove", "Watsonville"];

export const DELIVERY_TOWNS = ["Monterey", ...cities];

export const infoPages: InfoPage[] = [
  {
    path: "/trade-in",
    title: "Trade In Your Old PC or GPU | Monterey Bay PCs",
    description: "Trade in your old graphics card or PC for credit toward a new custom build from Monterey Bay PCs.",
    h1: "Trade In Your Old Gear",
    intro: "Upgrading? Send us the specs of your old graphics card or PC and we will offer credit toward your new build.",
    sections: [
      { h: "How it works", items: [
        "01 Tell us what you have: model, age, and condition.",
        "02 We reply with a credit offer, usually within 1 business day.",
        "03 Bring it in when you pick up your new PC and the credit comes off your total.",
      ] },
    ],
    form: { kind: "trade_in", heading: "Get a trade-in offer", placeholder: "What are you trading in? (e.g. RTX 3070, good condition, 3 years old)", submit: "Request offer" },
  },
  {
    path: "/bring-your-own-parts",
    title: "Bring Your Own Parts PC Assembly | $50 | Monterey Bay PCs",
    description: "Already bought your parts? Monterey Bay PCs assembles, cable-manages, and stress-tests your build for a flat $50.",
    h1: "Bring Your Own Parts",
    intro: "Already grabbed your parts on sale? We will put it all together for a flat $50.",
    sections: [
      { h: "What's included for $50", items: [
        "Full assembly by hand",
        "Clean cable management",
        "BIOS update and memory speed (EXPO/XMP) enabled",
        "Stress test before you pick it up",
      ] },
      { h: "Good to know", items: [
        "Parts must be new or working. If something is dead on arrival, we will help you figure out which part.",
        "Windows install is available on request.",
      ] },
    ],
    form: { kind: "byo_assembly", heading: "Book an assembly", placeholder: "List the parts you have, or paste your parts list", submit: "Book assembly" },
  },
  {
    path: "/business",
    title: "Workstations for Local Businesses | Monterey Bay PCs",
    description: "Reliable workstations for Monterey County architects, design studios, video editors, and offices. Built and supported locally.",
    h1: "Workstations for Local Businesses",
    intro: "Design studios, architects, video editors, and offices around Monterey County need PCs that just work. We build them and support them locally.",
    sections: [
      { h: "What we build", items: [
        "CAD and 3D workstations",
        "Video editing machines",
        "Multi-monitor office PCs",
        "Upgrades and repairs for the machines you already have",
      ] },
      { h: "Why local matters", items: [
        "You talk to the person who built it.",
        "Drop-off and pickup in Monterey, or delivery within 30 miles.",
      ] },
    ],
    form: { kind: "business", heading: "Tell us what your team needs", placeholder: "How many machines, what software, and your budget", submit: "Send request" },
  },
  {
    path: "/repair-request",
    title: "PC Repair Request | Monterey Bay PCs",
    description: "Tell us what is wrong with your PC. Pick the symptoms and we will reply with next steps and a drop-off time.",
    h1: "PC Repair Request",
    intro: "Check what your PC is doing and we will reply with next steps and a drop-off time. Open 9:00am to 6:30pm.",
    sections: [],
    form: {
      kind: "repair",
      heading: "What's going on?",
      placeholder: "Anything else? When did it start, what changed?",
      submit: "Send repair request",
      checklist: ["Won't turn on", "Blue screens / crashes", "Overheating / loud fans", "Slow performance", "No display", "Strange noises", "Game stuttering", "Upgrade help"],
    },
  },
  ...cities.map((c) => ({
    path: `/areas/${c.toLowerCase().replace(/ /g, "-")}`,
    title: `Custom Gaming PCs & PC Repair in ${c}, CA | Monterey Bay PCs`,
    description: `Custom gaming PCs, upgrades, and PC repair for ${c}, CA. Built in Monterey with local delivery to ${c}.`,
    h1: `Custom PCs & Repair in ${c}, CA`,
    intro: `Monterey Bay PCs builds custom gaming PCs and fixes computers for people in ${c}. Everything is built in Monterey and delivered to ${c}, or you can pick it up.`,
    sections: [
      { h: `Services in ${c}`, items: ["Custom gaming PC builds", "Prebuilt gaming PCs", "Upgrades (GPU, RAM, storage, cooling)", "Troubleshooting and repair", "Cleaning and optimization"] },
      { h: "Delivery", items: [`Local delivery to ${c} for $75, or free pickup in Monterey.`, "Built to order in 1-2 weeks, or 48-72 hours with a rush build."] },
    ],
  })),
];

export const findInfoPage = (path: string) => infoPages.find((p) => p.path === path);
