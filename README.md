# Shelf

[![CI](https://github.com/FildiroiVladut/shelf/actions/workflows/ci.yml/badge.svg)](https://github.com/FildiroiVladut/shelf/actions/workflows/ci.yml)

A reading tracker. Search the Open Library catalogue, sort books onto shelves, rate the ones you finish and see your reading year in numbers.

**Live:** https://shelf-ashen.vercel.app

## Features

- Search as you type, with covers, authors and publication year.
- Book pages with description and subjects.
- Three shelves (Want to read, Reading, Read), with a 1–5 rating and notes for finished books.
- Filter and sort shelves by title, date added or rating.
- Stats: books read per month, average rating, top authors, pages read.
- No account. Everything is stored in the browser.

## Stack

React 19, TypeScript (strict), Vite, React Router, TanStack Query, zod and Tailwind CSS. Tested with Vitest and Testing Library, deployed on Vercel.

## Technical notes

- **No backend.** Shelves are saved in `localStorage` under a versioned key. On load, each book is validated with zod on its own, so a corrupt entry is dropped and the raw data is backed up instead of the whole library being lost.
- **Remote data and local data are handled separately.** Open Library responses go through TanStack Query, which handles caching, cancelling stale requests and retries. Shelves live in a React context backed by `localStorage`.
- **Every API response is validated.** Open Library is inconsistent: `description` is either a string or `{ type, value }`, the works endpoint returns author keys rather than names, and page counts only exist in search results. The API layer turns all of this into one predictable shape before any component sees it.
- **Books are stored as snapshots.** Adding a book copies its title, authors, cover and page count into the shelf entry, so shelves and stats never need a network request.
- **Stats are pure functions.** `src/lib/stats.ts` takes the books and the current date as arguments. The same input always gives the same output, which keeps them easy to test.
- **Search is debounced (300 ms)** and results are cached, to keep the load on a free, non-profit API low.

## Running locally

Requires Node.js 24 (the version CI uses). No API keys needed.

```bash
git clone https://github.com/FildiroiVladut/shelf.git
cd shelf
npm install
npm run dev
```

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the dev server                |
| `npm run build`     | Type-check and build for production |
| `npm run test`      | Run tests in watch mode             |
| `npm run test:run`  | Run tests once                      |
| `npm run lint`      | Lint with ESLint                    |
| `npm run typecheck` | Type-check without building         |
| `npm run format`    | Format with Prettier                |

CI runs lint, formatting, type-check, tests and the build on every pull request.

## Project structure

```
src/
  api/          Open Library client and response schemas
  shelves/      shelf state, schema and localStorage persistence
  lib/          pure functions for stats and their captions
  pages/        one component per route
  components/   shared UI and home page sections
```

## Credits

Book data and covers from [Open Library](https://openlibrary.org).
