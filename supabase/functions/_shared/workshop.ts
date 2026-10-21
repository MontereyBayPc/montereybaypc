export const WORKSHOP_CAPACITY = 1;
export const WORKSHOP_STATUSES = ['queued', 'in_progress', 'blocked', 'ready_to_ship', 'shipped'] as const;
export type WorkshopStatus = typeof WORKSHOP_STATUSES[number];
export type ScheduledOrder = { id: string; stage: string; scheduled_build_date?: string | null };
export function dispatchError(status: string | undefined, fulfillment: string | null, tracking: string | null, carrier: string | null): string | null {
  return status === 'shipped' && fulfillment === 'us_shipping' && (!tracking?.trim() || !carrier)
    ? 'Save a carrier tracking number before marking this shipping order dispatched.' : null;
}
export function scheduleError(buildDate: string | null, shipDate: string | null): string | null {
  for (const date of [buildDate, shipDate]) {
    if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date)) return 'Enter a valid calendar date.';
  }
  if (buildDate && shipDate && shipDate < buildDate) return 'Ship date must be on or after the build date.';
  return null;
}
export function dayHasCapacity(orders: ScheduledOrder[], date: string, excludeId?: string): boolean {
  return orders.filter(o => o.id !== excludeId && o.stage !== 'completed' && o.scheduled_build_date === date).length < WORKSHOP_CAPACITY;
}