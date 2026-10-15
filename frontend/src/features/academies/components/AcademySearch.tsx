import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui";
import { useDebounce } from "@/hooks";

interface AcademySearchProps {
  /** The search in the URL */
  value: string;
  onSearch: (value: string) => void;
}

// Searches as the user types, once they pause (debounced), instead of on every key press
export function AcademySearch({ value, onSearch }: AcademySearchProps) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text);

  // The URL changed from outside (Clear filters, back button): show its value
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setText(value);
  }

  useEffect(() => {
    // Only once typing has settled, so an outside reset isn't overwritten by an old term
    const term = debounced.trim();
    if (debounced === text && term !== value) onSearch(term);
  }, [debounced, text, value, onSearch]);

  return (
    <div className="relative flex-1">
      <label htmlFor="academy-search" className="sr-only">
        Search academies by name
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="academy-search"
        type="search"
        placeholder="Search academies by name"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="pl-9"
      />
    </div>
  );
}
