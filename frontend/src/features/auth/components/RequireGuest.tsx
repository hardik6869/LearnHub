import { Navigate, Outlet, useSearchParams } from "react-router";
import { PageLoading } from "@/components/common";
import { ROUTES } from "@/constants";
import { useCurrentUser } from "../hooks/useCurrentUser";

// Only same-site paths: "//evil.com" or "https://…" would leave the app (open redirect)
const getSafeRedirect = (value: string | null): string =>
  value?.startsWith("/") && !value.startsWith("//") ? value : ROUTES.home;

// Layout route for the login/register/password pages. Once the user is signed in (including
// right after a successful login) it sends them to ?redirect= or the home page.
export function RequireGuest() {
  const { user, isLoading } = useCurrentUser();
  const [searchParams] = useSearchParams();

  if (isLoading) return <PageLoading />;
  if (user) return <Navigate to={getSafeRedirect(searchParams.get("redirect"))} replace />;

  return <Outlet />;
}
