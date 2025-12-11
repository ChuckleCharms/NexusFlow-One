// backend/routes/blueprints.js
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
 * GET /api/blueprints
 * List all blueprints
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM blueprints
      ORDER BY created_at DESC
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching blueprints:", err);
    res.status(500).json({ error: "Failed to load blueprints" });
  }
});

/**
 * POST /api/blueprints
 * Body: { name, focus_area, summary, layers, tag, definition_json }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, focus_area, summary, layers, tag, definition_json } =
      req.body;
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO blueprints (name, focus_area, summary, layers, tag, definition_json)
      VALUES ($1, $2, $3, $4::integer[], $5, $6::jsonb)
      RETURNING *
      `,
      [
        name,
        focus_area || null,
        summary || null,
        layers || null,
        tag || null,
        JSON.stringify(definition_json || {}),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating blueprint:", err);
    res.status(500).json({ error: "Failed to create blueprint" });
  }
});

export default router;
