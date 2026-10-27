import { describe, it, expect } from 'vitest';
import { estimatedShipWindow, FPS_PRESETS, grossProfit, simulatedFps } from '../lib/operations';
describe('workshop operations', () => {
  it('supports the three requested simulation presets', () => {
    expect(FPS_PRESETS).toEqual(['1080p Ultra', '1440p High', '4K Max']);
    expect(simulatedFps(100, '1440p', 0, 'Rust')).toBeGreaterThan(simulatedFps(100, '1440p', 2, 'Rust') ?? 0);
  });
  it('keeps Elden Ring at its 60 FPS cap', () => { expect(simulatedFps(60, '4K', 0, 'Elden Ring')).toBe(60); });
  it('calculates gross margin from recorded costs, not customer part prices', () => {
    expect(grossProfit(1000, 600, 100, 25, 25)).toEqual({ revenue: 1000, cost: 750, dollars: 250, percent: 25 });
    expect(grossProfit(1000, null, 0, 0, 0)).toBeNull();
    expect(grossProfit(1000, 600, 0, 0, 0, true)).toBeNull();
  });
  it('uses the existing one to two week build window in Monterey time', () => {
    expect(estimatedShipWindow(new Date('2026-10-27T16:24:00Z'))).toBe('Nov 3 - Nov 10');
  });
});