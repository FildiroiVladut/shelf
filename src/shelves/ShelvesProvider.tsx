import { useEffect, useState, type ReactNode } from "react";
import { ShelvesContext, type BookSnapshot } from "./ShelvesContext.ts";
import type { ShelfId } from "./schema.ts";
import { loadShelves, saveShelves } from "./storage.ts";

export function ShelvesProvider({ children }: { children: ReactNode }) {
  // Loading in the initializer means the first render already has the
  // saved books, so the save effect below never overwrites them with [].
  const [books, setBooks] = useState(() => loadShelves());

  useEffect(() => {
    saveShelves(books);
  }, [books]);

  function addBook(book: BookSnapshot, shelf: ShelfId) {
    const now = new Date().toISOString();
    setBooks((prev) => {
      if (prev.some((b) => b.workId === book.workId)) {
        return prev;
      }
      return [
        ...prev,
        {
          workId: book.workId,
          title: book.title,
          authors: book.authors,
          coverId: book.coverId,
          year: book.year,
          pages: book.pages,
          shelf,
          addedAt: now,
          finishedAt: shelf === "read" ? now : null,
          rating: null,
          notes: "",
        },
      ];
    });
  }

  function moveBook(workId: string, shelf: ShelfId) {
    const now = new Date().toISOString();
    setBooks((prev) =>
      prev.map((b) => {
        if (b.workId !== workId || b.shelf === shelf) {
          return b;
        }
        if (shelf === "read") {
          return { ...b, shelf, finishedAt: now };
        }
        // Rating only makes sense for finished books; notes are the
        // user's own text, so they are kept.
        return { ...b, shelf, finishedAt: null, rating: null };
      }),
    );
  }

  function removeBook(workId: string) {
    setBooks((prev) => prev.filter((b) => b.workId !== workId));
  }

  return (
    <ShelvesContext value={{ books, addBook, moveBook, removeBook }}>
      {children}
    </ShelvesContext>
  );
}
