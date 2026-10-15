import type { Id } from "@/types";

// Route patterns for the router
export const ROUTE_PATHS = {
  home: "/",
  academies: "/academies",
  academyNew: "/academies/new",
  academyDetail: "/academies/:id",
  academyEdit: "/academies/:id/edit",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  // Must match the link in the backend's reset email (backend/src/controllers/auth.ts)
  resetPassword: "/reset-password/:token",
  dashboard: "/dashboard",
  account: "/account",
  adminUsers: "/admin/users",
  notFound: "*",
} as const;

// Concrete URLs for links and navigate()
export const ROUTES = {
  home: ROUTE_PATHS.home,
  academies: ROUTE_PATHS.academies,
  academyNew: ROUTE_PATHS.academyNew,
  academyDetail: (id: Id) => `/academies/${id}`,
  academyEdit: (id: Id) => `/academies/${id}/edit`,
  login: ROUTE_PATHS.login,
  register: ROUTE_PATHS.register,
  forgotPassword: ROUTE_PATHS.forgotPassword,
  resetPassword: (token: string) => `/reset-password/${token}`,
  dashboard: ROUTE_PATHS.dashboard,
  account: ROUTE_PATHS.account,
  adminUsers: ROUTE_PATHS.adminUsers,
} as const;
