import { useParams } from "react-router";

export function BookPage() {
  const { id } = useParams();

  return <h1 className="text-2xl font-bold">Book {id}</h1>;
}
