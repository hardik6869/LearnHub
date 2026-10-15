import ErrorResponse from "../utils/errorResponse";
import pick from "../utils/pick";
import { REVIEW_FIELDS } from "../config/enums";
import asyncHandler from "../middleware/async";
import { getAuthUser } from "../middleware/auth";
import Review from "../models/Review";
import Academy from "../models/Academy";
import type { AcademyParams, IdParams, ReviewBody } from "../types";

// @desc   Get Reviews
// @route  GET /api/v1/reviews
// @route  GET /api/v1/academies/:academyId/reviews
// @access Public
// Nested requests are filtered to the academy by advancedResult, so both share pagination
export const getReviews = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get Single Review
// @route  GET /api/v1/reviews/:id
// @access Public
export const getReview = asyncHandler<unknown, IdParams>(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate([
    { path: "academy", select: "name description" },
    // Author name only, never other user fields
    { path: "user", select: "name" },
  ]);

  if (!review) {
    return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: review });
});

// @desc   Add Review
// @route  POST /api/v1/reviews/:academyId/reviews
// @access Private
export const addReview = asyncHandler<ReviewBody, AcademyParams>(async (req, res, next) => {
  const user = getAuthUser(req);

  const academy = await Academy.findById(req.params.academyId);

  if (!academy) {
    return next(
      new ErrorResponse(`No academy with the id of ${String(req.params.academyId)}`, 404),
    );
  }

  // Only client-settable fields; academy and author come from the route and the signed-in user
  const review = await Review.create({
    ...pick(req.body, REVIEW_FIELDS),
    academy: academy._id,
    user: user.id,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc   Update Review
// @route  PUT /api/v1/reviews/:id
// @access Private
export const updateReview = asyncHandler<ReviewBody, IdParams>(async (req, res, next) => {
  const user = getAuthUser(req);
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== user.id && user.role !== "admin") {
    return next(new ErrorResponse(`Not authorize to update review`, 401));
  }

  // Only client-settable fields: a review can't be moved to another academy or author
  review = await Review.findByIdAndUpdate(req.params.id, pick(req.body, REVIEW_FIELDS), {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc   Delete Review
// @route  Delete /api/v1/reviews/:id
// @access Private
export const deleteReview = asyncHandler<unknown, IdParams>(async (req, res, next) => {
  const user = getAuthUser(req);
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== user.id && user.role !== "admin") {
    return next(new ErrorResponse(`Not authorize to update review`, 401));
  }

  await review.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
