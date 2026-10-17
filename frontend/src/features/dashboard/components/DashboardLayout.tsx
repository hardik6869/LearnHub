import { NavLink, Outlet } from "react-router";
import { Container } from "@/components/common";
import { ROUTES } from "@/constants";
import { hasRole, useCurrentUser } from "@/features/auth";
import { cn } from "@/lib";
import { DASHBOARD_NAV } from "../lib/dashboardNav";

// Layout route for /dashboard/*, behind RequireAuth: one row of tabs, then the page. On phones
// the row scrolls sideways (-mx/px match Container's padding).
export function DashboardLayout() {
  const { user } = useCurrentUser();
  const items = DASHBOARD_NAV.filter((item) => !item.roles || hasRole(user, item.roles));

  return (
    <Container className="space-y-6 py-6">
      <nav aria-label="Dashboard" className="border-b">
        {/* overflow-y-hidden: a sideways-scrolling row would otherwise also scroll vertically */}
        <ul className="-mx-4 flex gap-1 overflow-x-auto overflow-y-hidden px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {items.map(({ label, to, icon: Icon }) => (
            <li key={to} className="shrink-0">
              <NavLink
                to={to}
                // Overview only matches /dashboard exactly
                end={to === ROUTES.dashboard}
                className={({ isActive }) =>
                  cn(
                    // The focus ring is inset so the row's overflow doesn't clip it
                    "flex items-center gap-2 rounded-t-md border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    // A thick underline and weight as well as colour (WCAG 1.4.1); NavLink sets
                    // aria-current
                    isActive
                      ? "border-primary font-semibold text-primary hover:text-primary"
                      : "border-transparent text-muted-foreground",
                  )
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </Container>
  );
}
