// backend/routes/teams.js
import express from "express";
import {
  getTeams,
  createTeam,
  addTeamMember,
  getTeamMembers,
} from "../controllers/teamController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTeams);
router.post("/", createTeam);
router.get("/:teamId/members", getTeamMembers);
router.post("/:teamId/members", addTeamMember);

export default router;
