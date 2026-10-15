import { http } from "@/api";
import { API_ROUTES } from "@/constants";
import type {
  ApiResponse,
  Course,
  CoursePayload,
  EmptyResponse,
  Id,
  ListParams,
  PaginatedResponse,
} from "@/types";

export const getAcademyCourses = (
  academyId: Id,
  params: ListParams,
): Promise<PaginatedResponse<Course>> =>
  http.get<PaginatedResponse<Course>>(API_ROUTES.academies.courses(academyId), params);

// Courses are created through the academy's nested route
export const createCourse = async (academyId: Id, payload: CoursePayload): Promise<Course> =>
  (await http.post<ApiResponse<Course>>(API_ROUTES.academies.courses(academyId), payload)).data;

export const updateCourse = async (id: Id, payload: CoursePayload): Promise<Course> =>
  (await http.put<ApiResponse<Course>>(API_ROUTES.courses.detail(id), payload)).data;

export const deleteCourse = async (id: Id): Promise<void> => {
  await http.delete<EmptyResponse>(API_ROUTES.courses.detail(id));
};
