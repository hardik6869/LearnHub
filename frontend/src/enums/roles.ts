import type { SelectOption } from "@/types";

// Mirrors the backend: the schema stores "user" | "publisher" (ASSIGNABLE_ROLES in
// backend/src/config/enums.ts); "admin" exists but can never be chosen at sign-up
export const USER_ROLES = {
  USER: "user",
  PUBLISHER: "publisher",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ASSIGNABLE_ROLES = [USER_ROLES.USER, USER_ROLES.PUBLISHER] as const;

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  user: "Student",
  publisher: "Publisher",
  admin: "Admin",
};

export const ASSIGNABLE_ROLE_OPTIONS: readonly SelectOption<AssignableRole>[] =
  ASSIGNABLE_ROLES.map((role) => ({ value: role, label: USER_ROLE_LABELS[role] }));
