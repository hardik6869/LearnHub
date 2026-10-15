import axios from "axios";
import { env } from "@/config";
import { toQueryString } from "@/lib";
import type { ListParams } from "@/types";
import { ApiError } from "./apiError";

// withCredentials sends the httpOnly auth cookie; /api is same-origin (Vite proxy in dev,
// Vercel rewrite in production), so the cookie is first-party
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: { Accept: "application/json" },
  paramsSerializer: { serialize: (params: ListParams) => toQueryString(params) },
});

const readErrorMessage = (data: unknown): string | undefined => {
  if (typeof data === "object" && data !== null && "error" in data) {
    if (typeof data.error === "string" && data.error) return data.error;
  }
  return undefined;
};

// Normalise every failure into an ApiError carrying the API's `error` message
const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (!error.response) {
      return new ApiError("Unable to reach the server. Check your connection and try again.");
    }
    return new ApiError(
      readErrorMessage(error.response.data) ?? `Request failed with status ${String(status)}`,
      status,
    );
  }
  return new ApiError(error instanceof Error ? error.message : "Unexpected error");
};

apiClient.interceptors.response.use(undefined, (error: unknown) =>
  Promise.reject(toApiError(error)),
);

// Thin typed helpers that return the response body; feature api modules build on these
export const http = {
  get: async <TResponse>(url: string, params?: ListParams): Promise<TResponse> =>
    (await apiClient.get<TResponse>(url, { params })).data,

  // body: a JSON-serialisable payload, or FormData for file uploads
  post: async <TResponse>(url: string, body?: unknown): Promise<TResponse> =>
    (await apiClient.post<TResponse>(url, body)).data,

  put: async <TResponse>(url: string, body?: unknown): Promise<TResponse> =>
    (await apiClient.put<TResponse>(url, body)).data,

  delete: async <TResponse>(url: string): Promise<TResponse> =>
    (await apiClient.delete<TResponse>(url)).data,
};
