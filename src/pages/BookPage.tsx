import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import {
  fetchBookSummary,
  fetchWork,
  isWorkId,
  type WorkDetails,
} from "../api/openLibrary.ts";
import { BookCover } from "../components/BookCover.tsx";

const MAX_SUBJECTS = 12;

export function BookPage() {
  const { id = "" } = useParams();

  if (!isWorkId(id)) {
    return <BookNotFound />;
  }
  return <BookDetails workId={id} />;
}

function BookDetails({ workId }: { workId: string }) {
  // Both queries start together; the summary decides whether the book
  // exists, the work only fills in the description and subjects.
  const summary = useQuery({
    queryKey: ["book-summary", workId],
    queryFn: ({ signal }) => fetchBookSummary(workId, signal),
  });
  const work = useQuery({
    queryKey: ["work", workId],
    queryFn: ({ signal }) => fetchWork(workId, signal),
  });

  if (summary.isPending) {
    return (
      <p role="status" className="text-gray-600">
        Loading book…
      </p>
    );
  }

  if (summary.isError) {
    return (
      <LoadError
        message="Could not load this book. Check your connection and try again."
        retrying={summary.isFetching}
        onRetry={() => void summary.refetch()}
      />
    );
  }

  if (summary.data === null) {
    return <BookNotFound />;
  }

  const book = summary.data;

  return (
    <article className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <BookCover
          coverId={book.coverId}
          title={book.title}
          size="L"
          className="h-72 w-48"
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-700">
            {book.authors.length > 0
              ? book.authors.join(", ")
              : "Unknown author"}
          </p>
          {book.year !== null && (
            <p className="text-gray-500">First published {book.year}</p>
          )}
        </div>
      </div>
      <WorkSection work={work} />
    </article>
  );
}

function WorkSection({ work }: { work: UseQueryResult<WorkDetails> }) {
  if (work.isPending) {
    return (
      <p role="status" className="text-gray-600">
        Loading description…
      </p>
    );
  }

  if (work.isError) {
    return (
      <LoadError
        message="Could not load the description."
        retrying={work.isFetching}
        onRetry={() => void work.refetch()}
      />
    );
  }

  const { description, subjects } = work.data;

  return (
    <>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Description</h2>
        {description !== null ? (
          <p className="whitespace-pre-line text-gray-800">{description}</p>
        ) : (
          <p className="text-gray-600">No description available.</p>
        )}
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Subjects</h2>
        {subjects.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {subjects.slice(0, MAX_SUBJECTS).map((subject) => (
              <li
                key={subject}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {subject}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No subjects listed.</p>
        )}
      </section>
    </>
  );
}

type LoadErrorProps = {
  message: string;
  retrying: boolean;
  onRetry: () => void;
};

function LoadError({ message, retrying, onRetry }: LoadErrorProps) {
  return (
    <div role="alert" className="space-y-2">
      <p className="text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
      >
        {retrying ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}

function BookNotFound() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Book not found</h1>
      <p className="text-gray-600">
        This book doesn’t exist or has moved.{" "}
        <Link to="/" className="underline">
          Search for another book
        </Link>
        .
      </p>
    </div>
  );
}
