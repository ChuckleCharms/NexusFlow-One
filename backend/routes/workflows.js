// backend/routes/workflows.js
import express from "express";
import {
  getWorkflowsByProject,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
} from "../controllers/workflowController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/project/:projectId", getWorkflowsByProject);
router.get("/:id", getWorkflowById);
router.post("/", createWorkflow);
router.put("/:id", updateWorkflow);
router.delete("/:id", deleteWorkflow);

export default router;
