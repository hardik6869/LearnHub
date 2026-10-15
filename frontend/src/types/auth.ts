import type { AssignableRole } from "@/enums";

// Login/register/reset respond with the JWT, but the browser authenticates with the httpOnly
// cookie set on the same response — the frontend never reads or stores the token
export interface AuthTokenResponse {
  success: true;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: AssignableRole;
}

export interface UpdateDetailsPayload {
  name: string;
  email: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
}
