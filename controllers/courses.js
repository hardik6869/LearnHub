const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Academy = require("../models/Academy");

// @desc   Get all courses
// @route  GET /api/v1/courses
// @route  GET /api/v1/academies/:academyId/course
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.academyId) {
    const courses = await Course.find({ academy: req.params.academyId });
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc   Get course
// @route  GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "academy",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`),
      404,
    );
  }
  res.status(200).json({ success: true, data: course });
});

// @desc   Add course
// @route  POST /api/v1/academy/:academyId/courses
// @access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.academy = req.params.academyId;
  req.body.user = req.user.id;

  const academy = await Academy.findById(req.params.academyId);

  if (!academy) {
    return next(
      new ErrorResponse(`No academy with the id of ${req.params.academyId}`),
      404,
    );
  }

  // Make sure user is academy owner
  if (academy.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to academy ${academy._id}`,
        401,
      ),
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({ success: true, data: course });
});

// @desc   Update course
// @route  POST /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404,
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id}  is not authorized to update this course ${course._id}`,
        401,
      ),
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc   Delete course
// @route  DELETE /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404,
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id}  is not authorized to delete this course ${course._id}`,
        401,
      ),
    );
  }

  await course.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
