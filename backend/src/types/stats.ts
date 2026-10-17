// GET /api/v1/stats — dashboard KPIs and chart data, scoped to the signed-in user's role

// One bar of a chart: a category (career, skill, rating, "2026-05" month…) and its count
export interface CountItem {
  label: string;
  count: number;
}

export interface StatsTotals {
  /** Admins only; null for other roles */
  users: number | null;
  academies: number;
  courses: number;
  reviews: number;
  /** null when there are no reviews / courses */
  averageRating: number | null;
  averageTuition: number | null;
}

export interface DashboardStats {
  totals: StatsTotals;
  /** Admins only; empty for other roles */
  usersByRole: CountItem[];
  academiesByCareer: CountItem[];
  coursesBySkill: CountItem[];
  /** Ratings 1–10 */
  ratings: CountItem[];
  /** The last 6 months, oldest first, labelled "YYYY-MM" (UTC) */
  reviewsByMonth: CountItem[];
}
