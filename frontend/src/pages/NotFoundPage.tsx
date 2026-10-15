import { SearchX } from "lucide-react";
import { Link } from "react-router";
import { Container, EmptyState } from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useDocumentTitle } from "@/hooks";

export function NotFoundPage() {
  useDocumentTitle("Page not found");

  return (
    <Container className="py-16">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="The page you are looking for doesn't exist or has been moved."
        action={
          <Button asChild>
            <Link to={ROUTES.home}>Back to home</Link>
          </Button>
        }
      />
    </Container>
  );
}
