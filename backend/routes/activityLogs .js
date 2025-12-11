// backend/routes/activityLogs.js
import express from "express";
import { getActivityLogs } from "../controllers/activityLogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getActivityLogs);

export default router;
