export type Socket = "AM4" | "AM5" | "LGA1700" | "LGA1851";
export type RamGen = "DDR4" | "DDR5";

export function cpuSocket(name: string): Socket | null {
  const n = name.toLowerCase();
  if (n.includes("ultra")) return "LGA1851";
  if (/i[3579]-1[234]\d{3}/.test(n)) return "LGA1700";
  const m = n.match(/ryzen \d (\d)\d{3}/);
  if (m) return m[1] === "5" ? "AM4" : "AM5";
  return null;
}

export function boardSocket(name: string): Socket | null {
  const n = name.toUpperCase();
  if (/B550/.test(n)) return "AM4";
  if (/B650|X670|X870/.test(n)) return "AM5";
  if (/B760|Z790/.test(n)) return "LGA1700";
  if (/Z890/.test(n)) return "LGA1851";
  return null;
}

export function boardRam(name: string): RamGen | null {
  const s = boardSocket(name);
  if (!s) return null;
  return s === "AM4" ? "DDR4" : "DDR5";
}

export function ramGen(name: string): RamGen | null {
  if (/DDR4/i.test(name)) return "DDR4";
  if (/DDR5/i.test(name)) return "DDR5";
  return null;
}

const GPU_WATTS: [RegExp, number][] = [
  [/5090/, 575], [/4090/, 450], [/5080/, 360], [/4080/, 320], [/5070 Ti/, 300], [/4070 Ti/, 285],
  [/5070/, 250], [/4070 Super/, 220], [/4070/, 200], [/5060 Ti/, 180], [/5060/, 145], [/4060 Ti/, 160],
  [/4060/, 115], [/3060/, 170], [/7900 XTX/, 355], [/7900 XT/, 315], [/7900 GRE/, 260], [/7800 XT/, 263],
  [/7700 XT/, 245], [/7600/, 165], [/9070 XT/, 304], [/9070/, 220], [/9060 XT/, 160], [/B580/, 190], [/B570/, 150],
];

export function gpuWatts(name: string): number {
  return GPU_WATTS.find(([r]) => r.test(name))?.[1] ?? 200;
}

export function cpuWatts(name: string): number {
  const n = name.toLowerCase();
  if (/i[79]-14/.test(n)) return 253;
  if (/ultra [79]/.test(n)) return 250;
  if (/i5-14600k/.test(n)) return 181;
  if (/ultra 5/.test(n)) return 159;
  if (/i[35]-/.test(n)) return 65;
  if (/x3d/.test(n)) return 120;
  if (/ryzen 9/.test(n)) return 170;
  if (/ryzen \d \d{4}x/.test(n)) return 105;
  return 88;
}

/** Peak system draw estimate: CPU + GPU + 100W for board, drives, fans. */
export function systemWatts(cpu?: string, gpu?: string): number {
  return (cpu ? cpuWatts(cpu) : 0) + (gpu ? gpuWatts(gpu) : 0) + 100;
}

/** Minimum PSU: 30% headroom over peak draw, rounded up to 50W. */
export function minPsu(watts: number): number {
  return Math.ceil((watts * 1.3) / 50) * 50;
}

export function psuWatts(name: string): number | null {
  const m = name.match(/(\d{3,4})W?\b/);
  return m ? Number(m[1]) : null;
}

export const RECOMMENDED = [
  "AMD Ryzen 7 7800X3D", "AMD Ryzen 7 9800X3D", "AMD Ryzen 5 7600",
  "NVIDIA RTX 4070 Super", "NVIDIA RTX 5070", "AMD Radeon RX 9070 XT",
  "MSI MAG B650 Tomahawk WiFi", "32GB (2x16) DDR5-6000 CL30 RGB", "Corsair RM850x 850W",
];

/** Formats US phone input as (831) 718-7730. */
export function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
