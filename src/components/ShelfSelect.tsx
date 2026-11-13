import type { ChangeEvent } from "react";
import { SHELF_LABELS, ShelfIdSchema } from "../shelves/schema.ts";
import type { BookSnapshot } from "../shelves/ShelvesContext.ts";
import { useShelves } from "../shelves/useShelves.ts";

export function ShelfSelect({ book }: { book: BookSnapshot }) {
  const { books, addBook, moveBook, removeBook } = useShelves();
  const current = books.find((b) => b.workId === book.workId);

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const shelf = ShelfIdSchema.safeParse(e.target.value);
    if (!shelf.success) {
      return;
    }
    if (current === undefined) {
      addBook(book, shelf.data);
    } else {
      moveBook(book.workId, shelf.data);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Shelf"
        value={current?.shelf ?? ""}
        onChange={handleChange}
        className="rounded border border-gray-300 bg-white px-3 py-2 focus:border-gray-500 focus:outline-none"
      >
        {current === undefined && (
          <option value="" disabled>
            Add to shelf…
          </option>
        )}
        {ShelfIdSchema.options.map((id) => (
          <option key={id} value={id}>
            {SHELF_LABELS[id]}
          </option>
        ))}
      </select>
      {current !== undefined && (
        <button
          type="button"
          onClick={() => removeBook(book.workId)}
          className="rounded border border-gray-300 bg-white px-3 py-2 hover:bg-gray-100"
        >
          Remove from shelves
        </button>
      )}
    </div>
  );
}
