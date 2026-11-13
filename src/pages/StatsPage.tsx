import { Link } from "react-router";
import {
  averageRating,
  booksOnRead,
  booksReadPerMonth,
  topAuthors,
  totalPages,
  type MonthCount,
} from "../lib/stats.ts";
import { useShelves } from "../shelves/useShelves.ts";

const shortMonth = new Intl.DateTimeFormat("en-US", { month: "short" });
const longMonth = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

// "2026-11" -> local midnight on Nov 1, matching how months are bucketed.
function monthDate(month: string): Date {
  return new Date(`${month}-01T00:00`);
}

function bookCount(count: number): string {
  return `${count} ${count === 1 ? "book" : "books"}`;
}

export function StatsPage() {
  const { books } = useShelves();
  const read = booksOnRead(books);

  if (read.length === 0) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Stats</h1>
        <p className="text-gray-600">
          Finish a book to see your stats.{" "}
          <Link to="/shelves" className="underline">
            Go to my shelves
          </Link>
          .
        </p>
      </div>
    );
  }

  // The only impure input lives here, in the component; the stats
  // functions receive "now" as a plain argument.
  const perMonth = booksReadPerMonth(books, new Date());
  const rating = averageRating(books);
  const pages = totalPages(books);
  const authors = topAuthors(books);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Stats</h1>

      <dl className="grid gap-3 sm:grid-cols-3">
        <StatTile label="Books read" value={String(read.length)} />
        <StatTile
          label="Average rating"
          value={rating === null ? "–" : rating.toFixed(1)}
          note={rating === null ? "No ratings yet" : "out of 5"}
        />
        <StatTile
          label="Pages read"
          value={pages.pages.toLocaleString("en-US")}
          note={
            pages.booksWithoutPages > 0
              ? `${bookCount(pages.booksWithoutPages)} without page count`
              : undefined
          }
        />
      </dl>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Books read per month</h2>
        <MonthlyChart data={perMonth} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Top authors</h2>
        {authors.length > 0 ? (
          <ol className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
            {authors.map(({ author, count }) => (
              <li key={author} className="flex justify-between gap-3 px-3 py-2">
                <span className="min-w-0 truncate">{author}</span>
                <span className="shrink-0 text-gray-600">
                  {bookCount(count)}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-600">No author data for your read books.</p>
        )}
      </section>
    </div>
  );
}

type StatTileProps = {
  label: string;
  value: string;
  note?: string;
};

function StatTile({ label, value, note }: StatTileProps) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className="text-3xl font-semibold">{value}</dd>
      {note !== undefined && <dd className="text-sm text-gray-500">{note}</dd>}
    </div>
  );
}

function MonthlyChart({ data }: { data: MonthCount[] }) {
  const max = Math.max(...data.map((d) => d.count));

  return (
    <figure className="space-y-3">
      {/* The bars are a visual summary; the table below carries the values. */}
      <div aria-hidden="true">
        <div className="flex h-40 items-end gap-0.5 border-b border-gray-200">
          {data.map((d) => (
            <div
              key={d.month}
              className="group relative flex h-full flex-1 items-end justify-center"
            >
              {d.count > 0 && (
                <div
                  className="w-full max-w-6 rounded-t bg-[#2a78d6] group-hover:bg-[#3987e5]"
                  style={{ height: `${(d.count / max) * 100}%` }}
                />
              )}
              <span className="pointer-events-none absolute top-0 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
                <strong>{bookCount(d.count)}</strong>{" "}
                {longMonth.format(monthDate(d.month))}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-0.5">
          {data.map((d) => (
            <span
              key={d.month}
              className="flex-1 text-center text-[11px] text-gray-500"
            >
              {shortMonth.format(monthDate(d.month))}
            </span>
          ))}
        </div>
      </div>

      {max === 0 && (
        <p className="text-gray-600">
          No books finished in the last 12 months.
        </p>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer text-gray-600">
          Show as table
        </summary>
        <table className="mt-2 w-full max-w-xs">
          <caption className="sr-only">Books read per month</caption>
          <thead>
            <tr className="text-left text-gray-600">
              <th scope="col" className="py-1 font-normal">
                Month
              </th>
              <th scope="col" className="py-1 text-right font-normal">
                Books
              </th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {data.map((d) => (
              <tr key={d.month} className="border-t border-gray-200">
                <td className="py-1">{longMonth.format(monthDate(d.month))}</td>
                <td className="py-1 text-right">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
