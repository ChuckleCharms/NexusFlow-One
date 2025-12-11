// backend/routes/triggers.js
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
 * GET /api/triggers
 * List triggers (cron, webhook, api, manual)
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT t.*, w.name AS workflow_name
      FROM triggers t
      LEFT JOIN workflows w ON t.workflow_id = w.id
      ORDER BY t.created_at DESC
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching triggers:", err);
    res.status(500).json({ error: "Failed to load triggers" });
  }
});

/**
 * POST /api/triggers
 * Body: { workflow_id, trigger_type, config_json }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { workflow_id, trigger_type, config_json } = req.body;
    if (!workflow_id || !trigger_type) {
      return res
        .status(400)
        .json({ error: "workflow_id and trigger_type are required" });
    }

    const insert = await pool.query(
      `
      INSERT INTO triggers (workflow_id, tenant_id, trigger_type, config_json, is_active)
      VALUES ($1, NULL, $2, $3::jsonb, TRUE)
      RETURNING *
      `,
      [workflow_id, trigger_type, JSON.stringify(config_json || {})]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Error creating trigger:", err);
    res.status(500).json({ error: "Failed to create trigger" });
  }
});

/**
 * PATCH /api/triggers/:id/toggle
 */
router.patch("/:id/toggle", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      UPDATE triggers
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Trigger not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error toggling trigger:", err);
    res.status(500).json({ error: "Failed to toggle trigger" });
  }
});

export default router;
