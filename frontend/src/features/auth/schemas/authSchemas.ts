import { z } from "zod";
import { ASSIGNABLE_ROLES } from "@/enums";

// Mirrors backend/src/models/User.ts
const PASSWORD_MIN = 6;

const name = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be at most 50 characters");
const email = z.email("Enter a valid email address");
const newPassword = z.string().min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`);
const requiredPassword = z.string().min(1, "Enter your password");

const passwordsMatch = (values: { password: string; confirmPassword: string }) =>
  values.password === values.confirmPassword;
const mismatch = { message: "Passwords don't match", path: ["confirmPassword"] };

export const loginSchema = z.object({ email, password: requiredPassword });
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name,
  email,
  password: newPassword,
  role: z.enum(ASSIGNABLE_ROLES),
});
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({ password: newPassword, confirmPassword: z.string() })
  .refine(passwordsMatch, mismatch);
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const updateDetailsSchema = z.object({ name, email });
export type UpdateDetailsValues = z.infer<typeof updateDetailsSchema>;

export const updatePasswordSchema = z
  .object({ currentPassword: requiredPassword, password: newPassword, confirmPassword: z.string() })
  .refine(passwordsMatch, mismatch);
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
