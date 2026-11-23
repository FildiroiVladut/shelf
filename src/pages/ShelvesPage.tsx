import { useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { z } from "zod";
import { BookCover } from "../components/BookCover.tsx";
import { RatingInput } from "../components/RatingInput.tsx";
import { ShelfSelect } from "../components/ShelfSelect.tsx";
import {
  SHELF_LABELS,
  ShelfIdSchema,
  type ShelfBook,
  type ShelfId,
} from "../shelves/schema.ts";
import { useShelves } from "../shelves/useShelves.ts";

type Filter = ShelfId | "all";

const FILTERS: Filter[] = ["all", ...ShelfIdSchema.options];

const SortKeySchema = z.enum(["addedAt", "title", "rating"]);
type SortKey = z.infer<typeof SortKeySchema>;

const SORT_LABELS: Record<SortKey, string> = {
  addedAt: "Date added",
  title: "Title",
  rating: "Rating",
};

function sortBooks(books: ShelfBook[], sortKey: SortKey): ShelfBook[] {
  switch (sortKey) {
    case "addedAt":
      // ISO timestamps in UTC sort chronologically as plain strings.
      return books.toSorted((a, b) => b.addedAt.localeCompare(a.addedAt));
    case "title":
      return books.toSorted((a, b) => a.title.localeCompare(b.title));
    case "rating":
      return books.toSorted(
        (a, b) =>
          (b.rating ?? 0) - (a.rating ?? 0) || a.title.localeCompare(b.title),
      );
  }
}

export function ShelvesPage() {
  const { books } = useShelves();
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("addedAt");

  function handleSortChange(e: ChangeEvent<HTMLSelectElement>) {
    const parsed = SortKeySchema.safeParse(e.target.value);
    if (parsed.success) {
      setSortKey(parsed.data);
    }
  }

  if (books.length === 0) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">My shelves</h1>
        <p className="text-muted">
          Your shelves are empty.{" "}
          <Link to="/" className="underline">
            Search for a book
          </Link>{" "}
          to get started.
        </p>
      </div>
    );
  }

  const visible = sortBooks(
    filter === "all" ? books : books.filter((b) => b.shelf === filter),
    sortKey,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My shelves</h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count =
              f === "all"
                ? books.length
                : books.filter((b) => b.shelf === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className="rounded-full border border-line bg-surface px-3 py-1 text-sm hover:bg-page aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-white"
              >
                {f === "all" ? "All" : SHELF_LABELS[f]} ({count})
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-sm">
          Sort by
          <select
            value={sortKey}
            onChange={handleSortChange}
            className="rounded border border-line bg-surface px-2 py-1 focus:border-accent focus:outline-none"
          >
            {SortKeySchema.options.map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted">Nothing on this shelf yet.</p>
      ) : (
        <ul className="divide-y divide-line rounded border border-line bg-surface">
          {visible.map((book) => (
            <ShelfBookItem key={book.workId} book={book} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ShelfBookItem({ book }: { book: ShelfBook }) {
  const { setRating, setNotes } = useShelves();

  return (
    <li className="flex gap-3 p-3">
      <BookCover
        coverId={book.coverId}
        title={book.title}
        size="M"
        className="h-18 w-12"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <Link
            to={`/book/${book.workId}`}
            className="font-semibold hover:underline"
          >
            {book.title}
          </Link>
          <p className="text-sm text-muted">
            {book.authors.length > 0
              ? book.authors.join(", ")
              : "Unknown author"}
          </p>
        </div>
        <ShelfSelect book={book} />
        {book.shelf === "read" && (
          <>
            <RatingInput
              value={book.rating}
              onChange={(rating) => setRating(book.workId, rating)}
            />
            <label className="block text-sm text-muted">
              Notes
              <textarea
                value={book.notes}
                onChange={(e) => setNotes(book.workId, e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded border border-line bg-surface px-3 py-2 text-base text-ink focus:border-accent focus:outline-none"
              />
            </label>
          </>
        )}
      </div>
    </li>
  );
}
