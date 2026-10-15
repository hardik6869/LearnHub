import { NavLink } from "react-router";
import { MAIN_NAV, ROUTES } from "@/constants";
import { cn } from "@/lib";

interface MainNavProps {
  /** "horizontal" in the header, "vertical" in the mobile menu */
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
}

export function MainNav({ orientation = "horizontal", onNavigate, className }: MainNavProps) {
  const vertical = orientation === "vertical";

  return (
    <nav
      aria-label="Main"
      className={cn(vertical ? "flex flex-col gap-1" : "flex gap-1", className)}
    >
      {MAIN_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          // Home only matches "/" exactly; other items also match their child routes
          end={item.to === ROUTES.home}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              // Active link: weight + underline as well as colour (WCAG 1.4.1); NavLink sets aria-current
              isActive
                ? "bg-muted font-semibold text-foreground underline underline-offset-4"
                : "text-muted-foreground",
              vertical && "text-base",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
