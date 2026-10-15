import { http } from "@/api";
import { API_ROUTES } from "@/constants";
import type {
  ApiResponse,
  CreateUserPayload,
  EmptyResponse,
  Id,
  ListParams,
  PaginatedResponse,
  UpdateUserPayload,
  User,
} from "@/types";

// Admin only (the API answers 403 for anyone else)

export const getUsers = (params: ListParams): Promise<PaginatedResponse<User>> =>
  http.get<PaginatedResponse<User>>(API_ROUTES.users.list, params);

export const createUser = async (payload: CreateUserPayload): Promise<User> =>
  (await http.post<ApiResponse<User>>(API_ROUTES.users.list, payload)).data;

export const updateUser = async (id: Id, payload: UpdateUserPayload): Promise<User> =>
  (await http.put<ApiResponse<User>>(API_ROUTES.users.detail(id), payload)).data;

export const deleteUser = async (id: Id): Promise<void> => {
  await http.delete<EmptyResponse>(API_ROUTES.users.detail(id));
};
