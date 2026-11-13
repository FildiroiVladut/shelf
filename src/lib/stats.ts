import type { ShelfBook } from "../shelves/schema.ts";

export type MonthCount = { month: string; count: number };
export type AuthorCount = { author: string; count: number };
export type PageTotal = { pages: number; booksWithoutPages: number };

export function booksOnRead(books: ShelfBook[]): ShelfBook[] {
  return books.filter((b) => b.shelf === "read");
}

// Local time on purpose: a book finished just after midnight on the 1st
// belongs to the month the reader saw on their calendar.
function monthKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

export function booksReadPerMonth(
  books: ShelfBook[],
  now: Date,
  months = 12,
): MonthCount[] {
  // Pre-filled so months with no finished books still show up as 0,
  // in chronological order (a Map keeps insertion order).
  const counts = new Map<string, number>();
  for (let i = months - 1; i >= 0; i--) {
    counts.set(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)), 0);
  }

  for (const book of booksOnRead(books)) {
    if (book.finishedAt === null) {
      continue;
    }
    const key = monthKey(new Date(book.finishedAt));
    const count = counts.get(key);
    if (count !== undefined) {
      counts.set(key, count + 1);
    }
  }

  return [...counts].map(([month, count]) => ({ month, count }));
}

export function averageRating(books: ShelfBook[]): number | null {
  let sum = 0;
  let rated = 0;
  for (const book of booksOnRead(books)) {
    if (book.rating !== null) {
      sum += book.rating;
      rated++;
    }
  }
  return rated === 0 ? null : sum / rated;
}

export function topAuthors(books: ShelfBook[], limit = 5): AuthorCount[] {
  const counts = new Map<string, number>();
  for (const book of booksOnRead(books)) {
    for (const author of book.authors) {
      counts.set(author, (counts.get(author) ?? 0) + 1);
    }
  }

  return [...counts]
    .map(([author, count]) => ({ author, count }))
    .toSorted((a, b) => b.count - a.count || a.author.localeCompare(b.author))
    .slice(0, limit);
}

export function totalPages(books: ShelfBook[]): PageTotal {
  let pages = 0;
  let booksWithoutPages = 0;
  for (const book of booksOnRead(books)) {
    if (book.pages === null) {
      booksWithoutPages++;
    } else {
      pages += book.pages;
    }
  }
  return { pages, booksWithoutPages };
}
