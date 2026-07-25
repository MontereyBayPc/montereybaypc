import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, MonitorPlay, MemoryStick, Gauge, ArrowRight, RotateCcw, AlertTriangle, CheckCircle, Info, ChevronDown, Search, Gamepad2, Monitor } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import { Link } from "react-router-dom";

// ── GPU Database with performance scores (1-100) ──
const gpuList = [
  // NVIDIA GeForce RTX 50 Series
  { name: "NVIDIA RTX 5090", score: 100 },
  { name: "NVIDIA RTX 5080", score: 90 },
  { name: "NVIDIA RTX 5070 Ti", score: 82 },
  { name: "NVIDIA RTX 5070", score: 75 },
  { name: "NVIDIA RTX 5060 Ti", score: 65 },
  { name: "NVIDIA RTX 5060", score: 58 },
  // NVIDIA GeForce RTX 40 Series
  { name: "NVIDIA RTX 4090", score: 95 },
  { name: "NVIDIA RTX 4080 Super", score: 87 },
  { name: "NVIDIA RTX 4080", score: 85 },
  { name: "NVIDIA RTX 4070 Ti Super", score: 78 },
  { name: "NVIDIA RTX 4070 Ti", score: 75 },
  { name: "NVIDIA RTX 4070 Super", score: 70 },
  { name: "NVIDIA RTX 4070", score: 65 },
  { name: "NVIDIA RTX 4060 Ti 16GB", score: 58 },
  { name: "NVIDIA RTX 4060 Ti 8GB", score: 56 },
  { name: "NVIDIA RTX 4060", score: 50 },
  // NVIDIA GeForce RTX 30 Series
  { name: "NVIDIA RTX 3090 Ti", score: 78 },
  { name: "NVIDIA RTX 3090", score: 75 },
  { name: "NVIDIA RTX 3080 Ti", score: 73 },
  { name: "NVIDIA RTX 3080 12GB", score: 71 },
  { name: "NVIDIA RTX 3080 10GB", score: 68 },
  { name: "NVIDIA RTX 3070 Ti", score: 62 },
  { name: "NVIDIA RTX 3070", score: 58 },
  { name: "NVIDIA RTX 3060 Ti", score: 52 },
  { name: "NVIDIA RTX 3060 12GB", score: 45 },
  { name: "NVIDIA RTX 3050", score: 35 },
  // NVIDIA GeForce RTX 20 Series
  { name: "NVIDIA RTX 2080 Ti", score: 60 },
  { name: "NVIDIA RTX 2080 Super", score: 55 },
  { name: "NVIDIA RTX 2080", score: 52 },
  { name: "NVIDIA RTX 2070 Super", score: 50 },
  { name: "NVIDIA RTX 2070", score: 47 },
  { name: "NVIDIA RTX 2060 Super", score: 44 },
  { name: "NVIDIA RTX 2060", score: 40 },
  // NVIDIA GeForce GTX 16 Series
  { name: "NVIDIA GTX 1660 Ti", score: 35 },
  { name: "NVIDIA GTX 1660 Super", score: 33 },
  { name: "NVIDIA GTX 1660", score: 30 },
  { name: "NVIDIA GTX 1650 Super", score: 27 },
  { name: "NVIDIA GTX 1650", score: 22 },
  // NVIDIA GeForce GTX 10 Series
  { name: "NVIDIA GTX 1080 Ti", score: 45 },
  { name: "NVIDIA GTX 1080", score: 38 },
  { name: "NVIDIA GTX 1070 Ti", score: 35 },
  { name: "NVIDIA GTX 1070", score: 32 },
  { name: "NVIDIA GTX 1060 6GB", score: 25 },
  { name: "NVIDIA GTX 1060 3GB", score: 22 },
  { name: "NVIDIA GTX 1050 Ti", score: 18 },
  { name: "NVIDIA GTX 1050", score: 15 },
  // NVIDIA older
  { name: "NVIDIA GTX 980 Ti", score: 28 },
  { name: "NVIDIA GTX 980", score: 22 },
  { name: "NVIDIA GTX 970", score: 20 },
  { name: "NVIDIA GTX 960", score: 14 },
  { name: "NVIDIA GTX 950", score: 12 },
  { name: "NVIDIA GTX 750 Ti", score: 8 },
  // AMD Radeon RX 9000 Series
  { name: "AMD RX 9070 XT", score: 78 },
  { name: "AMD RX 9070", score: 70 },
  // AMD Radeon RX 7000 Series
  { name: "AMD RX 7900 XTX", score: 85 },
  { name: "AMD RX 7900 XT", score: 78 },
  { name: "AMD RX 7900 GRE", score: 68 },
  { name: "AMD RX 7800 XT", score: 65 },
  { name: "AMD RX 7700 XT", score: 58 },
  { name: "AMD RX 7600 XT", score: 48 },
  { name: "AMD RX 7600", score: 44 },
  // AMD Radeon RX 6000 Series
  { name: "AMD RX 6950 XT", score: 75 },
  { name: "AMD RX 6900 XT", score: 70 },
  { name: "AMD RX 6800 XT", score: 65 },
  { name: "AMD RX 6800", score: 58 },
  { name: "AMD RX 6750 XT", score: 52 },
  { name: "AMD RX 6700 XT", score: 48 },
  { name: "AMD RX 6700", score: 42 },
  { name: "AMD RX 6650 XT", score: 42 },
  { name: "AMD RX 6600 XT", score: 40 },
  { name: "AMD RX 6600", score: 36 },
  { name: "AMD RX 6500 XT", score: 20 },
  { name: "AMD RX 6400", score: 16 },
  // AMD Radeon RX 5000 Series
  { name: "AMD RX 5700 XT", score: 45 },
  { name: "AMD RX 5700", score: 40 },
  { name: "AMD RX 5600 XT", score: 36 },
  { name: "AMD RX 5500 XT", score: 25 },
  // AMD older
  { name: "AMD RX 590", score: 22 },
  { name: "AMD RX 580 8GB", score: 20 },
  { name: "AMD RX 570 4GB", score: 16 },
  { name: "AMD RX 560", score: 12 },
  { name: "AMD RX 480", score: 20 },
  { name: "AMD RX 470", score: 16 },
  // Intel Arc
  { name: "Intel Arc A770 16GB", score: 48 },
  { name: "Intel Arc A750", score: 42 },
  { name: "Intel Arc A580", score: 35 },
  { name: "Intel Arc A380", score: 15 },
];

// ── CPU Database with performance scores (1-100) ──
const cpuList = [
  // Intel Core Ultra 200 (Arrow Lake)
  { name: "Intel Core Ultra 9 285K", score: 95 },
  { name: "Intel Core Ultra 7 265K", score: 88 },
  { name: "Intel Core Ultra 5 245K", score: 78 },
  // Intel 14th Gen
  { name: "Intel Core i9-14900KS", score: 94 },
  { name: "Intel Core i9-14900K", score: 92 },
  { name: "Intel Core i9-14900KF", score: 92 },
  { name: "Intel Core i7-14700K", score: 85 },
  { name: "Intel Core i7-14700KF", score: 85 },
  { name: "Intel Core i7-14700", score: 80 },
  { name: "Intel Core i7-14700F", score: 80 },
  { name: "Intel Core i5-14600K", score: 75 },
  { name: "Intel Core i5-14600KF", score: 75 },
  { name: "Intel Core i5-14500", score: 68 },
  { name: "Intel Core i5-14400", score: 62 },
  { name: "Intel Core i5-14400F", score: 62 },
  { name: "Intel Core i3-14100", score: 45 },
  { name: "Intel Core i3-14100F", score: 45 },
  // Intel 13th Gen
  { name: "Intel Core i9-13900KS", score: 90 },
  { name: "Intel Core i9-13900K", score: 88 },
  { name: "Intel Core i9-13900KF", score: 88 },
  { name: "Intel Core i9-13900", score: 82 },
  { name: "Intel Core i7-13700K", score: 80 },
  { name: "Intel Core i7-13700KF", score: 80 },
  { name: "Intel Core i7-13700", score: 75 },
  { name: "Intel Core i5-13600K", score: 72 },
  { name: "Intel Core i5-13600KF", score: 72 },
  { name: "Intel Core i5-13500", score: 65 },
  { name: "Intel Core i5-13400", score: 58 },
  { name: "Intel Core i5-13400F", score: 58 },
  { name: "Intel Core i3-13100", score: 40 },
  { name: "Intel Core i3-13100F", score: 40 },
  // Intel 12th Gen
  { name: "Intel Core i9-12900KS", score: 82 },
  { name: "Intel Core i9-12900K", score: 80 },
  { name: "Intel Core i9-12900KF", score: 80 },
  { name: "Intel Core i7-12700K", score: 72 },
  { name: "Intel Core i7-12700KF", score: 72 },
  { name: "Intel Core i7-12700", score: 68 },
  { name: "Intel Core i5-12600K", score: 65 },
  { name: "Intel Core i5-12600KF", score: 65 },
  { name: "Intel Core i5-12400", score: 55 },
  { name: "Intel Core i5-12400F", score: 55 },
  { name: "Intel Core i3-12100", score: 38 },
  { name: "Intel Core i3-12100F", score: 38 },
  // Intel 11th Gen
  { name: "Intel Core i9-11900K", score: 65 },
  { name: "Intel Core i7-11700K", score: 60 },
  { name: "Intel Core i5-11600K", score: 52 },
  { name: "Intel Core i5-11400", score: 48 },
  { name: "Intel Core i3-11100", score: 32 },
  // Intel 10th Gen
  { name: "Intel Core i9-10900K", score: 60 },
  { name: "Intel Core i7-10700K", score: 55 },
  { name: "Intel Core i5-10600K", score: 48 },
  { name: "Intel Core i5-10400", score: 42 },
  { name: "Intel Core i3-10100", score: 28 },
  // Intel older
  { name: "Intel Core i9-9900K", score: 50 },
  { name: "Intel Core i7-9700K", score: 45 },
  { name: "Intel Core i5-9600K", score: 38 },
  { name: "Intel Core i7-8700K", score: 40 },
  { name: "Intel Core i5-8600K", score: 34 },
  { name: "Intel Core i7-7700K", score: 32 },
  { name: "Intel Core i5-7600K", score: 26 },
  { name: "Intel Core i7-6700K", score: 28 },
  { name: "Intel Core i5-6600K", score: 22 },
  { name: "Intel Core i7-4790K", score: 22 },
  { name: "Intel Core i5-4690K", score: 18 },
  // AMD Ryzen 9000 Series
  { name: "AMD Ryzen 9 9950X", score: 96 },
  { name: "AMD Ryzen 9 9900X", score: 90 },
  { name: "AMD Ryzen 7 9800X3D", score: 92 },
  { name: "AMD Ryzen 7 9700X", score: 82 },
  { name: "AMD Ryzen 5 9600X", score: 75 },
  // AMD Ryzen 7000 Series
  { name: "AMD Ryzen 9 7950X", score: 92 },
  { name: "AMD Ryzen 9 7950X3D", score: 94 },
  { name: "AMD Ryzen 9 7900X", score: 88 },
  { name: "AMD Ryzen 9 7900X3D", score: 90 },
  { name: "AMD Ryzen 9 7900", score: 82 },
  { name: "AMD Ryzen 7 7800X3D", score: 88 },
  { name: "AMD Ryzen 7 7700X", score: 78 },
  { name: "AMD Ryzen 7 7700", score: 72 },
  { name: "AMD Ryzen 5 7600X", score: 70 },
  { name: "AMD Ryzen 5 7600", score: 65 },
  // AMD Ryzen 5000 Series
  { name: "AMD Ryzen 9 5950X", score: 78 },
  { name: "AMD Ryzen 9 5900X", score: 75 },
  { name: "AMD Ryzen 7 5800X3D", score: 78 },
  { name: "AMD Ryzen 7 5800X", score: 68 },
  { name: "AMD Ryzen 7 5800", score: 65 },
  { name: "AMD Ryzen 7 5700X", score: 62 },
  { name: "AMD Ryzen 7 5700G", score: 55 },
  { name: "AMD Ryzen 5 5600X", score: 60 },
  { name: "AMD Ryzen 5 5600", score: 55 },
  { name: "AMD Ryzen 5 5600G", score: 48 },
  { name: "AMD Ryzen 5 5500", score: 45 },
  // AMD Ryzen 3000 Series
  { name: "AMD Ryzen 9 3950X", score: 62 },
  { name: "AMD Ryzen 9 3900X", score: 58 },
  { name: "AMD Ryzen 7 3800X", score: 52 },
  { name: "AMD Ryzen 7 3700X", score: 50 },
  { name: "AMD Ryzen 5 3600X", score: 45 },
  { name: "AMD Ryzen 5 3600", score: 42 },
  { name: "AMD Ryzen 5 3500", score: 35 },
  { name: "AMD Ryzen 3 3300X", score: 35 },
  { name: "AMD Ryzen 3 3100", score: 30 },
  // AMD Ryzen 2000 Series
  { name: "AMD Ryzen 7 2700X", score: 40 },
  { name: "AMD Ryzen 7 2700", score: 36 },
  { name: "AMD Ryzen 5 2600X", score: 35 },
  { name: "AMD Ryzen 5 2600", score: 32 },
  { name: "AMD Ryzen 3 2200G", score: 20 },
  // AMD Ryzen 1000 Series
  { name: "AMD Ryzen 7 1800X", score: 32 },
  { name: "AMD Ryzen 7 1700", score: 28 },
  { name: "AMD Ryzen 5 1600", score: 25 },
  { name: "AMD Ryzen 5 1400", score: 18 },
  { name: "AMD Ryzen 3 1200", score: 14 },
];

const ramOptions = [
  { name: "4 GB", score: 10 },
  { name: "6 GB", score: 15 },
  { name: "8 GB", score: 20 },
  { name: "12 GB", score: 35 },
  { name: "16 GB", score: 50 },
  { name: "24 GB", score: 65 },
  { name: "32 GB", score: 80 },
  { name: "48 GB", score: 90 },
  { name: "64 GB", score: 95 },
  { name: "128 GB", score: 100 },
];

// ── Game FPS Database ──
// Each game has a "baseFps" at 1080p medium for a GPU score of 50, and a "weight" for how demanding it is
// Lower weight = more demanding game
interface GameProfile {
  name: string;
  baseFps: number; // FPS at 1080p medium for a perfect score-100 system
  cpuWeight: number; // how CPU-bound the game is (0-1, higher = more CPU dependent)
}

const games: GameProfile[] = [
  { name: "Valorant", baseFps: 500, cpuWeight: 0.5 },
  { name: "Fortnite", baseFps: 280, cpuWeight: 0.35 },
  { name: "Marvel Rivals", baseFps: 200, cpuWeight: 0.3 },
  { name: "Elden Ring", baseFps: 180, cpuWeight: 0.25 },
  { name: "Red Dead Redemption 2", baseFps: 250, cpuWeight: 0.3 },
  { name: "Cyberpunk 2077", baseFps: 200, cpuWeight: 0.25 },
  { name: "Call of Duty: Warzone", baseFps: 260, cpuWeight: 0.4 },
  { name: "GTA V", baseFps: 300, cpuWeight: 0.3 },
  { name: "Minecraft (Shaders)", baseFps: 250, cpuWeight: 0.45 },
  { name: "Apex Legends", baseFps: 270, cpuWeight: 0.35 },
  { name: "Hogwarts Legacy", baseFps: 190, cpuWeight: 0.2 },
  { name: "Starfield", baseFps: 170, cpuWeight: 0.35 },
];

type SettingLevel = "Low" | "Medium" | "High" | "Ultra";
type Resolution = "1080p" | "1440p" | "4K";

const resolutionMultiplier: Record<Resolution, number> = {
  "1080p": 1.0,
  "1440p": 0.7,
  "4K": 0.4,
};

const settingsMultiplier: Record<SettingLevel, number> = {
  Low: 1.4,
  Medium: 1.0,
  High: 0.8,
  Ultra: 0.65,
};

function estimateFps(gpuScore: number, cpuScore: number, ramScore: number, game: GameProfile, res: Resolution, settings: SettingLevel): number | null {
  const blendedScore = (gpuScore * (1 - game.cpuWeight) + cpuScore * game.cpuWeight) / 100;
  const effectivePerf = Math.pow(blendedScore, 1.5);
  const ramPenalty = ramScore < 30 ? 0.75 : ramScore < 50 ? 0.9 : 1.0;
  const fps = game.baseFps * effectivePerf * resolutionMultiplier[res] * settingsMultiplier[settings] * ramPenalty;
  const result = Math.max(1, Math.round(fps));

  // Minimum GPU score thresholds - below these the game won't launch or is unplayable
  // Game demand factor: heavier games need stronger GPUs
  const gameDemand = 300 / game.baseFps; // higher = more demanding
  const minGpuFor1080pLow = Math.round(8 * gameDemand);
  const minGpuFor1080pMed = Math.round(12 * gameDemand);
  const minGpuFor1080pHigh = Math.round(18 * gameDemand);
  const minGpuFor1080pUltra = Math.round(22 * gameDemand);

  const resMin: Record<Resolution, number> = {
    "1080p": 1,
    "1440p": 1.4,
    "4K": 2.2,
  };
  const settMin: Record<SettingLevel, number> = {
    Low: minGpuFor1080pLow,
    Medium: minGpuFor1080pMed,
    High: minGpuFor1080pHigh,
    Ultra: minGpuFor1080pUltra,
  };

  const requiredGpu = Math.round(settMin[settings] * resMin[res]);
  if (gpuScore < requiredGpu) return null;

  // If FPS would be below 10, it's essentially unplayable
  if (result < 10) return null;

  return result;
}

function getFpsColor(fps: number | null): string {
  if (fps === null) return "text-red-500/60";
  if (fps >= 144) return "text-green-400";
  if (fps >= 100) return "text-green-500";
  if (fps >= 60) return "text-emerald-400";
  if (fps >= 45) return "text-yellow-400";
  if (fps >= 30) return "text-orange-400";
  return "text-red-400";
}

// ── Analysis ──
interface Results {
  overallScore: number;
  bottleneck: string | null;
  upgrades: string[];
  verdict: string;
  isHighEnd: boolean;
}

function analyze(cpuScore: number, gpuScore: number, ramScore: number): Results {
  const overall = Math.round(gpuScore * 0.5 + cpuScore * 0.35 + ramScore * 0.15);
  const isHighEnd = gpuScore >= 85 && cpuScore >= 80 && ramScore >= 50;

  let bottleneck: string | null = null;
  const diff = cpuScore - gpuScore;
  if (diff >= 30) bottleneck = "Your GPU is significantly weaker than your CPU. A GPU upgrade would unlock much better gaming performance.";
  else if (diff <= -30) bottleneck = "Your CPU is holding back your GPU. Consider upgrading your processor to reduce stuttering.";
  else if (ramScore <= 20 && gpuScore >= 40) bottleneck = "Low RAM is causing stutters and limiting multitasking. Upgrade to at least 16 GB.";

  const upgrades: string[] = [];
  if (isHighEnd) {
    upgrades.push("Your setup is already pushing high-end 4K gaming with ease. Make sure you are happy with your aesthetics, case, cooling, and peripherals (monitor, keyboard, mouse, headset).");
    if (ramScore < 80) upgrades.push("Consider 32 GB+ RAM for future-proofing and heavy multitasking/streaming.");
  } else {
    if (gpuScore < 45) upgrades.push("Upgrade your GPU for the single biggest boost in gaming performance.");
    if (cpuScore < 45) upgrades.push("A modern CPU would greatly improve responsiveness and frame consistency.");
    if (ramScore <= 20) upgrades.push("Upgrade to at least 16 GB of RAM for smooth gameplay in modern titles.");
    if (ramScore <= 50 && gpuScore >= 65) upgrades.push("Consider 32 GB RAM to fully leverage your GPU in demanding games and workloads.");
    if (gpuScore >= 60 && cpuScore >= 60 && ramScore >= 50 && gpuScore < 85) upgrades.push("Your next best upgrade is a top-tier GPU to push into 4K territory.");
  }

  let verdict = "Your system needs significant upgrades to handle modern games.";
  if (isHighEnd) verdict = "Beast mode. Your rig crushes everything. Focus on peripherals and aesthetics.";
  else if (overall >= 80) verdict = "Excellent system. You are set for high-end gaming at high resolutions.";
  else if (overall >= 65) verdict = "Strong build. You can comfortably game at 1440p with great settings.";
  else if (overall >= 50) verdict = "Solid mid-range setup. A targeted upgrade could take it to the next level.";
  else if (overall >= 35) verdict = "Your system handles lighter games well but will struggle with demanding titles.";

  return { overallScore: overall, bottleneck, upgrades, verdict, isHighEnd };
}

// ── Searchable Dropdown Component ──
const SearchDropdown = ({ label, icon: Icon, items, selected, onSelect }: {
  label: string;
  icon: React.ElementType;
  items: { name: string; score: number }[];
  selected: { name: string; score: number } | null;
  onSelect: (item: { name: string; score: number }) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all duration-300 text-left group ${
          open
            ? "border-foreground bg-foreground/5"
            : selected
            ? "border-foreground/30 bg-foreground/[0.03]"
            : "border-border hover:border-foreground/20 bg-card/30"
        }`}
      >
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300 ${
          selected ? "bg-foreground text-background" : "bg-muted text-muted-foreground group-hover:bg-foreground/10"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
          <p className={`text-sm truncate ${selected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {selected ? selected.name : "Select..."}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => { onSelect(item); setOpen(false); setSearch(""); }}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors duration-150 flex items-center justify-between ${
                      selected?.name === item.name
                        ? "bg-foreground/5 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{item.name}</span>
                    {selected?.name === item.name && <CheckCircle className="w-4 h-4 text-foreground" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── RAM Selector (Slider) ──
const RamSelector = ({ selected, onSelect }: {
  selected: { name: string; score: number } | null;
  onSelect: (item: { name: string; score: number }) => void;
}) => {
  const currentIndex = selected ? ramOptions.findIndex(o => o.name === selected.name) : -1;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
          <MemoryStick className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Memory (RAM)</p>
      </div>
      <div className="rounded-2xl border border-border bg-card/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">RAM Amount</span>
          <motion.span
            key={selected?.name}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold text-foreground"
          >
            {selected?.name || "Select RAM"}
          </motion.span>
        </div>
        <input
          type="range"
          min={0}
          max={ramOptions.length - 1}
          step={1}
          value={currentIndex >= 0 ? currentIndex : 0}
          onChange={(e) => onSelect(ramOptions[parseInt(e.target.value)])}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-foreground [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
        />
        <div className="flex justify-between mt-3">
          {ramOptions.map((opt, i) => {
            const showLabel = [0, 2, 4, 6, 8, 9].includes(i);
            return showLabel ? (
              <button
                key={opt.name}
                onClick={() => onSelect(opt)}
                className={`text-xs transition-colors ${
                  currentIndex === i ? "text-foreground font-semibold" : "text-muted-foreground/60 hover:text-muted-foreground"
                }`}
              >
                {opt.name}
              </button>
            ) : <span key={opt.name} className="text-xs invisible">.</span>;
          })}
        </div>
      </div>
    </div>
  );
};

// ── Score Ring ──
const ScoreRing = ({ score }: { score: number }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "hsl(var(--foreground))" : score >= 50 ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground) / 0.5)";

  return (
    <div className="relative inline-flex items-center justify-center w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
        <motion.circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute font-heading text-4xl font-bold text-foreground"
      >
        {score}
      </motion.span>
    </div>
  );
};

// ── Game FPS Table ──
const resolutions: Resolution[] = ["1080p", "1440p", "4K"];
const settings: SettingLevel[] = ["Low", "Medium", "High", "Ultra"];

const GameFpsSection = ({ gpuScore, cpuScore, ramScore }: { gpuScore: number; cpuScore: number; ramScore: number }) => {
  const [selectedRes, setSelectedRes] = useState<Resolution>("1080p");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 className="w-5 h-5 text-foreground" />
        <h3 className="font-heading text-xl font-bold text-foreground">Game Performance Estimates</h3>
      </div>

      {/* Resolution tabs */}
      <div className="flex gap-2 mb-6">
        {resolutions.map((res) => (
          <button
            key={res}
            onClick={() => setSelectedRes(res)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedRes === res
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            {res}
          </button>
        ))}
      </div>

      {/* Games table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 gap-0 bg-muted/50 px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="col-span-1">Game</div>
          {settings.map((s) => (
            <div key={s} className="text-center">{s}</div>
          ))}
        </div>

        {/* Rows */}
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className={`grid grid-cols-5 gap-0 px-4 py-4 items-center ${
              i < games.length - 1 ? "border-b border-border" : ""
            } hover:bg-muted/30 transition-colors duration-200`}
          >
            <div className="col-span-1 flex items-center">
              <span className="text-sm font-medium text-foreground truncate">{game.name}</span>
            </div>
            {settings.map((setting) => {
              const fps = estimateFps(gpuScore, cpuScore, ramScore, game, selectedRes, setting);
              return (
                <div key={setting} className="text-center">
                  {fps === null ? (
                    <span className="text-sm font-bold text-red-500/60">N/A</span>
                  ) : (
                    <span className={`text-sm font-bold ${getFpsColor(fps)}`}>
                      {fps} <span className="text-xs font-normal opacity-70">fps</span>
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        * Estimates based on component scores. Actual performance varies by driver, game version, and system configuration.
      </p>
    </motion.div>
  );
};

// ── Compare FPS Table ──
const CompareFpsSection = ({ build1, build2, label1, label2 }: {
  build1: { gpuScore: number; cpuScore: number; ramScore: number };
  build2: { gpuScore: number; cpuScore: number; ramScore: number };
  label1: string;
  label2: string;
}) => {
  const [selectedRes, setSelectedRes] = useState<Resolution>("1080p");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 className="w-5 h-5 text-foreground" />
        <h3 className="font-heading text-xl font-bold text-foreground">FPS Comparison</h3>
      </div>

      <div className="flex gap-2 mb-6">
        {resolutions.map((res) => (
          <button
            key={res}
            onClick={() => setSelectedRes(res)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedRes === res ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            {res}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] gap-0 bg-muted/50 px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">
          <div>Game</div>
          {settings.map((s) => (
            <div key={s} className="text-center">{s}</div>
          ))}
        </div>

        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.03 * i }}
            className={`${i < games.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] gap-0 px-4 py-3 items-center hover:bg-muted/30 transition-colors">
              <span className="text-sm font-medium text-foreground truncate">{game.name}</span>
              {settings.map((setting) => {
                const fps1 = estimateFps(build1.gpuScore, build1.cpuScore, build1.ramScore, game, selectedRes, setting);
                const fps2 = estimateFps(build2.gpuScore, build2.cpuScore, build2.ramScore, game, selectedRes, setting);
                const pctDiff = fps1 !== null && fps2 !== null && fps2 > 0 ? Math.round(((fps1 - fps2) / fps2) * 100) : null;

                return (
                  <div key={setting} className="text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      {fps1 === null ? (
                        <span className="text-red-500/60 font-bold">N/A</span>
                      ) : (
                        <span className={`font-bold ${getFpsColor(fps1)}`}>{fps1}</span>
                      )}
                      <span className="text-muted-foreground/40">vs</span>
                      {fps2 === null ? (
                        <span className="text-red-500/60 font-bold">N/A</span>
                      ) : (
                        <span className={`font-bold ${getFpsColor(fps2)}`}>{fps2}</span>
                      )}
                    </div>
                    {pctDiff !== null && pctDiff !== 0 && (
                      <span className={`text-[10px] font-semibold ${pctDiff > 0 ? "text-green-400" : "text-red-400"}`}>
                        {pctDiff > 0 ? "+" : ""}{pctDiff}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-foreground inline-block" /> {label1}</span>
        <span className="text-muted-foreground/40">vs</span>
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" /> {label2}</span>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        * Estimates based on component scores. Actual performance varies by driver, game version, and system configuration.
      </p>
    </motion.div>
  );
};

// ── Build Selector Panel (for compare mode) ──
const BuildPanel = ({ label, cpu, gpu, ram, setCpu, setGpu, setRam, onChanged }: {
  label: string;
  cpu: { name: string; score: number } | null;
  gpu: { name: string; score: number } | null;
  ram: { name: string; score: number } | null;
  setCpu: (v: any) => void;
  setGpu: (v: any) => void;
  setRam: (v: any) => void;
  onChanged: () => void;
}) => {
  const select = (setter: (v: any) => void) => (item: { name: string; score: number }) => {
    setter(item);
    onChanged();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-bold text-foreground text-center mb-4">{label}</h3>
      <SearchDropdown label="CPU" icon={Cpu} items={cpuList} selected={cpu} onSelect={select(setCpu)} />
      <SearchDropdown label="GPU" icon={MonitorPlay} items={gpuList} selected={gpu} onSelect={select(setGpu)} />
      <RamSelector selected={ram} onSelect={select(setRam)} />
    </div>
  );
};

// ── Main Page ──
const PcAnalyzer = () => {
  const [mode, setMode] = useState<"single" | "compare">("single");

  // Single mode state
  const [cpu, setCpu] = useState<{ name: string; score: number } | null>(null);
  const [gpu, setGpu] = useState<{ name: string; score: number } | null>(null);
  const [ram, setRam] = useState<{ name: string; score: number } | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Compare mode state
  const [cpu1, setCpu1] = useState<{ name: string; score: number } | null>(null);
  const [gpu1, setGpu1] = useState<{ name: string; score: number } | null>(null);
  const [ram1, setRam1] = useState<{ name: string; score: number } | null>(null);
  const [cpu2, setCpu2] = useState<{ name: string; score: number } | null>(null);
  const [gpu2, setGpu2] = useState<{ name: string; score: number } | null>(null);
  const [ram2, setRam2] = useState<{ name: string; score: number } | null>(null);
  const [compareResults, setCompareResults] = useState<{ r1: Results; r2: Results } | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const allSelected = cpu && gpu && ram;
  const allCompareSelected = cpu1 && gpu1 && ram1 && cpu2 && gpu2 && ram2;

  const handleAnalyze = () => {
    if (!allSelected) return;
    setResults(analyze(cpu.score, gpu.score, ram.score));
    setShowResults(true);
  };

  const handleCompare = () => {
    if (!allCompareSelected) return;
    setCompareResults({
      r1: analyze(cpu1.score, gpu1.score, ram1.score),
      r2: analyze(cpu2.score, gpu2.score, ram2.score),
    });
    setShowCompare(true);
  };

  const handleReset = () => {
    setCpu(null); setGpu(null); setRam(null);
    setResults(null); setShowResults(false);
  };

  const handleResetCompare = () => {
    setCpu1(null); setGpu1(null); setRam1(null);
    setCpu2(null); setGpu2(null); setRam2(null);
    setCompareResults(null); setShowCompare(false);
  };

  const selectAndClear = (setter: (v: any) => void) => (item: { name: string; score: number }) => {
    setter(item);
    setShowResults(false);
    setResults(null);
  };

  return (
    <Layout>
      <CanonicalHome />
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground text-background mb-6">
              <Gauge className="w-7 h-7" />
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-3">PC Check</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Select your components and we will show you exactly what FPS you can expect in your favorite games.
            </p>
          </motion.div>

          {/* Mode Tabs */}
          <div className="flex items-center justify-center gap-2 mb-14">
            {(["single", "compare"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 ${
                  mode === m
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "single" ? "Single Build" : "Compare Builds"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "single" ? (
              <motion.div key="single" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                {/* Single mode selectors */}
                <div className="max-w-3xl mx-auto space-y-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <SearchDropdown label="Processor (CPU)" icon={Cpu} items={cpuList} selected={cpu} onSelect={selectAndClear(setCpu)} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <SearchDropdown label="Graphics Card (GPU)" icon={MonitorPlay} items={gpuList} selected={gpu} onSelect={selectAndClear(setGpu)} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <RamSelector selected={ram} onSelect={selectAndClear(setRam)} />
                  </motion.div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 mt-14">
                  <motion.button
                    whileHover={allSelected ? { scale: 1.05 } : {}}
                    whileTap={allSelected ? { scale: 0.97 } : {}}
                    onClick={handleAnalyze}
                    disabled={!allSelected}
                    className={`inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 ${
                      allSelected ? "bg-foreground text-background" : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    Analyze <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  {(allSelected || showResults) && (
                    <button onClick={handleReset} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                      <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                  )}
                </div>

                {/* Results */}
                <AnimatePresence>
                  {showResults && results && cpu && gpu && ram && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                      className="mt-20 space-y-12"
                    >
                      <div className="text-center">
                        <ScoreRing score={results.overallScore} />
                        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-4">Performance Score</p>
                      </div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="flex items-start gap-4 p-6 rounded-2xl bg-muted max-w-3xl mx-auto"
                      >
                        <Info className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                        <p className="text-foreground">{results.verdict}</p>
                      </motion.div>

                      <GameFpsSection gpuScore={gpu.score} cpuScore={cpu.score} ramScore={ram.score} />

                      {results.bottleneck && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                          className="flex items-start gap-4 p-6 rounded-2xl border border-border max-w-3xl mx-auto"
                        >
                          <AlertTriangle className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="font-heading font-bold text-foreground mb-1">Potential Bottleneck</p>
                            <p className="text-muted-foreground text-sm">{results.bottleneck}</p>
                          </div>
                        </motion.div>
                      )}

                      {results.upgrades.length > 0 && (
                        <div className="max-w-3xl mx-auto">
                          <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                            {results.isHighEnd ? "You Are Set" : "Recommended Upgrades"}
                          </h3>
                          <div className="space-y-3">
                            {results.upgrades.map((u, i) => (
                              <motion.div key={u} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                                className="flex items-start gap-3"
                              >
                                <CheckCircle className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                                <p className="text-muted-foreground">{u}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-center pt-6">
                        <p className="text-muted-foreground mb-4">Need help upgrading? We can do it for you.</p>
                        <Link to="/contact" className="inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300">
                          Get a Quote <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="compare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                {/* Compare mode: two build panels side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="rounded-3xl border border-border bg-card/20 p-6 lg:p-8">
                    <BuildPanel label="Build 1" cpu={cpu1} gpu={gpu1} ram={ram1} setCpu={setCpu1} setGpu={setGpu1} setRam={setRam1} onChanged={() => setShowCompare(false)} />
                  </div>
                  <div className="rounded-3xl border border-border bg-card/20 p-6 lg:p-8">
                    <BuildPanel label="Build 2" cpu={cpu2} gpu={gpu2} ram={ram2} setCpu={setCpu2} setGpu={setGpu2} setRam={setRam2} onChanged={() => setShowCompare(false)} />
                  </div>
                </div>

                {/* Compare Actions */}
                <div className="flex items-center justify-center gap-4 mt-14">
                  <motion.button
                    whileHover={allCompareSelected ? { scale: 1.05 } : {}}
                    whileTap={allCompareSelected ? { scale: 0.97 } : {}}
                    onClick={handleCompare}
                    disabled={!allCompareSelected}
                    className={`inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 ${
                      allCompareSelected ? "bg-foreground text-background" : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    Compare <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  {(allCompareSelected || showCompare) && (
                    <button onClick={handleResetCompare} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                      <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                  )}
                </div>

                {/* Compare Results */}
                <AnimatePresence>
                  {showCompare && compareResults && cpu1 && gpu1 && ram1 && cpu2 && gpu2 && ram2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                      className="mt-20 space-y-12"
                    >
                      {/* Side by side scores */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[
                          { label: "Build 1", r: compareResults.r1, cpuN: cpu1.name, gpuN: gpu1.name, ramN: ram1.name },
                          { label: "Build 2", r: compareResults.r2, cpuN: cpu2.name, gpuN: gpu2.name, ramN: ram2.name },
                        ].map((b, idx) => {
                          const other = idx === 0 ? compareResults.r2 : compareResults.r1;
                          const pct = other.overallScore > 0 ? Math.round(((b.r.overallScore - other.overallScore) / other.overallScore) * 100) : 0;

                          return (
                            <motion.div
                              key={b.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.15 }}
                              className="rounded-3xl border border-border p-8 text-center"
                            >
                              <h3 className="font-heading text-lg font-bold text-foreground mb-1">{b.label}</h3>
                              <p className="text-xs text-muted-foreground mb-6">{b.cpuN} / {b.gpuN} / {b.ramN}</p>
                              <ScoreRing score={b.r.overallScore} />
                              <p className="text-muted-foreground text-xs uppercase tracking-widest mt-4 mb-2">Performance Score</p>

                              {pct > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.5 + idx * 0.1 }}
                                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold mt-3 bg-green-500/10 text-green-400"
                                >
                                  +{pct}% faster
                                </motion.div>
                              )}

                              <div className="mt-6 p-4 rounded-2xl bg-muted text-left">
                                <p className="text-sm text-foreground">{b.r.verdict}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* FPS comparison table */}
                      <CompareFpsSection
                        build1={{ gpuScore: gpu1.score, cpuScore: cpu1.score, ramScore: ram1.score }}
                        build2={{ gpuScore: gpu2.score, cpuScore: cpu2.score, ramScore: ram2.score }}
                        label1={`Build 1 (${gpu1.name})`}
                        label2={`Build 2 (${gpu2.name})`}
                      />

                      <div className="text-center pt-6">
                        <p className="text-muted-foreground mb-4">Need help deciding? We will build it for you.</p>
                        <Link to="/contact" className="inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300">
                          Get a Quote <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default PcAnalyzer;
