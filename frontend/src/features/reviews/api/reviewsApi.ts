import { http } from "@/api";
import { API_ROUTES } from "@/constants";
import type {
  ApiResponse,
  EmptyResponse,
  Id,
  ListParams,
  PaginatedResponse,
  Review,
  ReviewPayload,
} from "@/types";

// All reviews; filter with params, e.g. { user: id } for one author's reviews
export const getReviews = (params: ListParams): Promise<PaginatedResponse<Review>> =>
  http.get<PaginatedResponse<Review>>(API_ROUTES.reviews.list, params);

export const getAcademyReviews = (
  academyId: Id,
  params: ListParams,
): Promise<PaginatedResponse<Review>> =>
  http.get<PaginatedResponse<Review>>(API_ROUTES.academies.reviews(academyId), params);

// Reviews are created through the academy's nested route
export const createReview = async (academyId: Id, payload: ReviewPayload): Promise<Review> =>
  (await http.post<ApiResponse<Review>>(API_ROUTES.academies.reviews(academyId), payload)).data;

export const updateReview = async (id: Id, payload: ReviewPayload): Promise<Review> =>
  (await http.put<ApiResponse<Review>>(API_ROUTES.reviews.detail(id), payload)).data;

export const deleteReview = async (id: Id): Promise<void> => {
  await http.delete<EmptyResponse>(API_ROUTES.reviews.detail(id));
};
