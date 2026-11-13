import { createContext } from "react";
import type { Rating, ShelfBook, ShelfId } from "./schema.ts";

export type BookSnapshot = Pick<
  ShelfBook,
  "workId" | "title" | "authors" | "coverId" | "year" | "pages"
>;

export type ShelvesContextValue = {
  books: ShelfBook[];
  addBook: (book: BookSnapshot, shelf: ShelfId) => void;
  moveBook: (workId: string, shelf: ShelfId) => void;
  removeBook: (workId: string) => void;
  setRating: (workId: string, rating: Rating | null) => void;
  setNotes: (workId: string, notes: string) => void;
};

export const ShelvesContext = createContext<ShelvesContextValue | null>(null);
