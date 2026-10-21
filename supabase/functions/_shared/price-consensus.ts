// Pure pricing rules for the custom-quote parts list. Shared with tests.

export const TRUSTED_DOMAINS = [
  "amazon.com", "newegg.com", "bestbuy.com", "microcenter.com", "bhphotovideo.com",
  "pcpartpicker.com", "centralcomputer.com", "adorama.com", "walmart.com",
  "corsair.com", "nzxt.com", "lian-li.com", "fractal-design.com", "hyte.com", "noctua.at",
  "bequiet.com", "amd.com", "nvidia.com", "intel.com", "asus.com", "msi.com", "gigabyte.com",
  "phanteks.com", "coolermaster.com", "thermalright.com", "montechpc.com", "crucial.com",
  "samsung.com", "westerndigital.com", "seasonic.com", "gskill.com", "kingston.com",
];

/** Minimum number of different trusted stores that must agree before a price changes. */
export const MIN_SOURCES = 2;
/** Prices must sit within this distance of the group median to count as agreeing. */
export const AGREEMENT = 0.2;
/** A price drop bigger than this needs one extra agreeing store. */
export const BIG_DROP = 0.15;

export function trustedDomain(url?: string): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return TRUSTED_DOMAINS.find((d) => host === d || host.endsWith(`.${d}`)) ?? null;
  } catch {
    return null;
  }
}

const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export type Hit = { price: number; url?: string };
export type Consensus = { price: number; sources: string[] } | { price: null; reason: string };

/**
 * One vote per trusted store (its lowest listed price, which ignores bundles/add-ons),
 * keep stores that agree with each other, then use the HIGHEST agreeing price so a
 * single sale or bad listing can never underprice a part.
 */
export function consensusPrice(hits: Hit[], currentPrice: number): Consensus {
  const perStore = new Map<string, Hit>();
  for (const h of hits) {
    const d = trustedDomain(h.url);
    if (!d || !(h.price > 0)) continue;
    const prev = perStore.get(d);
    if (!prev || h.price < prev.price) perStore.set(d, h);
  }
  const votes = [...perStore.values()];
  if (votes.length < MIN_SOURCES) return { price: null, reason: `only ${votes.length} trusted store(s)` };
  const mid = median(votes.map((v) => v.price));
  const agreeing = votes.filter((v) => Math.abs(v.price - mid) <= mid * AGREEMENT);
  const needed = currentPrice > 0 && mid < currentPrice * (1 - BIG_DROP) ? MIN_SOURCES + 1 : MIN_SOURCES;
  if (agreeing.length < needed) return { price: null, reason: `only ${agreeing.length} stores agree, need ${needed}` };
  const price = Math.ceil(Math.max(...agreeing.map((v) => v.price)));
  return { price, sources: agreeing.map((v) => v.url!) };
}

/** Labor/profit on a custom build: 20% of parts, never less than $75. */
export const BUILD_FEE_PCT = 0.2;
export const MIN_BUILD_FEE = 75;
export const buildFee = (partsTotal: number) => Math.max(MIN_BUILD_FEE, Math.ceil(partsTotal * BUILD_FEE_PCT));
