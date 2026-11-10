import { coverUrl } from "../api/openLibrary.ts";

type BookCoverProps = {
  coverId: number | null;
  title: string;
  size: "S" | "M" | "L";
  className: string;
};

export function BookCover({ coverId, title, size, className }: BookCoverProps) {
  if (coverId === null) {
    return (
      <div
        aria-hidden="true"
        className={`${className} shrink-0 rounded bg-gray-200`}
      />
    );
  }

  return (
    <img
      src={coverUrl(coverId, size)}
      alt={`Cover of ${title}`}
      loading="lazy"
      className={`${className} shrink-0 rounded bg-gray-200 object-cover`}
    />
  );
}
