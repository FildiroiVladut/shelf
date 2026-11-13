import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { searchBooks } from "../api/openLibrary.ts";
import { BookCover } from "../components/BookCover.tsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue.ts";
import { SHELF_LABELS } from "../shelves/schema.ts";
import { useShelves } from "../shelves/useShelves.ts";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="search" className="block text-2xl font-bold">
          Search books
        </label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Title or author"
          autoComplete="off"
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 focus:border-gray-500 focus:outline-none"
        />
      </div>
      <SearchResults query={debouncedQuery} />
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
      <p className="text-gray-600">
        Type at least {MIN_QUERY_LENGTH} characters to search.
      </p>
    );
  }

  if (search.isPending) {
    return (
      <p role="status" className="text-gray-600">
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
          className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
        >
          {search.isFetching ? "Retrying…" : "Try again"}
        </button>
      </div>
    );
  }

  if (search.data.length === 0) {
    return <p className="text-gray-600">No books found for “{query}”.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
      {search.data.map((book) => {
        const shelf = shelfByWorkId.get(book.workId);
        return (
          <li key={book.workId}>
            <Link
              to={`/book/${book.workId}`}
              className="flex gap-3 p-3 hover:bg-gray-50"
            >
              <BookCover
                coverId={book.coverId}
                title={book.title}
                size="M"
                className="h-18 w-12"
              />
              <div className="min-w-0">
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-gray-600">
                  {book.authors.length > 0
                    ? book.authors.join(", ")
                    : "Unknown author"}
                </p>
                {book.year !== null && (
                  <p className="text-sm text-gray-500">{book.year}</p>
                )}
                {shelf !== undefined && (
                  <p className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
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
