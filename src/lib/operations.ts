export const FPS_PRESETS = ['1080p Ultra', '1440p High', '4K Max'] as const;
const pixels = [1920 * 1080, 2560 * 1440, 3840 * 2160];
export function simulatedFps(fps: string | number, resolution: string, preset: number, game: string) {
  const base = Number.parseInt(String(fps), 10);
  if (!Number.isFinite(base) || base <= 0) return null;
  const source = resolution.includes('4K') ? 2 : resolution.includes('1440') ? 1 : 0;
  const target = Math.max(0, Math.min(2, preset));
  const settings = [1, 1.15, 0.9];
  const value = Math.round(base * Math.pow(pixels[source] / pixels[target], 0.55) * settings[target]);
  return /elden ring/i.test(game) ? Math.min(60, value) : value;
}
export function grossProfit(revenue: number | null, parts: number | null, labor: number | null, other: number | null, label: number | null, refunded = false) {
  if (refunded || revenue === null || parts === null || labor === null || other === null) return null;
  const cost = parts + labor + other + (label ?? 0);
  const dollars = Math.round((revenue - cost) * 100) / 100;
  return { revenue, cost, dollars, percent: revenue > 0 ? dollars / revenue * 100 : 0 };
}
export function estimatedShipWindow(date = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  const parts = today.split('-').map(Number);
  const start = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
  const format = (offset: number) => {
    const day = new Date(start); day.setUTCDate(day.getUTCDate() + offset);
    return day.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
  };
  return `${format(7)} - ${format(14)}`;
}