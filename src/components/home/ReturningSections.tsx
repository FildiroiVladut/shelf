import { Link } from "react-router";
import {
  firstQuietMonth,
  pagesQuip,
  ratingQuip,
  yearQuip,
} from "../../lib/quips.ts";
import {
  averageRating,
  booksOnRead,
  booksReadPerMonth,
  topAuthors,
  totalPages,
  type MonthCount,
} from "../../lib/stats.ts";
import type { ShelfBook } from "../../shelves/schema.ts";
import { useShelves } from "../../shelves/useShelves.ts";
import { BookCover } from "../BookCover.tsx";

const MAX_READING = 4;
const MAX_RECENT = 5;

const dayMonth = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});
const monthName = new Intl.DateTimeFormat("en-US", { month: "long" });
const monthInitial = new Intl.DateTimeFormat("en-US", { month: "narrow" });

// "2026-04" -> local midnight on Apr 1, matching how stats bucket months.
function monthDate(month: string): Date {
  return new Date(`${month}-01T00:00`);
}

export function ReturningSections() {
  const { books } = useShelves();
  const reading = books
    .filter((b) => b.shelf === "reading")
    .toSorted((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, MAX_READING);
  const recent = booksOnRead(books)
    .filter((b) => b.finishedAt !== null)
    .toSorted((a, b) => (b.finishedAt ?? "").localeCompare(a.finishedAt ?? ""))
    .slice(0, MAX_RECENT);

  return (
    <div className="space-y-16">
      {reading.length > 0 && <ContinueReading books={reading} />}
      {recent.length > 0 && <YearSoFar books={books} />}
      {recent.length > 0 && <RecentlyFinished books={recent} />}
      {reading.length === 0 && recent.length === 0 && (
        <p className="rounded-2xl border-2 border-ink bg-calm p-6 text-lg shadow-pop">
          Your books are waiting on the <strong>Want to read</strong> shelf.
          Start one and it shows up here.{" "}
          <Link to="/shelves" className="font-semibold underline">
            Go to my shelves
          </Link>
        </p>
      )}
    </div>
  );
}

function SectionHeading({
  title,
  link,
}: {
  title: string;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="font-display text-4xl leading-none font-extrabold tracking-tight">
        {title}
      </h2>
      {link !== undefined && (
        <Link to={link.to} className="font-bold text-accent hover:underline">
          {link.label} →
        </Link>
      )}
    </div>
  );
}

function ContinueReading({ books }: { books: ShelfBook[] }) {
  const { moveBook } = useShelves();

  return (
    <section className="space-y-6">
      <SectionHeading
        title="Still on your nightstand"
        link={{ to: "/shelves", label: "All my shelves" }}
      />
      <ul className="grid gap-6 md:grid-cols-2">
        {books.map((book) => (
          <li
            key={book.workId}
            className="flex gap-5 rounded-2xl border-2 border-ink bg-surface p-5 shadow-pop"
          >
            <BookCover
              coverId={book.coverId}
              title={book.title}
              size="M"
              className="h-36 w-24 border-2 border-ink"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <Link
                to={`/book/${book.workId}`}
                className="font-display text-2xl leading-tight font-extrabold hover:underline"
              >
                {book.title}
              </Link>
              <p className="text-muted">
                {book.authors.length > 0
                  ? book.authors.join(", ")
                  : "Unknown author"}
              </p>
              <p className="text-sm text-muted">
                On it since {dayMonth.format(new Date(book.addedAt))}
              </p>
              <button
                type="button"
                onClick={() => moveBook(book.workId, "read")}
                className="mt-auto self-start rounded-full border-2 border-ink bg-highlight px-4 py-2 font-bold shadow-pop-sm hover:translate-x-px hover:translate-y-px hover:shadow-none"
              >
                Finished it!
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function YearSoFar({ books }: { books: ShelfBook[] }) {
  // The only impure input; everything below is computed from it.
  const now = new Date();
  const thisYear = booksReadPerMonth(books, now, now.getMonth() + 1);
  const finishedThisYear = thisYear.reduce((sum, m) => sum + m.count, 0);
  const rating = averageRating(books);
  const pages = totalPages(books).pages;
  const [topAuthor] = topAuthors(books, 1);
  const quietMonth = firstQuietMonth(thisYear);

  return (
    <section className="space-y-6">
      <SectionHeading
        title="Your reading, so far"
        link={{ to: "/stats", label: "All the nerdy stats" }}
      />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-wrap items-end gap-x-12 gap-y-6 rounded-3xl border-2 border-ink bg-ink p-7 text-page shadow-pop-accent md:col-span-3">
          <div className="space-y-2">
            <p className="font-display text-8xl leading-[0.85] font-extrabold tracking-tighter text-highlight tabular-nums">
              {finishedThisYear}
            </p>
            <p className="text-lg font-semibold">
              {finishedThisYear === 1 ? "book" : "books"} finished in{" "}
              {now.getFullYear()}. {yearQuip(finishedThisYear)}
            </p>
          </div>
          <div className="min-w-0 flex-1 basis-80 space-y-2">
            <MonthBars months={thisYear} />
            {quietMonth !== null && (
              <p className="text-sm text-line">
                {monthName.format(monthDate(quietMonth))} was quiet. We don't
                talk about {monthName.format(monthDate(quietMonth))}.
              </p>
            )}
          </div>
        </div>

        {rating !== null && (
          <StatCard
            label="Average rating"
            value={`${rating.toFixed(1)} ★`}
            quip={ratingQuip(rating)}
            className="-rotate-1 bg-surface"
          />
        )}
        <StatCard
          label="Pages turned"
          value={pages.toLocaleString("en-US")}
          quip={pagesQuip(pages)}
          className="rotate-[0.8deg] bg-calm"
        />
        {topAuthor !== undefined && topAuthor.count > 1 && (
          <StatCard
            label="Your top author"
            value={topAuthor.author}
            quip={`${topAuthor.count} books. Should we tell them?`}
            className="-rotate-[0.6deg] bg-highlight"
          />
        )}
      </div>
    </section>
  );
}

function MonthBars({ months }: { months: MonthCount[] }) {
  const max = Math.max(1, ...months.map((m) => m.count));
  const description = months
    .map((m) => `${monthName.format(monthDate(m.month))}: ${m.count}`)
    .join(", ");

  return (
    <figure className="space-y-1">
      <div
        role="img"
        aria-label={`Books finished per month. ${description}`}
        className="flex h-28 items-end gap-2"
      >
        {months.map((m, i) => (
          <div
            key={m.month}
            className={`flex-1 rounded-t ${i % 2 === 0 ? "bg-accent-bright" : "bg-highlight"}`}
            style={{
              height: m.count === 0 ? "3px" : `${(m.count / max) * 100}%`,
            }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="flex gap-2 text-center text-xs text-line"
      >
        {months.map((m) => (
          <span key={m.month} className="flex-1">
            {monthInitial.format(monthDate(m.month))}
          </span>
        ))}
      </div>
    </figure>
  );
}

function StatCard({
  label,
  value,
  quip,
  className,
}: {
  label: string;
  value: string;
  quip: string;
  className: string;
}) {
  return (
    <div
      className={`space-y-1 rounded-2xl border-2 border-ink p-6 shadow-pop ${className}`}
    >
      <p className="text-sm font-semibold">{label}</p>
      <p className="font-display text-4xl leading-tight font-extrabold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-sm">{quip}</p>
    </div>
  );
}

function RecentlyFinished({ books }: { books: ShelfBook[] }) {
  return (
    <section className="space-y-6">
      <SectionHeading title="Fresh off the pile" />
      <ul className="grid grid-cols-2 gap-6 border-b-[10px] border-[#5b4a3a] px-4 pt-4 sm:grid-cols-3 md:grid-cols-5">
        {books.map((book, i) => (
          <li key={book.workId} className="flex flex-col gap-1 pb-4">
            <Link to={`/book/${book.workId}`} className="group space-y-2">
              <BookCover
                coverId={book.coverId}
                title={book.title}
                size="M"
                className={`aspect-2/3 w-full border-2 border-ink shadow-pop-sm ${i % 2 === 0 ? "-rotate-2" : "rotate-2"}`}
              />
              <p className="pt-1 font-bold group-hover:underline">
                {book.title}
              </p>
            </Link>
            <p className="text-sm text-muted">{book.authors[0] ?? ""}</p>
            {book.rating !== null && (
              <p
                aria-label={`Rated ${book.rating} out of 5`}
                className="tracking-wide text-amber-500"
              >
                {"★".repeat(book.rating)}
                <span className="text-line">{"★".repeat(5 - book.rating)}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
