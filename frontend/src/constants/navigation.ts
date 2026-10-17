import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  to: string;
}

// Main navigation, shared by the desktop header and the mobile menu
export const MAIN_NAV: readonly NavItem[] = [
  { label: "Home", to: ROUTES.home },
  { label: "Academies", to: ROUTES.academies },
];

// Added after MAIN_NAV when signed in. Everything role-specific (users, my academies…) lives in
// the dashboard's own navigation.
export const SIGNED_IN_NAV: readonly NavItem[] = [{ label: "Dashboard", to: ROUTES.dashboard }];
