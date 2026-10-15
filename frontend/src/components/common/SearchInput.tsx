import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib";

interface SearchInputProps {
  id: string;
  /** Accessible name, e.g. "Search academies by name"; also the placeholder unless given */
  label: string;
  placeholder?: string;
  /** The current search (usually from the URL) */
  value: string;
  onSearch: (value: string) => void;
  className?: string;
}

// Searches as the user types, once they pause (debounced), instead of on every key press
export function SearchInput({
  id,
  label,
  placeholder = label,
  value,
  onSearch,
  className,
}: SearchInputProps) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text);

  // The value changed from outside (Clear filters, back button): show it
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
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id={id}
        type="search"
        placeholder={placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="pl-9"
      />
    </div>
  );
}
