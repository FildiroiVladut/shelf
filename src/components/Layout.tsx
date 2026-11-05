import { Link, NavLink, Outlet } from "react-router";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "font-semibold text-gray-900"
    : "text-gray-600 hover:text-gray-900";
}

export function Layout() {
  return (
    <div className="min-h-svh bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="text-lg font-bold">
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
