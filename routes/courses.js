const express = require("express");

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");

const { protect, authorize } = require("../middleware/auth");

const advancedResult = require("../middleware/advancedResult");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResult(Course, { path: "academy", select: "name description" }),
    getCourses,
  )
  .post(protect, authorize("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
