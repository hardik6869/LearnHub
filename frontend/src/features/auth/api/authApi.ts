import { http, isApiError } from "@/api";
import { API_ROUTES } from "@/constants";
import type {
  ApiResponse,
  AuthTokenResponse,
  EmptyResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateDetailsPayload,
  UpdatePasswordPayload,
  User,
} from "@/types";

// Token responses set the httpOnly cookie; the token in the body is ignored on purpose

// null when signed out (the API answers 401), so callers never handle that as an error
export const getMe = async (): Promise<User | null> => {
  try {
    return (await http.get<ApiResponse<User>>(API_ROUTES.auth.me)).data;
  } catch (error) {
    if (isApiError(error) && error.isUnauthorized) return null;
    throw error;
  }
};

export const login = async (payload: LoginPayload): Promise<void> => {
  await http.post<AuthTokenResponse>(API_ROUTES.auth.login, payload);
};

export const register = async (payload: RegisterPayload): Promise<void> => {
  await http.post<AuthTokenResponse>(API_ROUTES.auth.register, payload);
};

export const logout = async (): Promise<void> => {
  await http.get<EmptyResponse>(API_ROUTES.auth.logout);
};

export const updateDetails = async (payload: UpdateDetailsPayload): Promise<User> =>
  (await http.put<ApiResponse<User>>(API_ROUTES.auth.updateDetails, payload)).data;

export const updatePassword = async (payload: UpdatePasswordPayload): Promise<void> => {
  await http.put<AuthTokenResponse>(API_ROUTES.auth.updatePassword, payload);
};

/** Resolves with the API's message (the same for known and unknown emails) */
export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<string> =>
  (await http.post<ApiResponse<string>>(API_ROUTES.auth.forgotPassword, payload)).data;

export const resetPassword = async (
  token: string,
  payload: ResetPasswordPayload,
): Promise<void> => {
  await http.put<AuthTokenResponse>(API_ROUTES.auth.resetPassword(token), payload);
};
