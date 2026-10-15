import asyncHandler from "../middleware/async";
import User from "../models/User";
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
export const getUser = asyncHandler<unknown, IdParams>(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

// @desc   Create user
// @route  POST /api/v1/auth/users
// @access Private/Admin
export const createUser = asyncHandler<CreateUserBody>(async (req, res) => {
  const { name, email, role, password } = req.body;
  const user = await User.create({ name, email, role, password });

  res.status(201).json({ success: true, data: user });
});

// @desc   Update user
// @route  PUT /api/v1/auth/users
// @access Private/Admin
export const updateUser = asyncHandler<UpdateUserBody, IdParams>(async (req, res) => {
  // Whitelist fields: findByIdAndUpdate skips the pre-save hook, so a password sent here would be
  // stored unhashed
  const { name, email, role } = req.body;
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
export const deleteUser = asyncHandler<unknown, IdParams>(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
