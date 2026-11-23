import type { MonthCount } from "./stats.ts";

const MIDDLEMARCH_PAGES = 880;

export function yearQuip(booksThisYear: number): string {
  if (booksThisYear === 0) {
    return "The year's not over yet.";
  }
  if (booksThisYear === 1) {
    return "One down. Plenty more where that came from.";
  }
  return "Look at you go.";
}

export function ratingQuip(average: number): string {
  if (average >= 4) {
    return "Generous, but fair.";
  }
  if (average >= 3) {
    return "Hard to impress.";
  }
  return "Tough crowd.";
}

export function pagesQuip(pages: number): string {
  const middlemarches = Math.round(pages / MIDDLEMARCH_PAGES);
  if (middlemarches === 0) {
    return "Every page counts.";
  }
  if (middlemarches === 1) {
    return "About one Middlemarch. Respect.";
  }
  return `About ${middlemarches} Middlemarches. Respect.`;
}

// The current month is skipped: it can still pick up.
export function firstQuietMonth(months: MonthCount[]): string | null {
  const past = months.slice(0, -1);
  return past.find((m) => m.count === 0)?.month ?? null;
}
