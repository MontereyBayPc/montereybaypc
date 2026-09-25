import pcBudget from "@/assets/pc-budget.jpg";
import pcGaming from "@/assets/pc-gaming.jpg";
import pcHighend from "@/assets/pc-highend.jpg";
import pcWorkstation from "@/assets/pc-workstation.jpg";
import { prebuiltCatalog, type PrebuiltSpec } from "./prebuilts-catalog";

export type Prebuilt = PrebuiltSpec & { image: string };

const images: Record<string, string> = {
  starter: pcBudget,
  mid: pcGaming,
  "high-end": pcHighend,
  extreme: pcWorkstation,
};

export const prebuilts: Prebuilt[] = prebuiltCatalog.map((p) => ({ ...p, image: images[p.slug] }));

export const getPrebuilt = (slug: string) => prebuilts.find((p) => p.slug === slug);
