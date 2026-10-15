import { Link } from "react-router";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/lib";

interface AuthActionsProps {
  /** Full-width stacked buttons for the mobile menu */
  stacked?: boolean;
  onNavigate?: () => void;
}

// Signed-out actions; the auth module replaces this with the user menu when logged in
export function AuthActions({ stacked = false, onNavigate }: AuthActionsProps) {
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
