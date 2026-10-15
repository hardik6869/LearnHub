import { Container } from "./Container";
import { LoadingState } from "./LoadingState";

// Full-page placeholder: the router's HydrateFallback while the first lazy page loads (and, later,
// route guards while the current user is being checked)
export function PageLoading() {
  return (
    <Container className="py-8">
      <LoadingState variant="list" label="Loading page…" />
    </Container>
  );
}
