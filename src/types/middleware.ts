import type { NextFunction, Request, Response } from "express";

// advancedResults middleware
export interface PageInfo {
  page: number;
  limit: number;
}

export interface Pagination {
  next?: PageInfo;
  prev?: PageInfo;
}

export interface AdvancedResults {
  success: true;
  count: number;
  pagination: Pagination;
  data: unknown[];
}

// asyncHandler
export type AsyncRequestHandler<ReqBody, P> = (
  req: Request<P, unknown, ReqBody>,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

// Shape of the errors the error handler inspects (ErrorResponse, Mongoose and MongoDB errors)
export interface ErrorDetails {
  name?: string;
  message?: string;
  code?: number;
  statusCode?: number;
  errors?: Record<string, { message: string }>;
}
