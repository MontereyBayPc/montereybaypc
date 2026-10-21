import { describe, expect, it } from "vitest";
import { shippingZoneForZip } from "../../supabase/functions/_shared/shipping";

describe("zone shipping by ZIP", () => {
  it("West Coast ZIPs cost $59", () => {
    expect(shippingZoneForZip("93940")?.price).toBe(59);
    expect(shippingZoneForZip("85001")?.price).toBe(59);
  });
  it("Mountain and Central ZIPs cost $85", () => {
    expect(shippingZoneForZip("75201")?.price).toBe(85);
    expect(shippingZoneForZip("60601")?.price).toBe(85);
  });
  it("East Coast and South ZIPs cost $115", () => {
    expect(shippingZoneForZip("10001")?.price).toBe(115);
    expect(shippingZoneForZip("33101")?.price).toBe(115);
  });
  it("Alaska and Hawaii ZIPs cost $165", () => {
    expect(shippingZoneForZip("99501")?.price).toBe(165);
    expect(shippingZoneForZip("96813")?.price).toBe(165);
  });
  it("rejects invalid ZIPs", () => {
    expect(shippingZoneForZip("9394")).toBeNull();
    expect(shippingZoneForZip("abcde")).toBeNull();
  });
});
