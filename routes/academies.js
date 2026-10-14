const express = require("express");

const {
  getAcademies,
  getAcademy,
  createAcademy,
  updateAcademy,
  deleteAcademy,
  academyPhotoUpload,
} = require("../controllers/academies");

const Academy = require("../models/Academy");

const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

// Include otheer resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();

// re-route into other resource routers
router.use("/:academyId/courses", courseRouter);
router.use("/:academyId/reviews", reviewRouter);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), academyPhotoUpload);

router
  .route("/")
  .get(advancedResult(Academy, "courses"), getAcademies)
  .post(protect, authorize("publisher", "admin"), createAcademy);
router
  .route("/:id")
  .get(getAcademy)
  .put(protect, authorize("publisher", "admin"), updateAcademy)
  .delete(protect, authorize("publisher", "admin"), deleteAcademy);

module.exports = router;
