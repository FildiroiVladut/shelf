import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ShelvesProvider } from "../shelves/ShelvesProvider.tsx";
import { loadShelves, saveShelves } from "../shelves/storage.ts";
import { makeBook } from "../test/makeBook.ts";
import { SearchPage } from "./SearchPage.tsx";

function renderPage() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <ShelvesProvider>
          <SearchPage />
        </ShelvesProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("SearchPage as home page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Vitest globals are off, so Testing Library cannot register this itself.
  afterEach(() => {
    cleanup();
  });

  it("welcomes a visitor with empty shelves", () => {
    renderPage();

    expect(
      screen.queryByRole("heading", { level: 1, name: /let's fix that/i }),
    ).not.toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Three steps. No homework." }),
    ).not.toBeNull();
  });

  it("moves a book from the nightstand to the finished pile", async () => {
    const user = userEvent.setup();
    saveShelves([
      makeBook({
        title: "Piranesi",
        authors: ["Susanna Clarke"],
        shelf: "reading",
        finishedAt: null,
        rating: null,
      }),
    ]);
    renderPage();

    expect(
      screen.queryByRole("heading", { name: "Fresh off the pile" }),
    ).toBeNull();

    await user.click(screen.getByRole("button", { name: "Finished it!" }));

    expect(
      screen.queryByRole("heading", { name: "Fresh off the pile" }),
    ).not.toBeNull();
    expect(screen.queryByRole("link", { name: "Piranesi" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Finished it!" })).toBeNull();
    expect(loadShelves()[0]?.shelf).toBe("read");
  });
});
