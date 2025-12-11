// backend/routes/apiKeys.js
import express from "express";
import {
  getApiKeys,
  createApiKey,
  deleteApiKey,
} from "../controllers/apiKeyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getApiKeys);
router.post("/", createApiKey);
router.delete("/:id", deleteApiKey);

export default router;
