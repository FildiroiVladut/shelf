import { Link, NavLink, Outlet, useLocation } from "react-router";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "rounded-full bg-ink px-4 py-2 text-page"
    : "rounded-full px-4 py-2 hover:bg-page";
}

export function Layout() {
  // The home page lays out wide sections; reading pages keep a narrow column.
  const isHome = useLocation().pathname === "/";

  return (
    <div className="flex min-h-svh flex-col bg-page text-ink">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight"
        >
          <span aria-hidden="true" className="flex h-7 items-end gap-0.5">
            <span className="h-7 w-2 rounded-sm border-2 border-ink bg-accent" />
            <span className="h-5 w-2 -rotate-8 rounded-sm border-2 border-ink bg-highlight" />
            <span className="h-6 w-2 rounded-sm border-2 border-ink bg-shelf-read" />
          </span>
          Shelf
        </Link>
        <nav className="flex gap-1 rounded-full border-2 border-ink bg-surface p-1 text-sm font-semibold shadow-pop-sm">
          <NavLink to="/" end className={navLinkClass}>
            Search
          </NavLink>
          <NavLink to="/shelves" className={navLinkClass}>
            My shelves
          </NavLink>
          <NavLink to="/stats" className={navLinkClass}>
            Stats
          </NavLink>
        </nav>
      </header>
      <main
        className={`mx-auto w-full flex-1 px-4 py-6 ${isHome ? "max-w-6xl" : "max-w-3xl"}`}
      >
        <Outlet />
      </main>
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-x-6 gap-y-2 border-t-2 border-ink px-4 py-6 text-sm text-muted">
        <p>
          Book data from{" "}
          <a
            href="https://openlibrary.org"
            className="underline hover:text-ink"
          >
            Open Library
          </a>
          . Your shelves never leave this browser.
        </p>
        <a
          href="https://github.com/FildiroiVladut/shelf"
          className="underline hover:text-ink"
        >
          Peek at the code on GitHub
        </a>
      </footer>
    </div>
  );
}
