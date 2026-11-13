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

const WORK_ID_PATTERN = /^OL\d+W$/;

// The id comes from the URL and ends up inside a search query,
// so anything that isn't a work id is rejected before any request.
export function isWorkId(value: string): boolean {
  return WORK_ID_PATTERN.test(value);
}

// Returns null for unknown ids and redirected works: both come back
// from search with no matching doc.
export async function fetchBookSummary(
  workId: string,
  signal?: AbortSignal,
): Promise<SearchResult | null> {
  const results = await searchBooks(`key:/works/${workId}`, signal);
  return results[0] ?? null;
}

const WorkSchema = z.object({
  description: z
    .union([z.string(), z.object({ value: z.string() })])
    .optional()
    .transform((description) => {
      if (description === undefined) return null;
      return typeof description === "string" ? description : description.value;
    }),
  subjects: z.array(z.string()).optional(),
});

export type WorkDetails = {
  description: string | null;
  subjects: string[];
};

export async function fetchWork(
  workId: string,
  signal?: AbortSignal,
): Promise<WorkDetails> {
  const work = await fetchJson(
    `${BASE_URL}/works/${workId}.json`,
    WorkSchema,
    signal,
  );
  // Machine tags such as "nyt:trade-fiction-paperback=2021-11-07"
  // are not meant for readers.
  const subjects = (work.subjects ?? []).filter((s) => !s.includes(":"));
  return {
    description: work.description,
    subjects: [...new Set(subjects)],
  };
}

export function coverUrl(coverId: number, size: "S" | "M" | "L"): string {
  return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}
