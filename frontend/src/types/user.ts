import type { AssignableRole, UserRole } from "@/enums";
import type { Id, IsoDateString } from "./common";

export interface User {
  _id: Id;
  name: string;
  email: string;
  role: UserRole;
  createdAt: IsoDateString;
}

// Admin create (POST /users): the API stores only assignable roles, never "admin"
export interface CreateUserPayload {
  name: string;
  email: string;
  role: AssignableRole;
  password: string;
}

// Admin update (PUT /users/:id): the API ignores passwords here; users change their own password
export type UpdateUserPayload = Partial<Omit<CreateUserPayload, "password">>;
