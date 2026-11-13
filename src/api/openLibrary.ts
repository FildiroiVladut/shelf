import { z } from "zod";

const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org";

const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "first_publish_year",
  "cover_i",
  "number_of_pages_median",
].join(",");

const SEARCH_LIMIT = 20;

async function fetchJson<T>(
  url: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return schema.parse(await res.json());
}

const SearchDocSchema = z.object({
  key: z.string(),
  title: z.string(),
  author_name: z.array(z.string()).optional(),
  first_publish_year: z.number().optional(),
  cover_i: z.number().optional(),
  number_of_pages_median: z.number().optional(),
});

// Docs are validated one by one in searchBooks, so a single incomplete
// record from the community-edited catalog doesn't fail the whole search.
const SearchResponseSchema = z.object({
  docs: z.array(z.unknown()),
});

export type SearchResult = {
  workId: string;
  title: string;
  authors: string[];
  year: number | null;
  coverId: number | null;
  pages: number | null;
};

function toSearchResult(doc: z.infer<typeof SearchDocSchema>): SearchResult {
  return {
    workId: doc.key.replace("/works/", ""),
    title: doc.title,
    authors: doc.author_name ?? [],
    year: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
    pages: doc.number_of_pages_median ?? null,
  };
}

export async function searchBooks(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    q: query,
    fields: SEARCH_FIELDS,
    limit: String(SEARCH_LIMIT),
  });
  const data = await fetchJson(
    `${BASE_URL}/search.json?${params}`,
    SearchResponseSchema,
    signal,
  );
  const results: SearchResult[] = [];
  for (const doc of data.docs) {
    const parsed = SearchDocSchema.safeParse(doc);
    if (parsed.success) {
      results.push(toSearchResult(parsed.data));
    }
  }
  return results;
}

export function coverUrl(coverId: number, size: "S" | "M" | "L"): string {
  return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}
