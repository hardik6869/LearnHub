import express from "express";

import { getStats } from "../controllers/stats";

import { protect } from "../middleware/auth";

const router = express.Router();

// Any signed-in user; the controller scopes the numbers to their role
router.get("/", protect, getStats);

export default router;
