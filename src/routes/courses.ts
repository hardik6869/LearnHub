import express from "express";

import {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses";

import Course from "../models/Course";

import { protect, authorize } from "../middleware/auth";

import advancedResult from "../middleware/advancedResult";
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advancedResult(Course, { path: "academy", select: "name description" }), getCourses)
  .post(protect, authorize("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

export default router;
