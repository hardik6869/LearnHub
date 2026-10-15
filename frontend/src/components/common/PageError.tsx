import { getErrorMessage, type ApiError } from "@/api";
import { Container } from "./Container";
import { ErrorState } from "./ErrorState";

interface PageErrorProps {
  error: ApiError;
  /** Shown as the heading when the API answers 404, e.g. "Academy not found" */
  notFoundTitle?: string;
  onRetry: () => void;
}

// Whole-page error for a failed detail query: 404 → "not found" (retrying won't help),
// anything else → the API's message with a "Try again" button
export function PageError({ error, notFoundTitle = "Not found", onRetry }: PageErrorProps) {
  const isNotFound = error.status === 404;

  return (
    <Container className="py-16">
      <ErrorState
        headingLevel="h1"
        title={isNotFound ? notFoundTitle : undefined}
        message={getErrorMessage(error)}
        onRetry={isNotFound ? undefined : onRetry}
      />
    </Container>
  );
}
