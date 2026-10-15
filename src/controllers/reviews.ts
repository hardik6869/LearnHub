import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import { getAuthUser } from "../middleware/auth";
import Review from "../models/Review";
import Academy from "../models/Academy";
import type { AcademyParams, IdParams, ReviewBody } from "../types";

// @desc   Get Reviews
// @route  GET /api/v1/reviews
// @route  GET /api/v1/academies/:academyId/reviews
// @access Public
export const getReviews = asyncHandler<unknown, AcademyParams>(async (req, res) => {
  if (req.params.academyId) {
    const reviews = await Review.find({ academy: req.params.academyId });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc   Get Single Review
// @route  GET /api/v1/reviews/:id
// @access Public
export const getReview = asyncHandler<unknown, IdParams>(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "academy",
    select: "name description",
  });

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
  req.body.academy = req.params.academyId;
  req.body.user = user.id;

  const academy = await Academy.findById(req.params.academyId);

  if (!academy) {
    return next(
      new ErrorResponse(`No academy with the id of ${String(req.params.academyId)}`, 404),
    );
  }

  const review = await Review.create(req.body);

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

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
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
