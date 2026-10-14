const path = require("path");
const Academy = require("../models/Academy");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc   Get all academies
// @route  GET /api/v1/academies
// @access Public
exports.getAcademies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get academy
// @route  GET /api/v1/academies/:id
// @access Public
exports.getAcademy = asyncHandler(async (req, res, next) => {
  const academy = await Academy.findById(req.params.id);

  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ success: true, data: academy });
});

// @desc   Create new academy
// @route  POST /api/v1/academies
// @access Public
exports.createAcademy = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published academy
  const publishedAcademy = await Academy.findOne({ user: req.user.id });

  // if the user is not the admin, they can only add one academy
  if (publishedAcademy && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The User with ID ${req.user.id} has already published an academy`,
        400,
      ),
    );
  }

  const academy = await Academy.create(req.body);
  res.status(201).json({ success: true, data: academy });
});

// @desc   Update an academy
// @route  PUT /api/v1/academies/:id
// @access Public
exports.updateAcademy = asyncHandler(async (req, res, next) => {
  let academy = await Academy.findById(req.params.id);

  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with id of ${req.params.id}`, 404),
    );
  }

  // Make sure user is academy owner
  if (academy.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this academy`,
        401,
      ),
    );
  }

  academy = await Academy.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: academy });
});

// @desc   Delete an academy
// @route  DELETE /api/v1/academies/:id
// @access Public
exports.deleteAcademy = asyncHandler(async (req, res, next) => {
  const academy = await Academy.findById(req.params.id);

  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with id of ${req.params.id}`, 404),
    );
  }

  // Make sure user is academy owner
  if (academy.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this academy`,
        401,
      ),
    );
  }

  await academy.deleteOne();

  res
    .status(200)
    .json({ success: true, message: `Delete Academy ${req.params.id}` });
});

// @desc   upload photo for academy
// @route  PUT /api/v1/academies/:id/photo
// @access Private
exports.academyPhotoUpload = asyncHandler(async (req, res, next) => {
  const academy = await Academy.findById(req.params.id);

  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with id of ${req.params.id}`, 404),
    );
  }

  // Make sure user is academy owner
  if (academy.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this academy`,
        404,
      ),
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a fille`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please Upload an image fille`, 400));
  }

  // Check File Size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload an image less then ${process.env.MAX_FILE_UPLOAD}`,
        400,
      ),
    );
  }

  // Create Custom File name
  file.name = `photo-${academy._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Academy.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, message: file.name });
  });
});
