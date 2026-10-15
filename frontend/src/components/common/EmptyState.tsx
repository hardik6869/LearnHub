import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  /** e.g. a "Clear filters" or "Create" button */
  action?: ReactNode;
  /** "h1" when the state is the whole page (404, error page); "h2" inside a page section */
  headingLevel?: "h1" | "h2";
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  headingLevel: Heading = "h2",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Icon className="size-6 text-muted-foreground" aria-hidden />
        </div>
      )}
      <div className="max-w-sm space-y-1">
        <Heading className="text-lg font-semibold">{title}</Heading>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
