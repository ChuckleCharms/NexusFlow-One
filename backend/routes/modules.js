// backend/routes/modules.js
import express from "express";
import {
  getModulesByWorkflow,
  createModule,
  updateModule,
  deleteModule,
} from "../controllers/moduleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/workflow/:workflowId", getModulesByWorkflow);
router.post("/", createModule);
router.put("/:id", updateModule);
router.delete("/:id", deleteModule);

export default router;
