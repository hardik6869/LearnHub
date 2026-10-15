import type { UserRole } from "@/enums";
import type { Id, IsoDateString } from "./common";

export interface User {
  _id: Id;
  name: string;
  email: string;
  role: UserRole;
  createdAt: IsoDateString;
}

// Admin create/update (/users); the password is only sent when creating
export interface UserPayload {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}
