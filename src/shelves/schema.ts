import { z } from "zod";

export const ShelfIdSchema = z.enum(["want", "reading", "read"]);
export type ShelfId = z.infer<typeof ShelfIdSchema>;

export const SHELF_LABELS: Record<ShelfId, string> = {
  want: "Want to read",
  reading: "Reading",
  read: "Read",
};

// Book details are stored as a snapshot taken when the book is added,
// so shelves and stats work without any network request.
export const ShelfBookSchema = z.object({
  workId: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  coverId: z.number().nullable(),
  year: z.number().nullable(),
  pages: z.number().nullable(),
  shelf: ShelfIdSchema,
  addedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
  rating: z.literal([1, 2, 3, 4, 5]).nullable(),
  notes: z.string(),
});
export type ShelfBook = z.infer<typeof ShelfBookSchema>;
