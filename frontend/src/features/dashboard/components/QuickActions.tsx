import {
  Building2,
  ChevronRight,
  type LucideIcon,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/constants";
import type { UserRole } from "@/enums";
import { ACADEMY_MANAGER_ROLES, ADMIN_ROLES, REVIEWER_ROLES } from "@/features/auth";
import { cn, TONE_CHIP_CLASSES, type Tone } from "@/lib";

interface QuickAction {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
  tone: Tone;
  /** Shown only to these roles; everyone when omitted */
  roles?: readonly UserRole[];
}

const ACTIONS: readonly QuickAction[] = [
  {
    label: "Manage my academies",
    description: "Add your academy, then its courses and photo.",
    to: ROUTES.dashboardAcademies,
    icon: Building2,
    tone: "primary",
    roles: ACADEMY_MANAGER_ROLES,
  },
  {
    label: "Write a review",
    description: "Open an academy you studied at and share your experience.",
    to: ROUTES.academies,
    icon: MessageSquare,
    tone: "warning",
    roles: REVIEWER_ROLES,
  },
  {
    label: "Browse academies",
    description: "Search and compare by career, cost and rating.",
    to: ROUTES.academies,
    icon: Search,
    tone: "info",
  },
  {
    label: "Manage users",
    description: "Add, edit or remove student and publisher accounts.",
    to: ROUTES.dashboardUsers,
    icon: Users,
    tone: "success",
    roles: ADMIN_ROLES,
  },
];

// "What can I do next?" links for the user's role, at the top of the overview
export function QuickActions({ role }: { role: UserRole }) {
  const actions = ACTIONS.filter((action) => !action.roles || action.roles.includes(role));

  return (
    <section aria-labelledby="quick-actions-heading" className="space-y-3">
      <h2 id="quick-actions-heading" className="text-lg font-semibold">
        Quick actions
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map(({ label, description, to, icon: Icon, tone }) => (
          <li key={label}>
            <Link
              to={to}
              className="group flex h-full items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary hover:bg-accent"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  TONE_CHIP_CLASSES[tone],
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{label}</span>
                <span className="block text-sm text-muted-foreground">{description}</span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
