import { describe, expect, it } from "vitest";
import { localNoon, makeBook } from "../test/makeBook.ts";
import {
  averageRating,
  booksReadPerMonth,
  topAuthors,
  totalPages,
} from "./stats.ts";

describe("booksReadPerMonth", () => {
  const now = new Date(2026, 10, 23);

  it("returns every month in the window, oldest first, with zeros", () => {
    expect(booksReadPerMonth([], now, 3)).toEqual([
      { month: "2026-09", count: 0 },
      { month: "2026-10", count: 0 },
      { month: "2026-11", count: 0 },
    ]);
  });

  it("counts only read books finished inside the window", () => {
    const books = [
      makeBook({ workId: "a", finishedAt: localNoon(2026, 10, 2) }),
      makeBook({ workId: "b", finishedAt: localNoon(2026, 10, 20) }),
      makeBook({ workId: "c", finishedAt: localNoon(2026, 9, 1) }),
      makeBook({ workId: "d", finishedAt: localNoon(2025, 0, 1) }),
      makeBook({ workId: "e", finishedAt: null }),
      makeBook({ workId: "f", shelf: "reading", finishedAt: null }),
    ];

    expect(booksReadPerMonth(books, now, 3)).toEqual([
      { month: "2026-09", count: 0 },
      { month: "2026-10", count: 1 },
      { month: "2026-11", count: 2 },
    ]);
  });

  it("crosses the year boundary", () => {
    const january = new Date(2026, 0, 10);
    const books = [makeBook({ finishedAt: localNoon(2025, 11, 31) })];

    expect(booksReadPerMonth(books, january, 2)).toEqual([
      { month: "2025-12", count: 1 },
      { month: "2026-01", count: 0 },
    ]);
  });
});

describe("averageRating", () => {
  it("is null when there is nothing to average", () => {
    expect(averageRating([])).toBeNull();
    expect(averageRating([makeBook({ rating: null })])).toBeNull();
  });

  it("averages rated books on the Read shelf only", () => {
    const books = [
      makeBook({ workId: "a", rating: 5 }),
      makeBook({ workId: "b", rating: 4 }),
      makeBook({ workId: "c", rating: null }),
      makeBook({ workId: "d", shelf: "want", rating: 1 }),
    ];

    expect(averageRating(books)).toBe(4.5);
  });
});

describe("topAuthors", () => {
  it("counts each author of a co-written book", () => {
    const books = [
      makeBook({ workId: "a", authors: ["Neil Gaiman", "Terry Pratchett"] }),
      makeBook({ workId: "b", authors: ["Terry Pratchett"] }),
    ];

    expect(topAuthors(books)).toEqual([
      { author: "Terry Pratchett", count: 2 },
      { author: "Neil Gaiman", count: 1 },
    ]);
  });

  it("breaks ties alphabetically and respects the limit", () => {
    const books = [
      makeBook({ workId: "a", authors: ["Zadie Smith"] }),
      makeBook({ workId: "b", authors: ["Ali Smith"] }),
      makeBook({ workId: "c", authors: ["Mary Shelley"] }),
    ];

    expect(topAuthors(books, 2)).toEqual([
      { author: "Ali Smith", count: 1 },
      { author: "Mary Shelley", count: 1 },
    ]);
  });

  it("ignores books that are not on the Read shelf", () => {
    const books = [makeBook({ shelf: "reading", authors: ["George Eliot"] })];

    expect(topAuthors(books)).toEqual([]);
  });
});

describe("totalPages", () => {
  it("adds known page counts and reports books without one", () => {
    const books = [
      makeBook({ workId: "a", pages: 412 }),
      makeBook({ workId: "b", pages: 300 }),
      makeBook({ workId: "c", pages: null }),
      makeBook({ workId: "d", shelf: "want", pages: 1000 }),
    ];

    expect(totalPages(books)).toEqual({ pages: 712, booksWithoutPages: 1 });
  });
});
