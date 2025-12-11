// backend/routes/messages.js
import express from "express";
import {
  getMessagesWithUser,
  sendMessage,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/with/:userId", getMessagesWithUser);
router.post("/", sendMessage);

export default router;
