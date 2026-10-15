import { Link } from "react-router";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { UserMenu, useCurrentUser } from "@/features/auth";
import { cn } from "@/lib";

interface AuthActionsProps {
  /** Full-width stacked buttons for the mobile menu */
  stacked?: boolean;
  onNavigate?: () => void;
}

// Log in / Sign up when signed out, the user menu when signed in
export function AuthActions({ stacked = false, onNavigate }: AuthActionsProps) {
  const { user, isLoading } = useCurrentUser();

  // Render nothing while the session is checked, so the buttons don't flash
  if (isLoading) return null;
  if (user) return <UserMenu user={user} stacked={stacked} onNavigate={onNavigate} />;

  return (
    <div className={cn("flex gap-2", stacked && "flex-col")}>
      <Button variant="ghost" asChild>
        <Link to={ROUTES.login} onClick={onNavigate}>
          Log in
        </Link>
      </Button>
      <Button asChild>
        <Link to={ROUTES.register} onClick={onNavigate}>
          Sign up
        </Link>
      </Button>
    </div>
  );
}
