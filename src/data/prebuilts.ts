export type Prebuilt = {
  slug: string;
  name: string;
  tier: "Starter" | "Mid" | "High-End" | "Extreme";
  price: number;
  tagline: string;
  description: string;
  bestFor: string[];
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    motherboard: string;
    psu: string;
    cooling: string;
    case: string;
    os: string;
  };
  performance: {
    resolution: string;
    games: { name: string; fps: string }[];
  };
  whatsInTheBox: string[];
};

export const prebuilts: Prebuilt[] = [
  {
    slug: "starter",
    name: "Bay Starter",
    tier: "Starter",
    price: 899,
    tagline: "Solid 1080p gaming on a budget.",
    description:
      "The perfect entry into PC gaming. Built to crush esports titles at high frame rates and handle modern AAA games at 1080p without breaking the bank.",
    bestFor: ["Esports (Valorant, CS2, Fortnite)", "1080p Gaming", "School & Productivity", "Streaming Light Games"],
    specs: {
      cpu: "AMD Ryzen 5 5600",
      gpu: "NVIDIA RTX 4060 8GB",
      ram: "16GB DDR4 3200MHz",
      storage: "1TB NVMe SSD",
      motherboard: "B550 Gaming Plus",
      psu: "650W 80+ Bronze",
      cooling: "Air Cooler (4 Fans)",
      case: "Mid-Tower with Mesh Front",
      os: "Windows 11 Home",
    },
    performance: {
      resolution: "1080p",
      games: [
        { name: "Fortnite (High)", fps: "180+ FPS" },
        { name: "Valorant", fps: "300+ FPS" },
        { name: "Elden Ring (High)", fps: "60 FPS" },
        { name: "Marvel Rivals (Medium)", fps: "100 FPS" },
        { name: "RDR2 (High)", fps: "75 FPS" },
      ],
    },
    whatsInTheBox: ["Fully assembled & tested PC", "Power cable", "Setup guide", "Lifetime technical support"],
  },
  {
    slug: "mid",
    name: "Bay Mid",
    tier: "Mid",
    price: 1599,
    tagline: "High refresh 1440p sweet spot.",
    description:
      "The build most gamers actually want. Smooth 1440p high settings across every modern title with headroom for streaming and creative work.",
    bestFor: ["1440p Gaming High/Ultra", "Streaming & Content Creation", "VR Ready", "Multitasking"],
    specs: {
      cpu: "AMD Ryzen 7 7700X",
      gpu: "NVIDIA RTX 4070 Super 12GB",
      ram: "32GB DDR5 6000MHz",
      storage: "2TB NVMe Gen4 SSD",
      motherboard: "B650 Tomahawk",
      psu: "750W 80+ Gold",
      cooling: "240mm AIO Liquid Cooler",
      case: "Tempered Glass ATX",
      os: "Windows 11 Home",
    },
    performance: {
      resolution: "1440p",
      games: [
        { name: "Fortnite (Ultra)", fps: "165 FPS" },
        { name: "Valorant", fps: "400+ FPS" },
        { name: "Elden Ring (Max)", fps: "60 FPS" },
        { name: "Marvel Rivals (High)", fps: "140 FPS" },
        { name: "RDR2 (Ultra)", fps: "95 FPS" },
      ],
    },
    whatsInTheBox: ["Fully assembled & tested PC", "Power cable", "Setup guide", "Lifetime technical support"],
  },
  {
    slug: "high-end",
    name: "Bay High-End",
    tier: "High-End",
    price: 2799,
    tagline: "4K ready, no compromises.",
    description:
      "A serious enthusiast machine. Smooth 4K gaming, fast video editing, and silent operation under load. Built to last and easy to upgrade.",
    bestFor: ["4K Gaming", "Video Editing & 3D Work", "Streaming + Gaming Simultaneously", "Future-Proof"],
    specs: {
      cpu: "Intel Core i7-14700K",
      gpu: "NVIDIA RTX 4080 Super 16GB",
      ram: "32GB DDR5 6400MHz",
      storage: "2TB NVMe Gen4 + 4TB HDD",
      motherboard: "Z790 Pro",
      psu: "850W 80+ Gold Modular",
      cooling: "360mm AIO Liquid Cooler",
      case: "Premium Airflow Case (ARGB)",
      os: "Windows 11 Pro",
    },
    performance: {
      resolution: "4K",
      games: [
        { name: "Fortnite (Epic)", fps: "120 FPS" },
        { name: "Valorant", fps: "300+ FPS" },
        { name: "Elden Ring (Max)", fps: "60 FPS" },
        { name: "Marvel Rivals (Ultra)", fps: "110 FPS" },
        { name: "RDR2 (Ultra)", fps: "75 FPS" },
      ],
    },
    whatsInTheBox: ["Fully assembled & tested PC", "Power cables", "Setup guide", "Lifetime technical support", "Premium box packaging"],
  },
  {
    slug: "extreme",
    name: "Bay Extreme",
    tier: "Extreme",
    price: 4499,
    tagline: "The flagship. Everything maxed.",
    description:
      "Our no-compromise flagship. The fastest consumer hardware available, hand-tuned and stress tested. For the player who wants the best of the best.",
    bestFor: ["4K Ultra @ High FPS", "Pro Content Creation", "AI & 3D Rendering", "Showpiece Build"],
    specs: {
      cpu: "AMD Ryzen 9 9950X",
      gpu: "NVIDIA RTX 5090 32GB",
      ram: "64GB DDR5 6400MHz CL30",
      storage: "4TB NVMe Gen5 + 8TB HDD",
      motherboard: "X870E Hero",
      psu: "1200W 80+ Platinum Modular",
      cooling: "Custom 360mm AIO + 9 ARGB Fans",
      case: "Showcase Tempered Glass Tower",
      os: "Windows 11 Pro",
    },
    performance: {
      resolution: "4K Ultra",
      games: [
        { name: "Fortnite (Epic + RT)", fps: "180+ FPS" },
        { name: "Valorant", fps: "500+ FPS" },
        { name: "Elden Ring (Max)", fps: "60 FPS" },
        { name: "Marvel Rivals (Ultra)", fps: "180 FPS" },
        { name: "RDR2 (Ultra)", fps: "140 FPS" },
        { name: "Cyberpunk 2077 (RT Ultra)", fps: "90 FPS" },
      ],
    },
    whatsInTheBox: [
      "Fully assembled & tested PC",
      "Premium braided cables",
      "Setup & overclock guide",
      "Lifetime priority technical support",
      "Signed build certificate",
    ],
  },
];

export const getPrebuilt = (slug: string) => prebuilts.find((p) => p.slug === slug);
