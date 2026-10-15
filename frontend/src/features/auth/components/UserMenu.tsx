import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { ROUTES, type NavItem } from "@/constants";
import { USER_ROLE_LABELS } from "@/enums";
import type { User } from "@/types";
import { useLogout } from "../hooks/useAuthMutations";

interface UserMenuProps {
  user: User;
  /** Full-width stacked links for the mobile menu instead of a dropdown */
  stacked?: boolean;
  onNavigate?: () => void;
}

// Dashboard is in the main nav (MainNav), so it isn't repeated here
const USER_LINKS: readonly NavItem[] = [{ label: "Account", to: ROUTES.account }];

// Signed-in actions: a dropdown in the header, plain links in the mobile menu
export function UserMenu({ user, stacked = false, onNavigate }: UserMenuProps) {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        onNavigate?.();
        void navigate(ROUTES.home);
      },
    });
  };

  if (stacked) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Signed in as {user.name}</p>
        {USER_LINKS.map((link) => (
          <Button key={link.to} variant="outline" asChild>
            <Link to={link.to} onClick={onNavigate}>
              {link.label}
            </Link>
          </Button>
        ))}
        <Button variant="ghost" onClick={handleLogout} disabled={logout.isPending}>
          <LogOut aria-hidden />
          Log out
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <UserRound aria-hidden />
          <span className="max-w-40 truncate">{user.name}</span>
          <ChevronDown aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate font-medium text-foreground">{user.name}</span>
          <span className="block text-muted-foreground">{USER_ROLE_LABELS[user.role]}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {USER_LINKS.map((link) => (
          <DropdownMenuItem key={link.to} asChild>
            <Link to={link.to}>{link.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} disabled={logout.isPending}>
          <LogOut aria-hidden />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
