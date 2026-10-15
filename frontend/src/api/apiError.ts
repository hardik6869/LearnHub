// Every failed request rejects with an ApiError, so callers handle one error shape
export class ApiError extends Error {
  /** HTTP status; undefined when the request never got a response (network error) */
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** 4xx: retrying the same request will not help */
  get isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

// A message that is safe to show in the UI (toasts, error states)
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
};
