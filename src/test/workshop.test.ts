import { describe, expect, it } from 'vitest';
import { dayHasCapacity, dispatchError, scheduleError, WORKSHOP_CAPACITY } from '../../supabase/functions/_shared/workshop';
describe('workshop scheduling', () => {
  it('allows one active build per day, not two', () => {
    expect(WORKSHOP_CAPACITY).toBe(1);
    expect(dayHasCapacity([], '2026-10-23')).toBe(true);
    expect(dayHasCapacity([{id:'a',stage:'parts_ordered',scheduled_build_date:'2026-10-23'}], '2026-10-23')).toBe(false);
  });
  it('permits retaining your own slot and releases completed slots', () => {
    const order = {id:'a',stage:'parts_ordered',scheduled_build_date:'2026-10-23'};
    expect(dayHasCapacity([order], '2026-10-23', 'a')).toBe(true);
    expect(dayHasCapacity([{...order,stage:'completed'}], '2026-10-23')).toBe(true);
  });
  it('rejects shipping before assembly', () => {
    expect(scheduleError('2026-10-23','2026-10-22')).toBe('Ship date must be on or after the build date.');
    expect(scheduleError('2026-10-23','2026-10-24')).toBeNull();
  });
  it('rejects impossible dates', () => {
    expect(scheduleError('2026-02-30',null)).toBe('Enter a valid calendar date.');
  });
  it('requires carrier and tracking to dispatch shipping orders', () => {
    expect(dispatchError('shipped','us_shipping',null,'ups')).toBe('Save a carrier tracking number before marking this shipping order dispatched.');
    expect(dispatchError('shipped','us_shipping','1Z9999999999999999',null)).not.toBeNull();
    expect(dispatchError('shipped','us_shipping','1Z9999999999999999','ups')).toBeNull();
    expect(dispatchError('shipped','local_pickup',null,null)).toBeNull();
  });
});