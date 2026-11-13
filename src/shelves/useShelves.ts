import { useContext } from "react";
import { ShelvesContext, type ShelvesContextValue } from "./ShelvesContext.ts";

export function useShelves(): ShelvesContextValue {
  const value = useContext(ShelvesContext);
  if (value === null) {
    throw new Error("useShelves must be used inside ShelvesProvider");
  }
  return value;
}
