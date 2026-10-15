import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui";
import { EmptyState } from "./EmptyState";

interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Shows a "Try again" button, e.g. a query's refetch */
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title}
      description={message}
      className={className}
      action={
        onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RotateCw aria-hidden />
            Try again
          </Button>
        )
      }
    />
  );
}
