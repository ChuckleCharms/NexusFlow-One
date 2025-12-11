// backend/routes/systemSettings.js
import express from "express";
import {
  getAllSettings,
  upsertSetting,
} from "../controllers/systemSettingsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// you might restrict these to admin later
router.get("/", getAllSettings);
router.post("/", upsertSetting);

export default router;
