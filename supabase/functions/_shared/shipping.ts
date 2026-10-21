// Zone-based US shipping from Monterey, CA. Shared by checkout (server) and the site (client).
export type ShippingZone = { key: "west" | "central" | "east" | "ak_hi"; label: string; price: number };

export const SHIPPING_ZONES: Record<ShippingZone["key"], ShippingZone> = {
  west: { key: "west", label: "West Coast", price: 59 },
  central: { key: "central", label: "Mountain & Central", price: 85 },
  east: { key: "east", label: "East Coast & South", price: 115 },
  ak_hi: { key: "ak_hi", label: "Alaska & Hawaii", price: 165 },
};

/** Returns the zone for a 5-digit US ZIP, or null if the ZIP is not valid. */
export function shippingZoneForZip(zip: string): ShippingZone | null {
  if (!/^\d{5}$/.test(zip)) return null;
  const p3 = Number(zip.slice(0, 3));
  if (p3 >= 995 || p3 === 967 || p3 === 968) return SHIPPING_ZONES.ak_hi;
  const d = zip[0];
  if (d === "8" || d === "9") return SHIPPING_ZONES.west;
  if (d === "5" || d === "6" || d === "7") return SHIPPING_ZONES.central;
  return SHIPPING_ZONES.east;
}
