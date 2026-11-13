import { z } from "zod";
import { ShelfBookSchema, type ShelfBook } from "./schema.ts";

const STORAGE_KEY = "shelf:v1";
const CORRUPT_KEY = "shelf:v1:corrupt";

// Books are validated one by one below, so a single broken entry
// doesn't wipe the whole library.
const StoredShelvesSchema = z.object({
  version: z.literal(1),
  books: z.array(z.unknown()),
});

export function loadShelves(): ShelfBook[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (raw === null) {
    return [];
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    backUpCorrupt(raw);
    return [];
  }

  const stored = StoredShelvesSchema.safeParse(json);
  if (!stored.success) {
    backUpCorrupt(raw);
    return [];
  }

  const books: ShelfBook[] = [];
  for (const item of stored.data.books) {
    const parsed = ShelfBookSchema.safeParse(item);
    if (parsed.success) {
      books.push(parsed.data);
    }
  }
  if (books.length < stored.data.books.length) {
    backUpCorrupt(raw);
  }
  return books;
}

export function saveShelves(books: ShelfBook[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, books }));
  } catch {
    // Storage is full or blocked: shelves keep working in memory
    // for this session.
  }
}

// Keeps the original text so nothing is lost before the next save
// overwrites it.
function backUpCorrupt(raw: string): void {
  try {
    localStorage.setItem(CORRUPT_KEY, raw);
  } catch {
    // Nothing more can be done if storage is unavailable.
  }
}
