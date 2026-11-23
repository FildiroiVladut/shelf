import { describe, expect, it } from "vitest";
import { firstQuietMonth, pagesQuip, ratingQuip, yearQuip } from "./quips.ts";

describe("yearQuip", () => {
  it("has its own line for zero, one and many books", () => {
    expect(yearQuip(0)).toBe("The year's not over yet.");
    expect(yearQuip(1)).toBe("One down. Plenty more where that came from.");
    expect(yearQuip(14)).toBe("Look at you go.");
  });
});

describe("ratingQuip", () => {
  it("switches at 4 and 3", () => {
    expect(ratingQuip(4)).toBe("Generous, but fair.");
    expect(ratingQuip(3.99)).toBe("Hard to impress.");
    expect(ratingQuip(3)).toBe("Hard to impress.");
    expect(ratingQuip(2.5)).toBe("Tough crowd.");
  });
});

describe("pagesQuip", () => {
  it("rounds to the nearest Middlemarch (880 pages)", () => {
    expect(pagesQuip(0)).toBe("Every page counts.");
    expect(pagesQuip(439)).toBe("Every page counts.");
    expect(pagesQuip(440)).toBe("About one Middlemarch. Respect.");
    expect(pagesQuip(1320)).toBe("About 2 Middlemarches. Respect.");
  });
});

describe("firstQuietMonth", () => {
  it("returns the first past month with no finished books", () => {
    const months = [
      { month: "2026-01", count: 2 },
      { month: "2026-02", count: 0 },
      { month: "2026-03", count: 0 },
      { month: "2026-04", count: 1 },
    ];

    expect(firstQuietMonth(months)).toBe("2026-02");
  });

  it("never picks the current month, which can still pick up", () => {
    const months = [
      { month: "2026-01", count: 1 },
      { month: "2026-02", count: 0 },
    ];

    expect(firstQuietMonth(months)).toBeNull();
    expect(firstQuietMonth([])).toBeNull();
  });
});
