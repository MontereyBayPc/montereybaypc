import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, MonitorPlay, MemoryStick, HardDrive, Gauge, ArrowRight, RotateCcw, AlertTriangle, CheckCircle, Info } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

type Tier = "low" | "mid" | "high" | "ultra";

interface ComponentOption {
  label: string;
  tier: Tier;
  year?: number;
}

const cpuOptions: ComponentOption[] = [
  { label: "Intel i3 / Ryzen 3 (10th/3000 series or older)", tier: "low", year: 2020 },
  { label: "Intel i5 / Ryzen 5 (10th-11th / 3000-4000)", tier: "mid", year: 2021 },
  { label: "Intel i5 / Ryzen 5 (12th-13th / 5000-7000)", tier: "high", year: 2023 },
  { label: "Intel i7-i9 / Ryzen 7-9 (13th-14th / 7000-9000)", tier: "ultra", year: 2024 },
];

const gpuOptions: ComponentOption[] = [
  { label: "GTX 1650 / RX 570 or older", tier: "low", year: 2019 },
  { label: "RTX 3060 / RX 6600 XT", tier: "mid", year: 2021 },
  { label: "RTX 4060 Ti / RX 7700 XT", tier: "high", year: 2023 },
  { label: "RTX 4070 Ti+ / RX 7900 XTX or better", tier: "ultra", year: 2024 },
];

const ramOptions: ComponentOption[] = [
  { label: "8 GB or less", tier: "low" },
  { label: "16 GB DDR4", tier: "mid" },
  { label: "32 GB DDR4", tier: "high" },
  { label: "32 GB+ DDR5", tier: "ultra" },
];

const storageOptions: ComponentOption[] = [
  { label: "HDD only", tier: "low" },
  { label: "SATA SSD (250-500 GB)", tier: "mid" },
  { label: "NVMe SSD (500 GB - 1 TB)", tier: "high" },
  { label: "NVMe Gen4/5 (1 TB+)", tier: "ultra" },
];

const tierScore: Record<Tier, number> = { low: 1, mid: 2, high: 3, ultra: 4 };

interface Results {
  overallScore: number;
  idealRes: string;
  fps: string;
  bottleneck: string | null;
  upgrades: string[];
  verdict: string;
}

function analyze(cpu: Tier, gpu: Tier, ram: Tier, storage: Tier): Results {
  const scores = { cpu: tierScore[cpu], gpu: tierScore[gpu], ram: tierScore[ram], storage: tierScore[storage] };
  const avg = (scores.cpu + scores.gpu + scores.ram + scores.storage) / 4;
  const gpuScore = scores.gpu;

  let idealRes = "720p";
  let fps = "30-60 FPS";
  if (gpuScore >= 4) { idealRes = "4K"; fps = "60-120+ FPS"; }
  else if (gpuScore >= 3) { idealRes = "1440p"; fps = "60-100 FPS"; }
  else if (gpuScore >= 2) { idealRes = "1080p"; fps = "60-80 FPS"; }

  let bottleneck: string | null = null;
  if (scores.cpu - scores.gpu >= 2) bottleneck = "Your GPU is significantly weaker than your CPU. Consider a GPU upgrade.";
  else if (scores.gpu - scores.cpu >= 2) bottleneck = "Your CPU may be bottlenecking your GPU. Consider a CPU upgrade.";
  else if (scores.ram === 1) bottleneck = "Low RAM is likely causing stutters and slowdowns.";

  const upgrades: string[] = [];
  if (scores.gpu <= 2) upgrades.push("Upgrade your GPU for the biggest performance gain in games.");
  if (scores.cpu <= 2) upgrades.push("A newer CPU would improve overall responsiveness and multitasking.");
  if (scores.ram <= 1) upgrades.push("Upgrade to at least 16 GB of RAM for modern games and apps.");
  if (scores.storage <= 1) upgrades.push("Switch from HDD to SSD for drastically faster load times.");
  if (scores.ram === 2 && scores.gpu >= 3) upgrades.push("Consider 32 GB RAM to fully utilize your GPU in heavy workloads.");

  let verdict = "Your system needs significant upgrades to handle modern games.";
  if (avg >= 3.5) verdict = "Your system is excellent. You're ready for high-end gaming and demanding workloads.";
  else if (avg >= 2.5) verdict = "Solid mid-range system. A targeted upgrade or two could push it further.";
  else if (avg >= 1.5) verdict = "Your system can handle lighter games but struggles with newer titles.";

  return { overallScore: Math.round(avg * 25), idealRes, fps, bottleneck, upgrades, verdict };
}

const categories = [
  { key: "cpu", label: "Processor (CPU)", icon: Cpu, options: cpuOptions },
  { key: "gpu", label: "Graphics Card (GPU)", icon: MonitorPlay, options: gpuOptions },
  { key: "ram", label: "Memory (RAM)", icon: MemoryStick, options: ramOptions },
  { key: "storage", label: "Storage", icon: HardDrive, options: storageOptions },
] as const;

const PcAnalyzer = () => {
  const [selections, setSelections] = useState<Record<string, Tier | null>>({
    cpu: null, gpu: null, ram: null, storage: null,
  });
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);

  const allSelected = Object.values(selections).every((v) => v !== null);

  const handleSelect = (key: string, tier: Tier) => {
    setSelections((prev) => ({ ...prev, [key]: tier }));
    setShowResults(false);
    setResults(null);
  };

  const handleAnalyze = () => {
    if (!allSelected) return;
    const r = analyze(selections.cpu!, selections.gpu!, selections.ram!, selections.storage!);
    setResults(r);
    setShowResults(true);
  };

  const handleReset = () => {
    setSelections({ cpu: null, gpu: null, ram: null, storage: null });
    setResults(null);
    setShowResults(false);
  };

  return (
    <Layout>
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <Gauge className="w-12 h-12 text-foreground mx-auto mb-6" />
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-3">PC Health Check</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Select your current components and we'll tell you where you stand, what resolution to target, and what to upgrade.
            </p>
          </motion.div>

          {/* Selection */}
          <div className="space-y-10">
            {categories.map((cat, ci) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <cat.icon className="w-5 h-5 text-foreground" />
                  <h2 className="font-heading text-lg font-bold text-foreground">{cat.label}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.options.map((opt) => {
                    const selected = selections[cat.key] === opt.tier;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleSelect(cat.key, opt.tier)}
                        className={`text-left px-5 py-4 rounded-xl border transition-all duration-300 ${
                          selected
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/20 bg-card/40"
                        }`}
                      >
                        <span className={`text-sm ${selected ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 mt-14"
          >
            <button
              onClick={handleAnalyze}
              disabled={!allSelected}
              className={`inline-flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 ${
                allSelected
                  ? "bg-foreground text-background hover:scale-105"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Analyze <ArrowRight className="w-4 h-4" />
            </button>
            {(allSelected || showResults) && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
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
                className="mt-16 space-y-8"
              >
                {/* Score */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="inline-flex items-center justify-center w-28 h-28 rounded-full border-2 border-foreground/20 mb-4"
                  >
                    <span className="font-heading text-4xl font-bold text-foreground">{results.overallScore}</span>
                  </motion.div>
                  <p className="text-muted-foreground text-sm uppercase tracking-widest">Overall Score</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-border rounded-xl p-6 text-center">
                    <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Ideal Resolution</p>
                    <p className="font-heading text-2xl font-bold text-foreground">{results.idealRes}</p>
                  </div>
                  <div className="border border-border rounded-xl p-6 text-center">
                    <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Expected Performance</p>
                    <p className="font-heading text-2xl font-bold text-foreground">{results.fps}</p>
                  </div>
                </div>

                {/* Verdict */}
                <div className="flex items-start gap-3 p-6 rounded-xl bg-muted">
                  <Info className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                  <p className="text-foreground">{results.verdict}</p>
                </div>

                {/* Bottleneck */}
                {results.bottleneck && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3 p-6 rounded-xl border border-border"
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
