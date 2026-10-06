import { describe, it, expect } from "vitest";
import { cpuSocket, boardSocket, boardRam, ramGen, minPsu, systemWatts, psuWatts, formatPhone } from "@/lib/compat";

describe("part compatibility", () => {
  it("AM5 CPU does not match an Intel LGA1700 board", () => {
    expect(cpuSocket("AMD Ryzen 7 7800X3D")).toBe("AM5");
    expect(boardSocket("MSI MAG Z790 Tomahawk WiFi")).toBe("LGA1700");
  });
  it("Ryzen 5000 is AM4 and Core Ultra is LGA1851", () => {
    expect(cpuSocket("AMD Ryzen 7 5800X3D")).toBe("AM4");
    expect(cpuSocket("Intel Core Ultra 7 265K")).toBe("LGA1851");
    expect(cpuSocket("Intel Core i5-12400F")).toBe("LGA1700");
  });
  it("DDR4 is rejected on AM5 boards", () => {
    expect(boardRam("ASUS ROG Strix B650-A")).toBe("DDR5");
    expect(ramGen("16GB (2x8) DDR4-3200")).toBe("DDR4");
    expect(boardRam("MSI B550 Tomahawk")).toBe("DDR4");
  });
  it("PSU minimum adds 30% headroom rounded to 50W", () => {
    const w = systemWatts("AMD Ryzen 9 9950X", "NVIDIA RTX 5090"); // 170+575+100
    expect(w).toBe(845);
    expect(minPsu(w)).toBe(1100);
    expect(psuWatts("Seasonic Focus GX-750")).toBe(750);
  });
  it("formats US phone numbers", () => {
    expect(formatPhone("18317187730")).toBe("(831) 718-7730");
    expect(formatPhone("831718")).toBe("(831) 718");
  });
});
