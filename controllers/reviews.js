const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Academy = require("../models/Academy");

// @desc   Get Reviews
// @route  GET /api/v1/reviews
// @route  GET /api/v1/academies/:academyId/reviews
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.academyId) {
    const reviews = await Review.find({ academy: req.params.academyId });
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc   Get Single Review
// @route  GET /api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "academy",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc   Add Review
// @route  POST /api/v1/reviews/:academyId/reviews
// @access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.academy = req.params.academyId;
  req.body.user = req.user.id;

  const academy = await Academy.findById(req.params.academyId);

  if (!academy) {
    return next(
      new ErrorResponse(
        `No academy with the id of ${req.params.academyId}`,
        404,
      ),
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, data: review });
});

// @desc   Update Review
// @route  PUT /api/v1/reviews/:id
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404),
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
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
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404),
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorize to update review`, 401));
  }

  await Review.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
