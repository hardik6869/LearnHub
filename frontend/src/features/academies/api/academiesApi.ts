import { http } from "@/api";
import { API_ROUTES } from "@/constants";
import type {
  Academy,
  AcademyPayload,
  ApiResponse,
  EmptyResponse,
  Id,
  ListParams,
  MessageResponse,
  PaginatedResponse,
} from "@/types";

export const getAcademies = (params: ListParams): Promise<PaginatedResponse<Academy>> =>
  http.get<PaginatedResponse<Academy>>(API_ROUTES.academies.list, params);

export const getAcademy = async (id: Id): Promise<Academy> =>
  (await http.get<ApiResponse<Academy>>(API_ROUTES.academies.detail(id))).data;

export const createAcademy = async (payload: AcademyPayload): Promise<Academy> =>
  (await http.post<ApiResponse<Academy>>(API_ROUTES.academies.list, payload)).data;

export const updateAcademy = async (id: Id, payload: AcademyPayload): Promise<Academy> =>
  (await http.put<ApiResponse<Academy>>(API_ROUTES.academies.detail(id), payload)).data;

export const deleteAcademy = async (id: Id): Promise<void> => {
  await http.delete<EmptyResponse>(API_ROUTES.academies.detail(id));
};

// The API reads the image from the multipart field "file"
export const uploadAcademyPhoto = async (id: Id, file: File): Promise<void> => {
  const body = new FormData();
  body.append("file", file);
  await http.put<MessageResponse>(API_ROUTES.academies.photo(id), body);
};
