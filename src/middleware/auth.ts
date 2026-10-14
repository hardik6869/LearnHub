import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "./async";
import ErrorResponse from "../utils/errorResponse";
import User, { UserDocument, UserRole } from "../models/User";

// Protect Routes
export const protect = asyncHandler(async (req, res, next) => {
  let token: string | undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from bearer token in header
    token = req.headers.authorization.split(" ")[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    //verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
    console.log(decoded);
    const id =
      typeof decoded === "object" && typeof decoded.id === "string"
        ? decoded.id
        : undefined;
    req.user = await User.findById(id);
    next();
  } catch {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// The user set by `protect`. Before `protect` runs, or when the token's user
// no longer exists, this throws (surfaced as a 500, as before the TS migration).
export const getAuthUser = (req: {
  user?: UserDocument | null;
}): UserDocument => {
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
      next(
        new ErrorResponse(
          `User role ${user.role} is not authorized to access this route`,
          403,
        ),
      );
      return;
    }
    next();
  };
};
