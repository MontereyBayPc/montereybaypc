// Content for simple info pages. No asset imports: also read by src/seo/routes.ts.
import { SERVICE_TERMS } from '../lib/service-agreement';
import { TRADE_UP_TERMS } from '../lib/trade-up';
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
    path:'/service-agreement', title:'Hardware Service Agreement & Work Order | Monterey Bay PCs', description:'Read the service scope, data backup acknowledgment, 30-day uncollected-property notice process and manufacturer RMA terms. Prepare a work order for drop-off.', h1:'Hardware Service Agreement',
    intro:'Review these draft service terms before drop-off. California legal review is needed before relying on them as an enforceable contract. Download an acknowledged copy, then agree the final scope and price with your technician.',
    sections:SERVICE_TERMS.map(t=>({h:t.title,items:[t.text]})),
  },
  {
    path:'/service-area-map', title:'Monterey Bay PC Service Area, Pickup & Delivery | Monterey Bay PCs', description:'PC builds, repairs and upgrades for Monterey Bay communities. Free arranged pickup in Monterey and insured shipping anywhere in the US.', h1:'Monterey Bay Service Area',
    intro:'Local service around Monterey, Carmel, Pacific Grove, Seaside, Marina and Salinas. Free arranged pickup in Monterey, or insured shipping anywhere in the US.',
    sections:[
      {h:'PC services for local customers',items:[
        'Custom gaming PCs and workstations, prebuilt PCs, hardware upgrades, troubleshooting and repair, and cleaning and optimization are available through Monterey Bay PCs.',
        'We are based in Monterey and serve customers around Carmel, Pacific Grove, Seaside, Marina and Salinas. Ask us to confirm the arrangements for your address before planning a visit or delivery.',
      ]},
      {h:'Free pickup by appointment in Monterey',items:[
        'Local pickup is free. We confirm the exact pickup location and time with you directly; do not travel to a map marker expecting a shop or drop-off point.',
        'For repair or upgrade drop-off, send a repair request first. Back up important files and review the drop-off guide before bringing your PC.',
      ]},
      {h:'Pickup and shipping',items:[
        'Pick up free in Monterey, or we ship insured anywhere in the US from $59. Send your town and delivery address so we can confirm eligibility and arrangements before you book.',
        'The map circle is an approximate geographic radius, not a guaranteed route boundary. Town-center markers are for orientation only and do not establish delivery eligibility for every address in a town.',
      ]},
      {h:'Planning your build or service visit',items:[
        'Custom builds generally take 1-2 weeks to build and test. Confirm the completion date and pickup or delivery time with us before making travel plans.',
        'For repairs and upgrades, describe the symptoms or parts you want installed. We will agree the next steps and drop-off arrangements with you.',
      ]},
    ],
  },
  {
    path: "/trade-in",
    title: "Trade-Up Guarantee & CPU / GPU Trade-Ins | Monterey Bay PCs",
    description: "Trade your Monterey Bay PC within 24 months for 50% of its current resale value toward a brand-new rig. CPU and GPU trade-ins also available.",
    h1: "Trade-Up Guarantee",
    intro: "Your next rig starts with the one you own. Trade your Monterey Bay PC within 24 months for 50% of its current resale value toward a brand-new build.",
    sections: [
      { h: "50% credit. 24 months. A brand-new rig.", items: TRADE_UP_TERMS },
      { h: "How it works", items: [
        "01 Tell us what you have: model, age, and condition.",
        "02 We reply with a credit offer, usually within 1 business day.",
        "03 Bring it in when you pick up your new PC and the credit comes off your total.",
        "Only CPUs and GPUs are accepted. Estimated credit never exceeds 50% of the reference component price and is subject to testing and inspection.",
      ] },
    ],
    form: { kind: "trade_in", heading: "Request your trade-up credit or part offer", placeholder: "Monterey Bay PC: order number, purchase date, specs and condition. Or CPU/GPU: exact model, age and condition.", submit: "Request offer" },
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
  {
    path: "/guides/gpu-buying-guide",
    title: "2026 GPU Buying Guide: NVIDIA vs AMD | Monterey Bay PCs",
    description: "Which graphics card should you buy in 2026? A plain-English guide to NVIDIA RTX 50-series vs AMD Radeon by resolution and budget.",
    h1: "2026 Graphics Card Buying Guide",
    intro: "The graphics card decides how your games look and feel more than any other part. Here is how we pick one for each build.",
    sections: [
      { h: "Pick by your monitor", items: [
        "1080p: a mid-range card is plenty for high frame rates in esports and most new games.",
        "1440p: step up one tier for high settings at high refresh rates.",
        "4K: only the top cards hold smooth frame rates at Ultra settings.",
      ] },
      { h: "NVIDIA or AMD?", items: [
        "NVIDIA: strongest ray tracing and DLSS upscaling, best for streaming and creative apps.",
        "AMD: often more performance per dollar in games without ray tracing, and more video memory at each price.",
        "Either is a good pick. We match the card to the games you actually play.",
      ] },
      { h: "Don't forget", items: [
        "A bigger card needs a stronger power supply and a case it fits in. Our quote builder checks power for you.",
        "Not sure? Tell us your games and budget on the quote page and we will recommend one.",
      ] },
    ],
  },
  {
    path: "/guides/pc-care",
    title: "PC Care & Maintenance Guide | Monterey Bay PCs",
    description: "How to clean dust filters, check temperatures, and keep your gaming PC running cool and quiet for years.",
    h1: "PC Care & Maintenance Guide",
    intro: "A few minutes every couple of months keeps your PC cool, quiet, and fast.",
    sections: [
      { h: "Every 1-2 months", items: [
        "Shut down and unplug the PC before touching anything.",
        "Pull out and rinse or wipe the dust filters, then let them dry fully.",
        "Wipe the outside vents with a soft dry cloth.",
      ] },
      { h: "Every 6-12 months", items: [
        "Blow dust out of fans and the graphics card with short bursts of compressed air. Hold fans still while you do.",
        "Check temperatures with a free tool like HWMonitor. Rising temps mean it is time for a cleaning.",
        "Update graphics drivers and Windows.",
      ] },
      { h: "Want us to do it?", items: [
        "We offer full cleaning and optimization, including fresh thermal paste. Book it from the repair request page.",
      ] },
    ],
  },
  {
    path: "/drop-off-guide",
    title: "How to Prepare Your PC for Drop-Off | Monterey Bay PCs",
    description: "What to bring, what to leave at home, and how to back up your files before dropping off your PC in Monterey.",
    h1: "Preparing Your PC for Drop-Off",
    intro: "Dropping off a PC for repair or an upgrade? Here is how to make it quick and safe. Open 9:00am to 6:30pm.",
    sections: [
      { h: "Before you come", items: [
        "Back up important files to a cloud drive or USB drive.",
        "Write down your Windows password or PIN, or tell us at drop-off, so we can test properly.",
        "Send a repair request first so we know what to expect.",
      ] },
      { h: "What to bring", items: [
        "Just the PC tower. Leave the power cable, monitor, keyboard, and mouse at home unless we ask for them.",
        "Any new parts you want installed, in their boxes.",
      ] },
      { h: "Where", items: ["Monterey, CA. We confirm the exact drop-off address and time when we reply to your request."] },
    ],
  },
  {
    path: "/custom-vs-big-box",
    title: "Custom PC vs Big Box Prebuilt | Monterey Bay PCs",
    description: "How a locally built Monterey Bay PC compares to big box store prebuilts: parts, software, support, and upgrades.",
    h1: "Custom Build vs Big Box Prebuilt",
    intro: "Big box prebuilts are convenient, but here is what you get when a local builder puts your PC together.",
    sections: [
      { h: "Monterey Bay PCs", items: [
        "Standard retail parts from known brands, listed by exact model.",
        "Clean Windows install with no extra trial software.",
        "BIOS updated and memory speed (EXPO/XMP) turned on.",
        "Stress-tested before handoff.",
        "Talk to the person who built it, and upgrade any part later.",
      ] },
      { h: "Typical big box prebuilt", items: [
        "Parts often listed vaguely, like \"16GB memory\" with no brand or speed.",
        "May come with trial software preinstalled.",
        "Support usually through a phone line or mail-in service.",
        "Some use custom-shaped parts that are harder to upgrade.",
      ] },
    ],
  },
  {
    path: "/creator-packages",
    title: "Streaming & Creator PC Packages | Monterey Bay PCs",
    description: "Custom PCs for streamers, video editors, and creators: dual monitor setups, capture cards, lots of memory, and quiet cooling.",
    h1: "Creator & Streamer PCs",
    intro: "Streaming, editing, and gaming at the same time takes a different kind of build. We plan it around your setup.",
    sections: [
      { h: "What we focus on", items: [
        "Graphics cards with strong video encoders for smooth streams.",
        "32GB to 64GB+ memory for editing and multitasking.",
        "Fast storage for big video projects.",
        "Quiet cooling so your mic doesn't pick up fan noise.",
        "Capture card and dual monitor setup on request.",
      ] },
    ],
    form: { kind: "creator", heading: "Plan your creator build", placeholder: "What do you stream or edit, what software, and your budget?", submit: "Send request" },
  },
  {
    path: "/esports",
    title: "School & College Esports Teams | Monterey Bay PCs",
    description: "Gaming PCs, upgrades, and repairs for Monterey County high school and college esports teams.",
    h1: "Esports Teams",
    intro: "Running a school or college esports team in Monterey County? We build, upgrade, and fix team PCs locally.",
    sections: [
      { h: "How we help", items: [
        "Matching PCs for a whole team room.",
        "Upgrades for older lab machines.",
        "Fast local repairs so practice isn't cancelled.",
        "Ask about team pricing for multiple machines.",
      ] },
    ],
    form: { kind: "esports", heading: "Tell us about your team", placeholder: "School, number of PCs, games you play, and your budget", submit: "Send request" },
  },
  ...cities.map((c) => ({
    path: `/areas/${c.toLowerCase().replace(/ /g, "-")}`,
    title: `Custom Gaming PCs & PC Repair in ${c}, CA | Monterey Bay PCs`,
    description: `Custom gaming PCs, upgrades, and PC repair for ${c}, CA. Built in Monterey with pickup or insured shipping to ${c}.`,
    h1: `Custom PCs & Repair in ${c}, CA`,
    intro: `Monterey Bay PCs builds custom gaming PCs and fixes computers for people in ${c}. Everything is built in Monterey and delivered to ${c}, or you can pick it up.`,
    sections: [
      { h: `Services in ${c}`, items: ["Custom gaming PC builds", "Prebuilt gaming PCs", "Upgrades (GPU, RAM, storage, cooling)", "Troubleshooting and repair", "Cleaning and optimization"] },
      { h: "Delivery", items: [`Insured shipping to ${c}, or free pickup in Monterey.`, "Built to order in 1-2 weeks, or 48-72 hours with a rush build."] },
    ],
  })),
];

export const findInfoPage = (path: string) => infoPages.find((p) => p.path === path);
