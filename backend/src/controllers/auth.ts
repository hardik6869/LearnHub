import crypto from "crypto";
import type { CookieOptions, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import { getAuthUser } from "../middleware/auth";
import User from "../models/User";
import sendEmail from "../utils/sendEmail";
import type {
  ForgotPasswordBody,
  LoginBody,
  RegisterBody,
  ResetPasswordBody,
  ResetPasswordParams,
  UpdateDetailsBody,
  UpdatePasswordBody,
  UserDocument,
} from "../types";

// @desc   Register user
// @route  POST /api/v1/auth/register
// @access Public
export const register = asyncHandler<RegisterBody>(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Create Role
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  void sendTokenResponse(user, 200, res);
});

// @desc   Login user
// @route  POST /api/v1/auth/login
// @access Public
export const login = asyncHandler<LoginBody>(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate Email & Password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide Email and password", 400));
  }

  // Check for User
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check is password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  void sendTokenResponse(user, 200, res);
});

// @desc   Get Currrent logged in user
// @route  POST /api/v1/auth/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(getAuthUser(req).id);
  res.status(200).json({ success: true, data: user });
});

// @desc   Log user out / clear cookie
// @route  GET /api/v1/auth/logout
// @access Private
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({ success: true, data: {} });
});

// @desc   Update User Detials
// @route  PUT /api/v1/auth/updatedetails
// @access Private
export const updateDetails = asyncHandler<UpdateDetailsBody>(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(getAuthUser(req).id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @desc   Update Password
// @route  PUT /api/v1/auth/updatepassword
// @access Private
export const updatePassword = asyncHandler<UpdatePasswordBody>(async (req, res, next) => {
  const user = await User.findById(getAuthUser(req).id).select("+password");

  // Check current password (a missing user fails here, as before)
  if (!user) {
    throw new TypeError("Cannot read properties of null (reading 'matchPassword')");
  }
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  void sendTokenResponse(user, 200, res);
});

// Get Token from model, create cookie and send response.
// Kept async and un-awaited by callers to preserve existing behaviour (see review).
const sendTokenResponse = async (
  user: UserDocument,
  statusCode: number,
  res: Response,
): Promise<void> => {
  // Create Token
  const token = user.getSignedJwtToken();

  const options: CookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // Not sent on cross-site POST/PUT/DELETE, which guards cookie auth against CSRF
    sameSite: "lax",
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({ success: true, token });
};

// @desc   Forgot Password
// @route  POST /api/v1/auth/forgotpassword
// @access public
export const forgotPassword = asyncHandler<ForgotPasswordBody>(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get Reset Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url: the frontend page when CLIENT_URL is set, otherwise the API endpoint
  const clientUrl = process.env.CLIENT_URL;
  const message = clientUrl
    ? `You are receiving this email because you (or someone else) has requested the reset of a password. Please open this link to choose a new password: \n\n ${clientUrl}/reset-password/${resetToken}`
    : `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${req.protocol}://${String(req.get("host"))}/api/v1/auth/resetpassword/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Token",
      message,
    });

    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc   Reset Password
// @route  PUT /api/v1/auth/resetpassword/:resettoken
// @access Public
export const resetPassword = asyncHandler<ResetPasswordBody, ResetPasswordParams>(
  async (req, res, next) => {
    // get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    // Set new passwords
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    void sendTokenResponse(user, 200, res);
  },
);
