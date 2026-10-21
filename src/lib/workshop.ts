export { dayHasCapacity, scheduleError, WORKSHOP_CAPACITY } from '../../supabase/functions/_shared/workshop';
export type WorkshopBuild = {
  id: string; build_name: string; stage: string; created_at?: string;
  technician_name?: string; scheduled_build_date?: string | null; planned_ship_date?: string | null;
  workshop_status?: string; internal_note?: string; fulfillment: string | null;
};
export const WORKSHOP_LABELS: Record<string, string> = {
  queued: 'Queued', in_progress: 'In progress', blocked: 'Blocked', ready_to_ship: 'Ready for dispatch', shipped: 'Dispatched',
};
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function addDays(date: string, days: number): string {
  const result = new Date(`${date}T12:00:00`); result.setDate(result.getDate()+days); return localDate(result);
}