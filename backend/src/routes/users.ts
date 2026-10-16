import express from "express";

import { getUser, getUsers, createUser, deleteUser, updateUser } from "../controllers/users";

import User from "../models/User";

import { protect, authorize } from "../middleware/auth";

import advancedResult from "../middleware/advancedResult";
const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(advancedResult(User, undefined, { searchField: "name" }), getUsers)
  .post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
