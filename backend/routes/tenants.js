// backend/routes/tenants.js
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
 * GET /api/tenants
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM tenants
      ORDER BY created_at DESC
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tenants:", err);
    res.status(500).json({ error: "Failed to load tenants" });
  }
});

/**
 * POST /api/tenants
 * Body: { name, slug }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }
    const result = await pool.query(
      `
      INSERT INTO tenants (name, slug)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, slug || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating tenant:", err);
    res.status(500).json({ error: "Failed to create tenant" });
  }
});

/**
 * GET /api/tenants/:id/users
 * Show users + roles for a tenant (RBAC view)
 */
router.get("/:id/users", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT u.id AS user_id,
             u.email,
             r.name AS role_name
      FROM user_roles ur
      JOIN users u ON ur.user_id = u.id
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.tenant_id = $1
      ORDER BY u.email
      `,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tenant users:", err);
    res.status(500).json({ error: "Failed to load tenant users" });
  }
});

export default router;
