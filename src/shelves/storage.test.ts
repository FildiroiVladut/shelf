import { beforeEach, describe, expect, it } from "vitest";
import { makeBook } from "../test/makeBook.ts";
import { loadShelves, saveShelves } from "./storage.ts";

const STORAGE_KEY = "shelf:v1";
const CORRUPT_KEY = "shelf:v1:corrupt";

describe("shelf storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty when nothing is saved", () => {
    expect(loadShelves()).toEqual([]);
  });

  it("loads back what it saved", () => {
    const books = [
      makeBook({ workId: "a" }),
      makeBook({ workId: "b", shelf: "want", finishedAt: null, rating: null }),
    ];

    saveShelves(books);

    expect(loadShelves()).toEqual(books);
  });

  it("backs up text that is not valid JSON and starts empty", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");

    expect(loadShelves()).toEqual([]);
    expect(localStorage.getItem(CORRUPT_KEY)).toBe("{not json");
  });

  it("backs up data saved in an unknown format", () => {
    const raw = JSON.stringify({ version: 2, books: [] });
    localStorage.setItem(STORAGE_KEY, raw);

    expect(loadShelves()).toEqual([]);
    expect(localStorage.getItem(CORRUPT_KEY)).toBe(raw);
  });

  it("drops only the invalid book and keeps the rest", () => {
    const valid = makeBook();
    const raw = JSON.stringify({
      version: 1,
      books: [valid, { ...valid, workId: "broken", rating: 7 }],
    });
    localStorage.setItem(STORAGE_KEY, raw);

    expect(loadShelves()).toEqual([valid]);
    expect(localStorage.getItem(CORRUPT_KEY)).toBe(raw);
  });
});
