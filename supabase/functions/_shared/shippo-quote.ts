// Live Shippo shipping price for a destination ZIP. Falls back to the zone table if Shippo fails.
import { shippingZoneForZip } from "./shipping.ts";

const GATEWAY = "https://connector-gateway.lovable.dev/udc_shippo";
// Typical boxed desktop: 26 x 24 x 14 in, 35 lb.
const PARCEL = { length: 26, width: 24, height: 14, weight: 35, distance_unit: "in", mass_unit: "lb" };
const FROM = { name: "Monterey Bay PCs", city: "Monterey", state: "CA", zip: "93940", country: "US" };
const cache = new Map<string, { price: number; label: string; at: number }>();

export type ShipQuote = { price: number; label: string; live: boolean };

async function cityForZip(zip: string): Promise<{ city: string; state: string } | null> {
  try {
    const r = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!r.ok) return null;
    const d = await r.json();
    const p = d.places?.[0];
    return p ? { city: p["place name"], state: p["state abbreviation"] } : null;
  } catch {
    return null;
  }
}

export async function shippingQuoteForZip(zip: string): Promise<ShipQuote | null> {
  const zone = shippingZoneForZip(zip);
  if (!zone) return null;
  const hit = cache.get(zip);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return { price: hit.price, label: hit.label, live: true };
  try {
    const lovable = Deno.env.get("LOVABLE_API_KEY");
    const key = Deno.env.get("UDC_SHIPPO_API_KEY");
    const place = await cityForZip(zip);
    if (!lovable || !key || !place) throw new Error("unavailable");
    const res = await fetch(`${GATEWAY}/shipments/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        async: false,
        address_from: FROM,
        address_to: { name: "Customer", city: place.city, state: place.state, zip, country: "US" },
        parcels: [PARCEL],
      }),
    });
    if (!res.ok) throw new Error(`Shippo ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    // deno-lint-ignore no-explicit-any
    const amounts = (data.rates ?? []).map((r: any) => ({ amount: Number(r.amount), name: `${r.provider} ${r.servicelevel?.name ?? ""}`.trim() }))
      .filter((r: { amount: number }) => r.amount > 0)
      .sort((a: { amount: number }, b: { amount: number }) => a.amount - b.amount);
    if (!amounts.length) throw new Error("no rates");
    // Cheapest live rate plus $10 for insurance, signature and foam packing, rounded up.
    const price = Math.ceil(amounts[0].amount + 10);
    const label = `${place.city}, ${place.state}`;
    cache.set(zip, { price, label, at: Date.now() });
    return { price, label, live: true };
  } catch (e) {
    console.warn("Live shipping rate unavailable, using zone price:", (e as Error).message);
    return { price: zone.price, label: zone.label, live: false };
  }
}
