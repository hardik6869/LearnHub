import { Navigate, Outlet, useLocation } from "react-router";
import { AccessDenied, PageLoading } from "@/components/common";
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

  if (roles && !hasRole(user, roles)) return <AccessDenied />;

  return <Outlet />;
}
