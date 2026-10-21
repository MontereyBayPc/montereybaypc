import { describe, expect, it } from "vitest";
import { buildFee, consensusPrice } from "../../supabase/functions/_shared/price-consensus";

describe("part price checks", () => {
  it("does not change price with only one trusted store", () => {
    expect(consensusPrice([{ price: 90, url: "https://www.amazon.com/x" }], 100).price).toBeNull();
  });
  it("ignores untrusted deal posts", () => {
    const r = consensusPrice([
      { price: 60, url: "https://reddit.com/r/buildapcsales/1" },
      { price: 100, url: "https://newegg.com/a" },
    ], 100);
    expect(r.price).toBeNull();
  });
  it("uses the highest agreeing store price", () => {
    const r = consensusPrice([
      { price: 95, url: "https://amazon.com/a" },
      { price: 99, url: "https://newegg.com/a" },
      { price: 40, url: "https://bestbuy.com/a" },
    ], 100);
    expect(r.price).toBe(99);
  });
  it("needs three stores to drop price more than 15%", () => {
    const two = [{ price: 80, url: "https://amazon.com/a" }, { price: 80, url: "https://newegg.com/a" }];
    expect(consensusPrice(two, 100).price).toBeNull();
    expect(consensusPrice([...two, { price: 82, url: "https://bestbuy.com/a" }], 100).price).toBe(82);
  });
});

describe("custom build fee", () => {
  it("is never below $75", () => expect(buildFee(200)).toBe(75));
  it("is 20% of parts on bigger builds", () => expect(buildFee(1500)).toBe(300));
});
