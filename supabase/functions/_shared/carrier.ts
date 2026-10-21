export type Carrier = 'ups' | 'fedex' | 'usps';
export const CARRIER_NAME: Record<Carrier, string> = { ups: 'UPS', fedex: 'FedEx', usps: 'USPS' };

export function normalizeTracking(raw: string): string {
  return raw.replace(/[\s-]/g, '').toUpperCase();
}

/** Guess the carrier from a tracking number's format. Returns null when unsure. */
export function detectCarrier(raw: string): Carrier | null {
  const n = normalizeTracking(raw);
  if (/^1Z[0-9A-Z]{16}$/.test(n)) return 'ups';
  if (/^(94|93|92|95)\d{20}$/.test(n) || /^[A-Z]{2}\d{9}US$/.test(n)) return 'usps';
  if (/^\d{12}$/.test(n) || /^\d{15}$/.test(n)) return 'fedex';
  return null;
}

/** Maps a label-service provider name (e.g. "UPS", "FedEx", "USPS") to our carrier key. */
export function carrierFromProvider(provider: string): Carrier | null {
  const p = provider.toLowerCase();
  if (p.includes('ups') && !p.includes('usps')) return 'ups';
  if (p.includes('fedex')) return 'fedex';
  if (p.includes('usps')) return 'usps';
  return null;
}

export function trackingUrl(carrier: Carrier, raw: string): string {
  const n = encodeURIComponent(normalizeTracking(raw));
  if (carrier === 'ups') return `https://www.ups.com/track?tracknum=${n}`;
  if (carrier === 'fedex') return `https://www.fedex.com/fedextrack/?trknbr=${n}`;
  return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}`;
}
