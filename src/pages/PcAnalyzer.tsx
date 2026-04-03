import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, MonitorPlay, MemoryStick, Gauge, ArrowRight, RotateCcw, AlertTriangle, CheckCircle, Info, ChevronDown, Search } from "lucide-react";
import Layout from "@/components/Layout";
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
  // Intel 14th Gen (Raptor Lake Refresh)
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
  // Intel 13th Gen (Raptor Lake)
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
  // Intel 12th Gen (Alder Lake)
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
  { name: "8 GB or less", score: 20 },
  { name: "16 GB", score: 50 },
  { name: "32 GB", score: 80 },
  { name: "64 GB+", score: 100 },
];

// ── Analysis ──
interface Results {
  overallScore: number;
  idealRes: string;
  fps: string;
  bottleneck: string | null;
  upgrades: string[];
  verdict: string;
}

function analyze(cpuScore: number, gpuScore: number, ramScore: number): Results {
  // GPU-weighted average for gaming
  const overall = Math.round(gpuScore * 0.5 + cpuScore * 0.35 + ramScore * 0.15);

  let idealRes = "720p";
  let fps = "30-45 FPS";
  if (gpuScore >= 85) { idealRes = "4K"; fps = "80-120+ FPS"; }
  else if (gpuScore >= 70) { idealRes = "4K"; fps = "60-80 FPS"; }
  else if (gpuScore >= 55) { idealRes = "1440p"; fps = "60-100 FPS"; }
  else if (gpuScore >= 40) { idealRes = "1080p"; fps = "60-90 FPS"; }
  else if (gpuScore >= 25) { idealRes = "1080p"; fps = "40-60 FPS"; }
  else if (gpuScore >= 15) { idealRes = "1080p Low"; fps = "30-50 FPS"; }

  let bottleneck: string | null = null;
  const diff = cpuScore - gpuScore;
  if (diff >= 30) bottleneck = "Your GPU is significantly weaker than your CPU. A GPU upgrade would unlock much better gaming performance.";
  else if (diff <= -30) bottleneck = "Your CPU is holding back your GPU. Consider upgrading your processor to reduce stuttering.";
  else if (ramScore <= 20 && gpuScore >= 40) bottleneck = "Low RAM is causing stutters and limiting multitasking. Upgrade to at least 16 GB.";

  const upgrades: string[] = [];
  if (gpuScore < 45) upgrades.push("Upgrade your GPU for the single biggest boost in gaming performance.");
  if (cpuScore < 45) upgrades.push("A modern CPU would greatly improve responsiveness and frame consistency.");
  if (ramScore <= 20) upgrades.push("Upgrade to at least 16 GB of RAM for smooth gameplay in modern titles.");
  if (ramScore <= 50 && gpuScore >= 65) upgrades.push("Consider 32 GB RAM to fully leverage your GPU in demanding games and workloads.");

  let verdict = "Your system needs significant upgrades to handle modern games.";
  if (overall >= 80) verdict = "Excellent system. You're set for high-end gaming at high resolutions.";
  else if (overall >= 65) verdict = "Strong build. You can comfortably game at 1440p with great settings.";
  else if (overall >= 50) verdict = "Solid mid-range setup. A targeted upgrade could take it to the next level.";
  else if (overall >= 35) verdict = "Your system handles lighter games well but will struggle with demanding titles.";

  return { overallScore: overall, idealRes, fps, bottleneck, upgrades, verdict };
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

// ── RAM Selector ──
const RamSelector = ({ selected, onSelect }: {
  selected: { name: string; score: number } | null;
  onSelect: (item: { name: string; score: number }) => void;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-4 px-1">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
        <MemoryStick className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Memory (RAM)</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ramOptions.map((opt) => {
        const active = selected?.name === opt.name;
        return (
          <motion.button
            key={opt.name}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(opt)}
            className={`relative px-4 py-5 rounded-2xl border text-center transition-all duration-300 ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground/20 bg-card/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-sm font-medium">{opt.name}</span>
          </motion.button>
        );
      })}
    </div>
  </div>
);

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

// ── Main Page ──
const PcAnalyzer = () => {
  const [cpu, setCpu] = useState<{ name: string; score: number } | null>(null);
  const [gpu, setGpu] = useState<{ name: string; score: number } | null>(null);
  const [ram, setRam] = useState<{ name: string; score: number } | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);

  const allSelected = cpu && gpu && ram;

  const handleAnalyze = () => {
    if (!allSelected) return;
    setResults(analyze(cpu.score, gpu.score, ram.score));
    setShowResults(true);
  };

  const handleReset = () => {
    setCpu(null); setGpu(null); setRam(null);
    setResults(null); setShowResults(false);
  };

  const selectAndClear = (setter: (v: any) => void) => (item: { name: string; score: number }) => {
    setter(item);
    setShowResults(false);
    setResults(null);
  };

  return (
    <Layout>
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground text-background mb-6">
              <Gauge className="w-7 h-7" />
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-3">PC Health Check</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Select your components and we will break down your performance, ideal resolution, and what to upgrade.
            </p>
          </motion.div>

          {/* Selectors */}
          <div className="space-y-6">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 mt-14"
          >
            <motion.button
              whileHover={allSelected ? { scale: 1.05 } : {}}
              whileTap={allSelected ? { scale: 0.97 } : {}}
              onClick={handleAnalyze}
              disabled={!allSelected}
              className={`inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 ${
                allSelected
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Analyze <ArrowRight className="w-4 h-4" />
            </motion.button>
            {(allSelected || showResults) && (
              <button onClick={handleReset} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            )}
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {showResults && results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="mt-20 space-y-10"
              >
                {/* Score */}
                <div className="text-center">
                  <ScoreRing score={results.overallScore} />
                  <p className="text-muted-foreground text-xs uppercase tracking-widest mt-4">Performance Score</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Ideal Resolution", value: results.idealRes },
                    { label: "Expected FPS", value: results.fps },
                  ].map((s) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-border rounded-2xl p-6 text-center"
                    >
                      <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">{s.label}</p>
                      <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Verdict */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-muted"
                >
                  <Info className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                  <p className="text-foreground">{results.verdict}</p>
                </motion.div>

                {/* Bottleneck */}
                {results.bottleneck && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-4 p-6 rounded-2xl border border-border"
                  >
                    <AlertTriangle className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="font-heading font-bold text-foreground mb-1">Potential Bottleneck</p>
                      <p className="text-muted-foreground text-sm">{results.bottleneck}</p>
                    </div>
                  </motion.div>
                )}

                {/* Upgrades */}
                {results.upgrades.length > 0 && (
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-4">Recommended Upgrades</h3>
                    <div className="space-y-3">
                      {results.upgrades.map((u, i) => (
                        <motion.div
                          key={u}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                          <p className="text-muted-foreground">{u}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="text-center pt-6">
                  <p className="text-muted-foreground mb-4">Need help upgrading? We can do it for you.</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300"
                  >
                    Get a Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default PcAnalyzer;
