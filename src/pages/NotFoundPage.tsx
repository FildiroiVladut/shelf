import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="text-accent underline">
        Back to search
      </Link>
    </div>
  );
}
