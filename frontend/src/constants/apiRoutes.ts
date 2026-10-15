import type { Id } from "@/types";

// Every backend endpoint, relative to env.apiBaseUrl (/api/v1).
// Mirrors backend/src/routes/*.ts — update both sides together.
export const API_ROUTES = {
  health: "/health",
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
    updateDetails: "/auth/updatedetails",
    updatePassword: "/auth/updatepassword",
    forgotPassword: "/auth/forgotpassword",
    resetPassword: (resetToken: string) => `/auth/resetpassword/${resetToken}`,
  },
  academies: {
    list: "/academies",
    detail: (id: Id) => `/academies/${id}`,
    photo: (id: Id) => `/academies/${id}/photo`,
    courses: (academyId: Id) => `/academies/${academyId}/courses`,
    reviews: (academyId: Id) => `/academies/${academyId}/reviews`,
  },
  courses: {
    list: "/courses",
    detail: (id: Id) => `/courses/${id}`,
  },
  reviews: {
    list: "/reviews",
    detail: (id: Id) => `/reviews/${id}`,
  },
  // Admin only
  users: {
    list: "/users",
    detail: (id: Id) => `/users/${id}`,
  },
} as const;
