export function tradeCredit(category: string, referencePrice: number, condition: 'excellent' | 'good' | 'fair' | 'not-working'): number {
  if (!['cpu','gpu'].includes(category) || !Number.isFinite(referencePrice) || referencePrice <= 0 || condition === 'not-working') return 0;
  const rate = { excellent: 0.45, good: 0.35, fair: 0.25 }[condition];
  return Math.min(Math.floor(referencePrice / 2), Math.floor(referencePrice * rate / 5) * 5);
}