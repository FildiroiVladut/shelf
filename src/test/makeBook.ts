import type { ShelfBook } from "../shelves/schema.ts";

export function makeBook(overrides: Partial<ShelfBook> = {}): ShelfBook {
  return {
    workId: "OL893415W",
    title: "Dune",
    authors: ["Frank Herbert"],
    coverId: null,
    year: 1965,
    pages: 412,
    shelf: "read",
    addedAt: "2026-01-10T12:00:00.000Z",
    finishedAt: "2026-02-20T12:00:00.000Z",
    rating: 5,
    notes: "",
    ...overrides,
  };
}

// Noon local time keeps the date in the same calendar month in every time zone.
export function localNoon(year: number, monthIndex: number, day: number) {
  return new Date(year, monthIndex, day, 12).toISOString();
}
