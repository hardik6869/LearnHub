import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  to: string;
}

// Header navigation (desktop and mobile menu). Signed-in users have no separate home page: "/"
// takes them to their dashboard, so it replaces Home.
export const GUEST_NAV: readonly NavItem[] = [
  { label: "Home", to: ROUTES.home },
  { label: "Academies", to: ROUTES.academies },
];

export const SIGNED_IN_NAV: readonly NavItem[] = [
  { label: "Dashboard", to: ROUTES.dashboard },
  { label: "Academies", to: ROUTES.academies },
];
