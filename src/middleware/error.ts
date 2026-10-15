import type { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import type { ErrorDetails } from "../types";

const toErrorDetails = (err: unknown): ErrorDetails =>
  typeof err === "object" && err !== null ? err : {};

// Express recognises error handlers by their four parameters, so `_next` must stay
const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  const details = toErrorDetails(err);
  let error: ErrorDetails = {
    statusCode: details.statusCode,
    message: details.message,
  };

  // Mongpoose bad ObjectId
  if (details.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (details.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (details.name === "ValidationError") {
    const message = Object.values(details.errors ?? {})
      .map((val) => val.message)
      .join(",");
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
