import {
  BarChart3,
  Building2,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants";
import type { UserRole } from "@/enums";
import { ACADEMY_MANAGER_ROLES, ADMIN_ROLES, REVIEWER_ROLES } from "@/features/auth";

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Shown only to these roles; every signed-in user when omitted */
  roles?: readonly UserRole[];
}

// The dashboard's sidebar (desktop) and tab row (phones). The router guards the same roles.
export const DASHBOARD_NAV: readonly DashboardNavItem[] = [
  { label: "Overview", to: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Analytics", to: ROUTES.dashboardAnalytics, icon: BarChart3 },
  {
    label: "My academies",
    to: ROUTES.dashboardAcademies,
    icon: Building2,
    roles: ACADEMY_MANAGER_ROLES,
  },
  { label: "My reviews", to: ROUTES.dashboardReviews, icon: MessageSquare, roles: REVIEWER_ROLES },
  { label: "Users", to: ROUTES.dashboardUsers, icon: Users, roles: ADMIN_ROLES },
];
