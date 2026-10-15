import path from "path";
import type { UploadedFile } from "express-fileupload";
import Academy from "../models/Academy";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import { getAuthUser } from "../middleware/auth";
import type { AcademyBody, IdParams } from "../types";

// @desc   Get all academies
// @route  GET /api/v1/academies
// @access Public
export const getAcademies = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get academy
// @route  GET /api/v1/academies/:id
// @access Public
export const getAcademy = asyncHandler<unknown, IdParams>(async (req, res, next) => {
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
export const createAcademy = asyncHandler<AcademyBody>(
  async (req, res, next) => {
    const user = getAuthUser(req);

    // Add user to req.body
    req.body.user = user.id;

    // Check for published academy
    const publishedAcademy = await Academy.findOne({ user: user.id });

    // if the user is not the admin, they can only add one academy
    if (publishedAcademy && user.role !== "admin") {
      return next(
        new ErrorResponse(
          `The User with ID ${user.id} has already published an academy`,
          400,
        ),
      );
    }

    const academy = await Academy.create(req.body);
    res.status(201).json({ success: true, data: academy });
  },
);

// @desc   Update an academy
// @route  PUT /api/v1/academies/:id
// @access Public
export const updateAcademy = asyncHandler<AcademyBody, IdParams>(
  async (req, res, next) => {
    const user = getAuthUser(req);
    let academy = await Academy.findById(req.params.id);

    if (!academy) {
      return next(
        new ErrorResponse(`Academy not found with id of ${req.params.id}`, 404),
      );
    }

    // Make sure user is academy owner
    if (academy.user.toString() !== user.id && user.role !== "admin") {
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
  },
);

// @desc   Delete an academy
// @route  DELETE /api/v1/academies/:id
// @access Public
export const deleteAcademy = asyncHandler<unknown, IdParams>(async (req, res, next) => {
  const user = getAuthUser(req);
  const academy = await Academy.findById(req.params.id);

  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with id of ${req.params.id}`, 404),
    );
  }

  // Make sure user is academy owner
  if (academy.user.toString() !== user.id && user.role !== "admin") {
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
export const academyPhotoUpload = asyncHandler<unknown, IdParams>(
  async (req, res, next) => {
    const user = getAuthUser(req);
    const academy = await Academy.findById(req.params.id);

    if (!academy) {
      return next(
        new ErrorResponse(`Academy not found with id of ${req.params.id}`, 404),
      );
    }

    // Make sure user is academy owner
    if (academy.user.toString() !== user.id && user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.params.id} is not authorized to update this academy`,
          404,
        ),
      );
    }

    // A field can carry several files; only the first one is used
    const upload: UploadedFile | UploadedFile[] | undefined = req.files?.file;
    const file = Array.isArray(upload) ? upload[0] : upload;

    if (!file) {
      return next(new ErrorResponse(`Please Upload a fille`, 400));
    }

    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please Upload an image fille`, 400));
    }

    // Check File Size
    if (file.size > Number(process.env.MAX_FILE_UPLOAD)) {
      return next(
        new ErrorResponse(
          `Please Upload an image less then ${String(process.env.MAX_FILE_UPLOAD)}`,
          400,
        ),
      );
    }

    // Create Custom File name
    file.name = `photo-${academy.id}${path.parse(file.name).ext}`;

    file.mv(
      `${String(process.env.FILE_UPLOAD_PATH)}/${file.name}`,
      (err: unknown) => {
        if (err) {
          next(new ErrorResponse(`Problem with file upload`, 500));
          return;
        }
        void (async () => {
          await Academy.findByIdAndUpdate(req.params.id, { photo: file.name });
          res.status(200).json({ success: true, message: file.name });
        })();
      },
    );
  },
);
