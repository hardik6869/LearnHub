import { z } from "zod";
import { ASSIGNABLE_ROLES, USER_ROLES } from "@/enums";
import type { User } from "@/types";

// Mirrors backend/src/models/User.ts; only assignable roles (never admin)
export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.email("Enter a valid email address"),
  role: z.enum(ASSIGNABLE_ROLES, "Choose a role"),
  // Only used when creating; the API never changes a password from here
  password: z.string(),
});

// Creating needs a password; editing ignores it
export const createUserSchema = userSchema.extend({
  password: z.string().min(6, "Use at least 6 characters"),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const toUserFormValues = (user?: User): UserFormValues => ({
  name: user?.name ?? "",
  email: user?.email ?? "",
  // Admins are never edited here, so their role never reaches the form
  role: user?.role === USER_ROLES.PUBLISHER ? USER_ROLES.PUBLISHER : USER_ROLES.USER,
  password: "",
});
