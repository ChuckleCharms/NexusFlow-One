// backend/routes/executions.js
import express from "express";
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({ error: "Missing auth token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * GET /api/executions
 * List recent workflow executions (for dashboards)
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT we.*, w.name AS workflow_name
      FROM workflow_executions we
      LEFT JOIN workflows w ON we.workflow_id = w.id
      ORDER BY we.started_at DESC
      LIMIT 50
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching executions:", err);
    res.status(500).json({ error: "Failed to load executions" });
  }
});

/**
 * POST /api/executions/simulate
 * Create a simulated execution record for a workflow (to match your CU's "Run Simulation")
 * Body: { workflow_id }
 */
router.post("/simulate", requireAuth, async (req, res) => {
  try {
    const { workflow_id } = req.body;
    if (!workflow_id) {
      return res.status(400).json({ error: "workflow_id is required" });
    }

    // In a real engine, you would actually run the workflow.
    // Here we just create a success record with a fake duration.
    const durationMs = Math.floor(Math.random() * 1000) + 200;

    const insert = await pool.query(
      `
      INSERT INTO workflow_executions (workflow_id, tenant_id, status, started_at, finished_at, duration_ms)
      VALUES ($1, NULL, 'success', NOW(), NOW(), $2)
      RETURNING *
      `,
      [workflow_id, durationMs]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Error simulating execution:", err);
    res.status(500).json({ error: "Failed to simulate execution" });
  }
});

export default router;
