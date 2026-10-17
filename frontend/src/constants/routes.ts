import type { Id } from "@/types";

// Route patterns for the router
export const ROUTE_PATHS = {
  home: "/",
  academies: "/academies",
  academyDetail: "/academies/:id",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  // Must match the link in the backend's reset email (backend/src/controllers/auth.ts)
  resetPassword: "/reset-password/:token",
  dashboard: "/dashboard",
  account: "/account",
  dashboardAnalytics: "/dashboard/analytics",
  dashboardAcademies: "/dashboard/academies",
  dashboardReviews: "/dashboard/reviews",
  dashboardUsers: "/dashboard/users",
  notFound: "*",
} as const;

// Concrete URLs for links and navigate()
export const ROUTES = {
  home: ROUTE_PATHS.home,
  academies: ROUTE_PATHS.academies,
  academyDetail: (id: Id) => `/academies/${id}`,
  login: ROUTE_PATHS.login,
  register: ROUTE_PATHS.register,
  forgotPassword: ROUTE_PATHS.forgotPassword,
  resetPassword: (token: string) => `/reset-password/${token}`,
  dashboard: ROUTE_PATHS.dashboard,
  account: ROUTE_PATHS.account,
  dashboardAnalytics: ROUTE_PATHS.dashboardAnalytics,
  dashboardAcademies: ROUTE_PATHS.dashboardAcademies,
  dashboardReviews: ROUTE_PATHS.dashboardReviews,
  dashboardUsers: ROUTE_PATHS.dashboardUsers,
} as const;
