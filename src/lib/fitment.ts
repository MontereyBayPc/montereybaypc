export type CaseFit = { maxAirHeight: number; radiators?: number[]; source: string };
export type CoolerFit = { height?: number; ramClearance?: number; source: string };
const cases: Record<string, CaseFit> = {
  'corsair frame 4000d': { maxAirHeight: 170, source: 'https://www.corsair.com/us/en/explorer/diy-builder/cases/frame-4000d-series-everything-you-need-to-know/' },
};
const coolers: Record<string, CoolerFit> = {
  'noctua nh-d15': { height: 168, ramClearance: 32, source: 'https://www.noctua.at/en/products/nh-d15/specifications' },
  'noctua nh-u12s': { height: 158, source: 'https://www.noctua.at/en/products/nh-u12s/specifications' },
};
export function clearanceIssue(caseSpec: CaseFit, coolerSpec: CoolerFit, ramHeight?: number): string | null {
  const raisedFan = ramHeight && coolerSpec.ramClearance ? Math.max(0, ramHeight - coolerSpec.ramClearance) : 0;
  if (coolerSpec.height && coolerSpec.height + raisedFan > caseSpec.maxAirHeight) return `Cooler needs ${coolerSpec.height + raisedFan}mm clearance; the case allows ${caseSpec.maxAirHeight}mm.`;
  return null;
}
export function radiatorIssue(supported: number[], requested: number): string | null {
  return supported.includes(requested) ? null : `${requested}mm radiator does not fit the verified mounting positions.`;
}
export function checkFitment(caseName?: string, coolerName?: string) {
  if (!caseName || !coolerName) return { issue: null, note: null };
  const chassis = cases[caseName.toLowerCase()], cooler = coolers[coolerName.toLowerCase()];
  const radiator = coolerName.match(/\b(120|140|240|280|360|420)mm\b/i);
  if (chassis && radiator && chassis.radiators) return { issue: radiatorIssue(chassis.radiators, Number(radiator[1])), note: 'Radiator thickness, motherboard and RAM clearance still require technician confirmation.' };
  if (chassis && cooler) return { issue: clearanceIssue(chassis, cooler), note: cooler.ramClearance ? `Standard RAM clearance ${cooler.ramClearance}mm. Exact RAM height and any raised-fan configuration require confirmation.` : 'Air-cooler height checked against manufacturer specifications.' };
  return { issue: null, note: 'Physical fit not verified for these exact models. We must confirm cooler height, radiator mounting/thickness and RAM clearance before ordering.' };
}