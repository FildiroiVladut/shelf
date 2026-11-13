import { createContext } from "react";
import type { ShelfBook, ShelfId } from "./schema.ts";

export type BookSnapshot = Pick<
  ShelfBook,
  "workId" | "title" | "authors" | "coverId" | "year" | "pages"
>;

export type ShelvesContextValue = {
  books: ShelfBook[];
  addBook: (book: BookSnapshot, shelf: ShelfId) => void;
  moveBook: (workId: string, shelf: ShelfId) => void;
  removeBook: (workId: string) => void;
};

export const ShelvesContext = createContext<ShelvesContextValue | null>(null);
