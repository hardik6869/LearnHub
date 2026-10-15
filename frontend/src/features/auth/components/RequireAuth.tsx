import { ShieldX } from "lucide-react";
import { Link, Navigate, Outlet, useLocation } from "react-router";
import { Container, EmptyState, PageLoading } from "@/components/common";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import type { UserRole } from "@/enums";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { hasRole } from "../lib/permissions";

interface RequireAuthProps {
  /** Omit to allow any signed-in user */
  roles?: readonly UserRole[];
}

// Layout route for protected pages: { element: <RequireAuth roles={…} />, children: [...] }.
// Signed-out visitors go to the login page and come back here afterwards.
export function RequireAuth({ roles }: RequireAuthProps) {
  const { user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) return <PageLoading />;

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?redirect=${redirect}`} replace />;
  }

  if (roles && !hasRole(user, roles)) {
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

  return <Outlet />;
}
