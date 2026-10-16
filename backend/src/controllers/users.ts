import asyncHandler from "../middleware/async";
import User from "../models/User";
import ErrorResponse from "../utils/errorResponse";
import { INVALID_ROLE_MESSAGE, isAssignableRole } from "../config/enums";
import type { CreateUserBody, IdParams, UpdateUserBody } from "../types";

// @desc   Get all users
// @route  GET /api/v1/auth/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get user
// @route  GET /api/v1/auth/users/:id
// @access Private/Admin
export const getUser = asyncHandler<unknown, IdParams>(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: user });
});

// Admins are assigned in the database, so the API never edits or deletes one; this also stops
// an admin from demoting or deleting themselves
const ADMIN_LOCKED_MESSAGE = "Admin accounts are managed in the database and can't be changed here";

// @desc   Create user
// @route  POST /api/v1/auth/users
// @access Private/Admin
export const createUser = asyncHandler<CreateUserBody>(async (req, res, next) => {
  const { name, email, role, password } = req.body;
  // Admins are assigned in the database only, never through the API
  if (role !== undefined && !isAssignableRole(role)) {
    return next(new ErrorResponse(INVALID_ROLE_MESSAGE, 400));
  }
  const user = await User.create({ name, email, role, password });

  res.status(201).json({ success: true, data: user });
});

// @desc   Update user
// @route  PUT /api/v1/auth/users
// @access Private/Admin
export const updateUser = asyncHandler<UpdateUserBody, IdParams>(async (req, res, next) => {
  // Whitelist fields: findByIdAndUpdate skips the pre-save hook, so a password sent here would be
  // stored unhashed
  const { name, email, role } = req.body;
  if (role !== undefined && !isAssignableRole(role)) {
    return next(new ErrorResponse(INVALID_ROLE_MESSAGE, 400));
  }

  const existing = await User.findById(req.params.id);
  if (!existing) {
    return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }
  if (existing.role === "admin") {
    return next(new ErrorResponse(ADMIN_LOCKED_MESSAGE, 403));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true, runValidators: true },
  );

  res.status(200).json({ success: true, data: user });
});

// @desc   Delete user
// @route  DELETE /api/v1/auth/users
// @access Private/Admin
export const deleteUser = asyncHandler<unknown, IdParams>(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }
  if (user.role === "admin") {
    return next(new ErrorResponse(ADMIN_LOCKED_MESSAGE, 403));
  }

  await user.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
