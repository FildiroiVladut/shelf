# Shelf

Search books, put them on shelves, and see what you've read.

**Status:** in development. Live demo coming soon.

## What it does

- Search the Open Library catalogue as you type, with covers, authors and publication years.
- Open any book to see its cover, description and subjects.
- Organise books on three shelves: Want to read, Reading, Read.
- Rate the books you've finished and keep notes on them.
- Filter and sort your shelves by title, date added or rating.
- See your reading stats: books per month, average rating, top authors, total pages.
- Your shelves are saved in the browser. No account needed.

## Tech stack

- **Frontend:** React, TypeScript, Vite
- **Routing and data fetching:** React Router, TanStack Query, zod
- **Styling:** Tailwind CSS
- **Data:** Open Library API, localStorage
- **Deploy:** Vercel

## Getting started

Requires Node.js LTS. No API keys needed.

```bash
git clone https://github.com/FildiroiVladut/shelf.git
cd shelf
npm install
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the code with ESLint |
