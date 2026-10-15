import { ShieldX } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { Container } from "./Container";
import { EmptyState } from "./EmptyState";

// Whole-page state for a signed-in user without the role or ownership a page needs
export function AccessDenied() {
  return (
    <Container className="py-16">
      <EmptyState
        headingLevel="h1"
        icon={ShieldX}
        title="Access denied"
        description="Your account doesn't have permission to view this page."
        action={
          <Button asChild>
            <Link to={ROUTES.home}>Back to home</Link>
          </Button>
        }
      />
    </Container>
  );
}
