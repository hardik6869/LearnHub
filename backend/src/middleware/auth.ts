import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "./async";
import ErrorResponse from "../utils/errorResponse";
import User from "../models/User";
import type { UserDocument, UserRole } from "../types";

// The signed-in user from the Bearer header or the token cookie; null when there is no token,
// it is invalid or expired, or its user no longer exists
const findUserFromToken = async (req: Request): Promise<UserDocument | null> => {
  let token: string | undefined;
  const cookieToken: unknown = req.cookies.token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Set token from bearer token in header
    token = req.headers.authorization.split(" ")[1];
  } else if (typeof cookieToken === "string") {
    // Set token from cookie
    token = cookieToken;
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
    const id =
      typeof decoded === "object" && typeof decoded.id === "string" ? decoded.id : undefined;
    return await User.findById(id);
  } catch {
    return null;
  }
};

// Protect Routes
export const protect = asyncHandler(async (req, res, next) => {
  req.user = await findUserFromToken(req);
  if (!req.user) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  next();
});

// Sets req.user when signed in and continues either way (GET /auth/me answers null instead of
// 401, so a signed-out visit doesn't log an error in the browser)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  req.user = await findUserFromToken(req);
  next();
});

// The user set by `protect`. Before `protect` runs, or when the token's user
// no longer exists, this throws (surfaced as a 500, as before the TS migration).
export const getAuthUser = (req: Pick<Request, "user">): UserDocument => {
  if (!req.user) {
    throw new TypeError("Cannot read properties of null: no authenticated user");
  }
  return req.user;
};

// Grant access to specific role
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = getAuthUser(req);
    if (!roles.includes(user.role)) {
      next(new ErrorResponse(`User role ${user.role} is not authorized to access this route`, 403));
      return;
    }
    next();
  };
};
