import { describe, it, expect } from 'vitest';
import { tradeUpCredit } from '../lib/trade-up';
describe('Trade-Up Guarantee', () => {
  it('guarantees exactly 50% of current resale value', () => expect(tradeUpCredit(800, '2026-10-22', '2027-10-22')).toBe(400));
  it('includes the 24-month anniversary', () => expect(tradeUpCredit(800, '2026-10-22', '2028-10-22')).toBe(400));
  it('excludes trade-ins after 24 months', () => expect(tradeUpCredit(800, '2026-10-22', '2028-10-23')).toBeNull());
});