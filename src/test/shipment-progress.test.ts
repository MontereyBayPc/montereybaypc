import { describe, it, expect } from 'vitest';
import { shipmentStep } from '../../supabase/functions/_shared/shipment-progress';
describe('carrier-reported package progress', () => {
  it('does not claim transit for a label or unknown scans', () => expect(shipmentStep('PRE_TRANSIT')).toBe(0));
  it('shows transit only from carrier scans', () => expect(shipmentStep('TRANSIT')).toBe(1));
  it('shows out for delivery from the carrier substatus', () => expect(shipmentStep('TRANSIT', 'out_for_delivery')).toBe(2));
  it('shows delivery only on carrier confirmation', () => expect(shipmentStep('DELIVERED')).toBe(3));
});