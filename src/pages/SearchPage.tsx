import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { searchBooks } from "../api/openLibrary.ts";
import { BookCover } from "../components/BookCover.tsx";
import {
  HeroArt,
  NewVisitorSections,
} from "../components/home/NewVisitorHome.tsx";
import { ReturningSections } from "../components/home/ReturningSections.tsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue.ts";
import { SHELF_LABELS, type ShelfId } from "../shelves/schema.ts";
import { useShelves } from "../shelves/useShelves.ts";

// Full class names are spelled out so Tailwind can find them when scanning the source.
// The shelf colors are mid-tones, so they tint the background and the text stays dark for contrast.
const SHELF_BADGE_CLASSES: Record<ShelfId, string> = {
  want: "bg-shelf-want/25",
  reading: "bg-shelf-reading/25",
  read: "bg-shelf-read/25",
};

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

const SUGGESTIONS = ["Dune", "Ursula K. Le Guin", "Jane Austen"];

export function SearchPage() {
  const { books } = useShelves();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS);
  const isReturning = books.length > 0;
  const isSearching = query.trim() !== "";

  return (
    <div className="space-y-16">
      <section className="flex flex-wrap items-center gap-12">
        <div className="min-w-0 flex-[999_1_32rem] space-y-6">
          <p className="inline-block -rotate-2 rounded-full border-2 border-ink bg-calm px-3 py-1 text-xs font-bold tracking-widest uppercase">
            {isReturning
              ? "Welcome back, bookworm"
              : "A book tracker for people who own too many books"}
          </p>
          {isReturning ? (
            <h1 className="font-display text-5xl leading-[0.92] font-extrabold tracking-tighter sm:text-7xl">
              So, what are we <span className="marker px-1">reading next?</span>
            </h1>
          ) : (
            <>
              <h1 className="font-display text-5xl leading-[0.92] font-extrabold tracking-tighter text-balance sm:text-7xl lg:text-8xl">
                Your to-read pile is{" "}
                <span className="marker px-1">out of control.</span>{" "}
                <span className="text-accent">Let's fix that.</span>
              </h1>
              <p className="max-w-xl text-lg text-muted sm:text-xl">
                Find it, shelve it, rate it, brag about it. Shelf keeps score of
                every book you've read, are reading, or swear you'll get to.
              </p>
            </>
          )}
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder={
              isReturning
                ? "Feed the pile…"
                : "Dune? Jane Austen? That one with the blue cover?"
            }
          />
          {!isReturning && !isSearching && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Try:</span>
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full border-2 border-ink bg-surface px-3 py-1 font-semibold hover:bg-highlight"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        {!isReturning && (
          <div className="min-w-0 flex-[1_1_20rem]">
            <HeroArt />
          </div>
        )}
      </section>

      {isSearching ? (
        <div className="max-w-3xl">
          <SearchResults query={debouncedQuery} />
        </div>
      ) : isReturning ? (
        <ReturningSections />
      ) : (
        <NewVisitorSections />
      )}
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex max-w-xl items-center gap-3 rounded-full border-2 border-ink bg-surface py-1 pr-2 pl-5 shadow-pop focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-accent">
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <label htmlFor="search" className="sr-only">
        Search books
      </label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent py-3 text-lg placeholder:text-muted focus:outline-none"
      />
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  const { books } = useShelves();
  const shelfByWorkId = new Map(books.map((b) => [b.workId, b.shelf]));
  const enabled = query.length >= MIN_QUERY_LENGTH;
  const search = useQuery({
    queryKey: ["search", query],
    queryFn: ({ signal }) => searchBooks(query, signal),
    enabled,
  });

  if (!enabled) {
    return (
      <p className="text-muted">
        Type at least {MIN_QUERY_LENGTH} characters to search.
      </p>
    );
  }

  if (search.isPending) {
    return (
      <p role="status" className="text-muted">
        Searching…
      </p>
    );
  }

  if (search.isError) {
    return (
      <div role="alert" className="space-y-2">
        <p className="text-red-700">
          Could not load results. Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => void search.refetch()}
          disabled={search.isFetching}
          className="rounded border border-line bg-surface px-3 py-1 hover:bg-page disabled:opacity-50"
        >
          {search.isFetching ? "Retrying…" : "Try again"}
        </button>
      </div>
    );
  }

  if (search.data.length === 0) {
    return <p className="text-muted">No books found for “{query}”.</p>;
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border-2 border-ink bg-surface shadow-pop">
      {search.data.map((book) => {
        const shelf = shelfByWorkId.get(book.workId);
        return (
          <li key={book.workId}>
            <Link
              to={`/book/${book.workId}`}
              className="flex gap-3 p-3 hover:bg-page"
            >
              <BookCover
                coverId={book.coverId}
                title={book.title}
                size="M"
                className="h-18 w-12"
              />
              <div className="min-w-0">
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-muted">
                  {book.authors.length > 0
                    ? book.authors.join(", ")
                    : "Unknown author"}
                </p>
                {book.year !== null && (
                  <p className="text-sm text-muted">{book.year}</p>
                )}
                {shelf !== undefined && (
                  <p
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs text-ink ${SHELF_BADGE_CLASSES[shelf]}`}
                  >
                    {SHELF_LABELS[shelf]}
                  </p>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
