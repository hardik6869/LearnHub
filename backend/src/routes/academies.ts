import express from "express";

import {
  getAcademies,
  getAcademy,
  createAcademy,
  updateAcademy,
  deleteAcademy,
  academyPhotoUpload,
} from "../controllers/academies";

import Academy from "../models/Academy";

import advancedResult from "../middleware/advancedResult";
import { protect, authorize } from "../middleware/auth";

// Include otheer resource routers
import courseRouter from "./courses";
import reviewRouter from "./reviews";

const router = express.Router();

// re-route into other resource routers
router.use("/:academyId/courses", courseRouter);
router.use("/:academyId/reviews", reviewRouter);

router.route("/:id/photo").put(protect, authorize("publisher", "admin"), academyPhotoUpload);

router
  .route("/")
  .get(advancedResult(Academy, "courses", { searchField: "name" }), getAcademies)
  .post(protect, authorize("publisher", "admin"), createAcademy);
router
  .route("/:id")
  .get(getAcademy)
  .put(protect, authorize("publisher", "admin"), updateAcademy)
  .delete(protect, authorize("publisher", "admin"), deleteAcademy);

export default router;
