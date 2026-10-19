import { describe, it, expect } from 'vitest';
import { tradeCredit } from '@/lib/trade-in';
import { clearanceIssue, radiatorIssue } from '@/lib/fitment';
import { UNCOLLECTED_NOTICE_DAYS } from '@/lib/service-agreement';
describe('trade-in rules', () => {
  it('never exceeds half the reference price', () => { expect(tradeCredit('gpu', 400, 'excellent')).toBe(180); expect(tradeCredit('cpu', 101, 'excellent')).toBeLessThanOrEqual(50.5); });
  it('accepts only CPUs and GPUs', () => { expect(tradeCredit('case',400,'excellent')).toBe(0); expect(tradeCredit('cpu',400,'good')).toBe(140); });
  it('does not offer credit for nonworking parts', () => { expect(tradeCredit('gpu',400,'not-working')).toBe(0); });
});
describe('physical fit', () => {
  it('blocks a 360mm radiator where only 240 and 280 fit', () => { expect(radiatorIssue([240,280],360)).toContain('does not fit'); expect(radiatorIssue([240,360],360)).toBeNull(); });
  it('accounts for raised fan height with tall RAM', () => { expect(clearanceIssue({ maxAirHeight:170, source:'' }, {height:168,ramClearance:32,source:''},44)).toContain('180mm'); });
});
it('begins uncollected-property notice at 30 days', () => expect(UNCOLLECTED_NOTICE_DAYS).toBe(30));