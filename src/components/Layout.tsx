import { Link, NavLink, Outlet } from "react-router";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "font-semibold text-accent" : "text-muted hover:text-ink";
}

export function Layout() {
  return (
    <div className="min-h-svh bg-page text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-accent">
            Shelf
          </Link>
          <nav className="flex gap-4 text-sm">
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
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
