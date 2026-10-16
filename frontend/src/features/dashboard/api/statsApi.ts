import { http } from "@/api";
import { API_ROUTES } from "@/constants";
import type { ApiResponse, DashboardStats } from "@/types";

export const getStats = async (): Promise<DashboardStats> =>
  (await http.get<ApiResponse<DashboardStats>>(API_ROUTES.stats)).data;
