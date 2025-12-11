// backend/routes/analytics.js
import express from "express";
import {
  getUserAnalytics,
  createAnalyticsEvent,
} from "../controllers/analyticsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getUserAnalytics);
router.post("/", createAnalyticsEvent);

export default router;
