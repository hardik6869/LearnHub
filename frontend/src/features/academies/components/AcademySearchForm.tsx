import { Search } from "lucide-react";
import { type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/constants";

// Home page search: opens the academies list with ?search=… (the list's own search reads it)
export function AcademySearchForm({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const search = text.trim();
    void navigate(
      search
        ? `${ROUTES.academies}?${new URLSearchParams({ search }).toString()}`
        : ROUTES.academies,
    );
  };

  return (
    <search className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="home-search" className="sr-only">
            Search academies by name
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="home-search"
            value={text}
            onChange={(event) => setText(event.target.value)}
            type="search"
            placeholder="Search academies by name"
            className="h-10 bg-background pl-9"
          />
        </div>
        <Button type="submit" size="lg" className="h-10 px-4">
          Search
        </Button>
      </form>
    </search>
  );
}
