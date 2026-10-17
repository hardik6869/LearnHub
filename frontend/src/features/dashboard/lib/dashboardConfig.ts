import {
  BookOpen,
  Building2,
  DollarSign,
  type LucideIcon,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { MINIMUM_SKILL_LABELS, USER_ROLE_LABELS, type UserRole } from "@/enums";
import { formatCurrency, formatMonth, formatNumber, formatRating, type Tone } from "@/lib";
import type { DashboardStats, StatsTotals } from "@/types";

export interface KpiItem {
  key: keyof StatsTotals;
  label: string;
  icon: LucideIcon;
  /** Defaults to "primary" */
  tone?: Tone;
  /** Defaults to a plain number */
  format?: (value: number) => string;
}

export interface ChartItem {
  key: Exclude<keyof DashboardStats, "totals">;
  title: string;
  description: string;
  valueLabel: string;
  /** A --chart-N variable, so each chart has its own colour */
  color: string;
  /** Turns an API label ("2026-05", "beginner") into display text */
  formatLabel?: (label: string) => string;
  horizontal?: boolean;
}

interface RoleDashboard {
  kpis: KpiItem[];
  charts: ChartItem[];
}

const fromLabels =
  (labels: Record<string, string>) =>
  (label: string): string =>
    labels[label] ?? label;

// Building blocks, combined (and relabelled) per role below
const KPIS = {
  users: { key: "users", label: "Users", icon: Users },
  academies: { key: "academies", label: "Academies", icon: Building2 },
  courses: { key: "courses", label: "Courses", icon: BookOpen, tone: "info" },
  reviews: { key: "reviews", label: "Reviews", icon: MessageSquare, tone: "info" },
  averageRating: {
    key: "averageRating",
    label: "Avg. rating",
    icon: Star,
    tone: "warning",
    format: formatRating,
  },
  averageTuition: {
    key: "averageTuition",
    label: "Avg. tuition",
    icon: DollarSign,
    tone: "success",
    format: formatCurrency,
  },
} satisfies Record<string, KpiItem>;

const CHARTS = {
  reviewsByMonth: {
    key: "reviewsByMonth",
    title: "Reviews per month",
    description: "The last 6 months",
    valueLabel: "Reviews",
    color: "var(--chart-1)",
    formatLabel: formatMonth,
  },
  ratings: {
    key: "ratings",
    title: "Rating distribution",
    description: "Number of reviews per rating (1–10)",
    valueLabel: "Reviews",
    color: "var(--chart-3)",
  },
  coursesBySkill: {
    key: "coursesBySkill",
    title: "Courses by skill level",
    description: "Minimum skill a course requires",
    valueLabel: "Courses",
    color: "var(--chart-2)",
    formatLabel: fromLabels(MINIMUM_SKILL_LABELS),
  },
  academiesByCareer: {
    key: "academiesByCareer",
    title: "Academies by career",
    description: "An academy can offer several careers",
    valueLabel: "Academies",
    color: "var(--chart-5)",
    horizontal: true,
  },
  usersByRole: {
    key: "usersByRole",
    title: "Users by role",
    description: "Everyone with an account",
    valueLabel: "Users",
    color: "var(--chart-4)",
    formatLabel: fromLabels(USER_ROLE_LABELS),
  },
} satisfies Record<string, ChartItem>;

// What each role sees. The API already scopes the numbers: admins get the whole platform,
// publishers their academies, students their own reviews.
export const ROLE_DASHBOARDS: Record<UserRole, RoleDashboard> = {
  admin: {
    kpis: [
      KPIS.users,
      KPIS.academies,
      KPIS.courses,
      KPIS.reviews,
      KPIS.averageRating,
      KPIS.averageTuition,
    ],
    charts: [
      CHARTS.reviewsByMonth,
      CHARTS.usersByRole,
      CHARTS.ratings,
      CHARTS.coursesBySkill,
      CHARTS.academiesByCareer,
    ],
  },
  publisher: {
    kpis: [
      KPIS.academies,
      KPIS.courses,
      { ...KPIS.reviews, label: "Reviews received" },
      KPIS.averageRating,
      KPIS.averageTuition,
    ],
    charts: [
      { ...CHARTS.reviewsByMonth, description: "Reviews of your academies, last 6 months" },
      CHARTS.ratings,
      CHARTS.coursesBySkill,
    ],
  },
  user: {
    kpis: [
      { ...KPIS.reviews, label: "Reviews written" },
      { ...KPIS.averageRating, label: "Avg. rating given" },
    ],
    charts: [
      { ...CHARTS.reviewsByMonth, description: "Reviews you wrote, last 6 months" },
      { ...CHARTS.ratings, title: "Ratings you gave" },
      {
        ...CHARTS.academiesByCareer,
        title: "Careers you reviewed",
        description: "Careers offered by the academies you reviewed",
      },
    ],
  },
};

export const formatKpi = (kpi: KpiItem, value: number | null): string =>
  value === null ? "None" : (kpi.format ?? formatNumber)(value);
