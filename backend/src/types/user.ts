import type { HydratedDocument, Model } from "mongoose";
import type { ASSIGNABLE_ROLES } from "../config/enums";

// A role the schema stores ("user" | "publisher"), or "admin", which `authorize` checks for
export type UserRole = (typeof ASSIGNABLE_ROLES)[number] | "admin";

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

// Request body for the admin user routes
export type UserBody = Partial<IUser>;
