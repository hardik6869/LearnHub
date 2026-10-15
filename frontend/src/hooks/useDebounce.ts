import { useEffect, useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "@/constants";

// Returns `value` once it has stopped changing for `delayMs` (e.g. search inputs)
export function useDebounce<TValue>(value: TValue, delayMs: number = SEARCH_DEBOUNCE_MS): TValue {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delayMs);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debounced;
}
