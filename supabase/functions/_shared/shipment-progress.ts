export function shipmentStep(status: string, substatus?: string | null): number {
  if (status === 'DELIVERED') return 3;
  if (status === 'TRANSIT' && substatus === 'out_for_delivery') return 2;
  if (status === 'TRANSIT') return 1;
  return 0;
}