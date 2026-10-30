import { prebuiltCatalog, type PrebuiltSpec } from '@/data/prebuilts-catalog';
import { minPsu, psuWatts, systemWatts } from './compat';
import { simulatedFps } from './operations';
export const HARDWARE_UPGRADES = [
  { slug: 'upgrade-storage-1tb', name: '+1TB NVMe Storage', price: 150, description: 'Extra space for games and projects. Drive model and installation confirmed before assembly.' },
  { slug: 'upgrade-ram-64gb', name: '64GB RAM Upgrade', price: 800, description: 'For large editing projects, virtual machines and demanding multitasking. Replaces the memory kit, not an extra 64GB.' },
];
export function eligibleUpgrades(slugs: string[]) {
  const builds = prebuiltCatalog.filter(p => slugs.includes(p.slug));
  if (builds.length !== 1 || slugs.some(s => s === 'approved-quote' || s === 'the-beast')) return [];
  return HARDWARE_UPGRADES.filter(u => u.slug !== 'upgrade-ram-64gb' || !/64GB|96GB|128GB/.test(builds[0].specs.ram));
}
export function monitorAdvice(pc: PrebuiltSpec, resolution: string, hz: number) {
  const tier = pc.performance.resolution.includes('4K') ? 2 : pc.performance.resolution.includes('1440') ? 1 : 0;
  const target = resolution === '4K' ? 2 : resolution === '1440p' ? 1 : 0;
  return target > tier ? 'This resolution is above the build’s intended gaming target. Lower settings or a stronger GPU may be needed.' : hz > 165 ? 'High refresh is most useful in lighter competitive games. Demanding games may not reach your monitor’s full refresh rate.' : 'This resolution fits the build’s intended gaming target. Actual frame rates vary by game and settings.';
}
export function powerHeadroom(pc: PrebuiltSpec) {
  const capacity = psuWatts(pc.specs.psu);
  const draw = systemWatts(pc.specs.cpu, pc.specs.gpu);
  return { capacity, draw, spare: capacity === null ? null : capacity - draw, recommended: minPsu(draw) };
}
export function matchesGameTarget(pc: PrebuiltSpec, game: string, preset: number, fps: number) {
  if (game === 'All games') return true;
  const g = pc.performance.games.find(g => g.name.replace(/\s*\(.*\)/, '') === game);
  return !!g && (simulatedFps(g.fps, pc.performance.resolution, preset, g.name) ?? 0) >= fps;
}
export function cartShareUrl(origin: string, items: {slug:string;quantity:number}[]) {
  const url = new URL('/checkout', origin);
  url.searchParams.set('sponsor', '1');
  url.searchParams.set('cart', btoa(JSON.stringify(items.map(i => ({s:i.slug,q:i.quantity})))));
  return url.toString();
}
export function readSharedCart(value: string | null) {
  if (!value || value.length > 4000) return null;
  try {
    const data = JSON.parse(atob(value));
    if (!Array.isArray(data) || !data.length || data.length > 10) return null;
    const catalog = [...prebuiltCatalog, ...HARDWARE_UPGRADES];
    const result: {slug:string;name:string;price:number;quantity:number}[] = [];
    for (const i of data) {
      const item = catalog.find(p => p.slug === i.s);
      if (!item || !Number.isInteger(i.q) || i.q < 1 || i.q > 10 || result.some(p => p.slug === i.s)) return null;
      result.push({slug:item.slug,name:item.name,price:item.price,quantity:i.q});
    }
    if (!result.some(i => prebuiltCatalog.some(p => p.slug === i.slug))) return null;
    const allowed = eligibleUpgrades(result.map(i=>i.slug)).map(u=>u.slug);
    if(result.some(i=>HARDWARE_UPGRADES.some(u=>u.slug===i.slug)&&!allowed.includes(i.slug)))return null;
    return result;
  } catch { return null; }
}
export async function sharePurchase(url: string, title: string) {
  if (navigator.share) await navigator.share({title,url});
  else if (navigator.clipboard) await navigator.clipboard.writeText(url);
  else window.prompt('Copy this link',url);
}
