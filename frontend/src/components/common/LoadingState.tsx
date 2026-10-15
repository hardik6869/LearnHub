import { Skeleton } from "@/components/ui";

interface LoadingStateProps {
  /** "cards" for grids of items, "list" for stacked rows */
  variant?: "cards" | "list";
  count?: number;
  label?: string;
  className?: string;
}

// Skeleton placeholder while data loads; announced once to screen readers
export function LoadingState({
  variant = "cards",
  count = 3,
  label = "Loading…",
  className,
}: LoadingStateProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {variant === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((index) => (
            <div key={index} className="space-y-3 rounded-xl border p-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      )}
    </div>
  );
}
