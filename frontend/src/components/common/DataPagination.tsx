import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib";
import type { Pagination } from "@/types";

interface DataPaginationProps {
  /** `pagination` from a list response; it only says whether next/prev pages exist */
  pagination: Pagination;
  page: number;
  onPageChange: (page: number) => void;
  /** Disable while the next page is loading */
  disabled?: boolean;
  className?: string;
}

export function DataPagination({
  pagination,
  page,
  onPageChange,
  disabled = false,
  className,
}: DataPaginationProps) {
  const { prev, next } = pagination;
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-4 sm:justify-center", className)}
    >
      <Button
        variant="outline"
        disabled={!prev || disabled}
        onClick={() => {
          if (prev) onPageChange(prev.page);
        }}
      >
        <ChevronLeft aria-hidden />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground" aria-current="page">
        Page {page}
      </span>
      <Button
        variant="outline"
        disabled={!next || disabled}
        onClick={() => {
          if (next) onPageChange(next.page);
        }}
      >
        Next
        <ChevronRight aria-hidden />
      </Button>
    </nav>
  );
}
