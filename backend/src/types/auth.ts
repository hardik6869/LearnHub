import type { IUser } from "./user";

// Auth request bodies reuse the field types from IUser

export type RegisterBody = Partial<Pick<IUser, "name" | "email" | "password" | "role">>;

export type LoginBody = Partial<Pick<IUser, "email" | "password">>;

export type UpdateDetailsBody = Partial<Pick<IUser, "name" | "email">>;

export interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export type ForgotPasswordBody = Partial<Pick<IUser, "email">>;

export interface ResetPasswordParams {
  resettoken: string;
}

export type ResetPasswordBody = Pick<IUser, "password">;
