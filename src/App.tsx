import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout.tsx";
import { BookPage } from "./pages/BookPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { SearchPage } from "./pages/SearchPage.tsx";
import { ShelvesPage } from "./pages/ShelvesPage.tsx";
import { StatsPage } from "./pages/StatsPage.tsx";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<SearchPage />} />
        <Route path="book/:id" element={<BookPage />} />
        <Route path="shelves" element={<ShelvesPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
