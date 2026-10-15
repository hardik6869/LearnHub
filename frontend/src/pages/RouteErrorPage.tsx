import { isRouteErrorResponse, useRouteError } from "react-router";
import { Container, ErrorState } from "@/components/common";
import { useDocumentTitle } from "@/hooks";
import { NotFoundPage } from "./NotFoundPage";

// Router error boundary: unmatched loaders/404s and errors thrown while rendering a page
export function RouteErrorPage() {
  const error = useRouteError();
  useDocumentTitle("Error");

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  if (import.meta.env.DEV) {
    console.error(error);
  }

  return (
    <Container className="py-16">
      <ErrorState
        message="An unexpected error occurred. Reload the page to try again."
        onRetry={() => {
          window.location.reload();
        }}
      />
    </Container>
  );
}
