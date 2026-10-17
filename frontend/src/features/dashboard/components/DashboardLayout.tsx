import { NavLink, Outlet } from "react-router";
import { Container } from "@/components/common";
import { ROUTES } from "@/constants";
import { hasRole, useCurrentUser } from "@/features/auth";
import { cn } from "@/lib";
import { DASHBOARD_NAV } from "../lib/dashboardNav";

// Layout route for /dashboard/*, behind RequireAuth. Desktop: a sidebar beside the page.
// Phones/tablets: the same links as one row of tabs you swipe sideways, so the page still starts
// high on the screen (-mx/px match Container's padding).
export function DashboardLayout() {
  const { user } = useCurrentUser();
  const items = DASHBOARD_NAV.filter((item) => !item.roles || hasRole(user, item.roles));

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-8">
      <nav aria-label="Dashboard">
        <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:px-0">
          {items.map(({ label, to, icon: Icon }) => (
            <li key={to} className="shrink-0">
              <NavLink
                to={to}
                // Overview only matches /dashboard exactly
                end={to === ROUTES.dashboard}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-muted hover:text-foreground",
                    // Weight and underline as well as colour (WCAG 1.4.1); NavLink sets aria-current
                    isActive
                      ? "bg-accent font-semibold text-accent-foreground underline underline-offset-4 hover:bg-accent hover:text-accent-foreground"
                      : "text-muted-foreground",
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
      <div className="min-w-0 space-y-6">
        <Outlet />
      </div>
    </Container>
  );
}
