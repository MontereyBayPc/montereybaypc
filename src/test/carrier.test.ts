import { describe, it, expect } from 'vitest';
import { detectCarrier, trackingUrl } from '../../supabase/functions/_shared/carrier';

describe('carrier detection', () => {
  it('detects UPS', () => expect(detectCarrier('1Z 999 AA1 01 2345 6784')).toBe('ups'));
  it('detects USPS', () => expect(detectCarrier('9400 1000 0000 0000 0000 00')).toBe('usps'));
  it('detects FedEx', () => expect(detectCarrier('123456789012')).toBe('fedex'));
  it('returns null for unknown', () => expect(detectCarrier('abc')).toBeNull());
  it('builds UPS link', () => expect(trackingUrl('ups', '1z999')).toBe('https://www.ups.com/track?tracknum=1Z999'));
});
