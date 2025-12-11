// backend/routes/notifications.js
import express from "express";
import {
  getNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.post("/:id/read", markNotificationRead);

export default router;
