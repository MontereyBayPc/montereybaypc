export const TRADE_UP_MONTHS = 24;
export const TRADE_UP_RATE = 0.5;
export function tradeUpDeadline(purchasedAt: string): Date {
  const date = new Date(purchasedAt);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + TRADE_UP_MONTHS);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date;
}
export function tradeUpCredit(resaleValue: number, purchasedAt: string, tradedAt: string): number | null {
  const purchased = new Date(purchasedAt), traded = new Date(tradedAt), deadline = tradeUpDeadline(purchasedAt);
  if (!Number.isFinite(resaleValue) || resaleValue < 0 || !Number.isFinite(purchased.getTime()) || !Number.isFinite(traded.getTime()) || traded < purchased || traded > deadline) return null;
  return Math.round(resaleValue * TRADE_UP_RATE * 100) / 100;
}
export const TRADE_UP_TERMS = [
  'Trade in your complete Monterey Bay PC within 24 months of its original purchase for guaranteed credit equal to 50% of its current resale value toward a brand-new Monterey Bay PC.',
  'Current resale value is the inspected market value of the PC at trade-in, based on its exact components, condition, and comparable used-PC sales. It is not your original purchase price. We provide the valuation and credit in writing before you commit to the new rig.',
  'Include your original Monterey Bay PCs order or receipt with your request. We verify the purchase date and inspect the PC before finalizing its resale value. Standard CPU and GPU trade-ins remain a separate program.',
  'Credit applies toward a new Monterey Bay PC, not a cash payout. Contact us before placing the new order or shipping your trade-in so we can agree the valuation, handoff, and final amount to pay.',
];