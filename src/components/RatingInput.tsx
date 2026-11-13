import type { Rating } from "../shelves/schema.ts";

const RATINGS: Rating[] = [1, 2, 3, 4, 5];

type RatingInputProps = {
  value: Rating | null;
  onChange: (rating: Rating | null) => void;
};

export function RatingInput({ value, onChange }: RatingInputProps) {
  return (
    <div role="group" aria-label="Rating" className="flex">
      {RATINGS.map((rating) => {
        const filled = value !== null && rating <= value;
        return (
          <button
            key={rating}
            type="button"
            aria-label={`${rating} out of 5 stars`}
            aria-pressed={value === rating}
            // Clicking the current rating clears it.
            onClick={() => onChange(value === rating ? null : rating)}
            className={`px-0.5 text-2xl leading-none hover:text-amber-400 ${
              filled ? "text-amber-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
