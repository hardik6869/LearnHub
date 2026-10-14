import asyncHandler from "../middleware/async";
import User, { IUser } from "../models/User";

type UserBody = Partial<IUser>;

interface IdParams {
  id: string;
}

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
export const createUser = asyncHandler<UserBody>(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

// @desc   Update user
// @route  PUT /api/v1/auth/users
// @access Private/Admin
export const updateUser = asyncHandler<UserBody, IdParams>(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @desc   Delete user
// @route  DELETE /api/v1/auth/users
// @access Private/Admin
export const deleteUser = asyncHandler<unknown, IdParams>(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
