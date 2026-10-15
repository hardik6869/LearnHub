import type { HydratedDocument, Model } from "mongoose";
import type { ASSIGNABLE_ROLES, USER_ROLES } from "../config/enums";

// Any stored role ("user" | "publisher" | "admin")
export type UserRole = (typeof USER_ROLES)[number];

// A role a request may set ("user" | "publisher")
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export interface IUser {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
}

export interface IUserMethods {
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

export type UserModel = Model<IUser, object, IUserMethods>;
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

// Request bodies for the admin user routes: only these fields are accepted, never reset tokens.
// The password can only be set on create (hashed by the pre-save hook); users change it via
// /auth/updatepassword or the reset flow
export type CreateUserBody = Partial<Pick<IUser, "name" | "email" | "role" | "password">>;
export type UpdateUserBody = Partial<Pick<IUser, "name" | "email" | "role">>;
