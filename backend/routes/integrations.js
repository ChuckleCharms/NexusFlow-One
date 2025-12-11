// backend/routes/integrations.js
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
 * GET /api/integrations/catalog
 * Global catalog of supported integrations
 */
router.get("/catalog", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM integrations
      ORDER BY name
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching integration catalog:", err);
    res.status(500).json({ error: "Failed to load integration catalog" });
  }
});

/**
 * POST /api/integrations/catalog
 * Body: { name, type, description }
 */
router.post("/catalog", requireAuth, async (req, res) => {
  try {
    const { name, type, description } = req.body;
    if (!name || !type) {
      return res
        .status(400)
        .json({ error: "name and type are required for an integration" });
    }

    const result = await pool.query(
      `
      INSERT INTO integrations (name, type, description)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, type, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating integration:", err);
    res.status(500).json({ error: "Failed to create integration" });
  }
});

/**
 * GET /api/integrations/tenant/:tenantId
 * Integrations configured for a tenant
 */
router.get("/tenant/:tenantId", requireAuth, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const result = await pool.query(
      `
      SELECT ti.*, i.name, i.type
      FROM tenant_integrations ti
      JOIN integrations i ON ti.integration_id = i.id
      WHERE ti.tenant_id = $1
      ORDER BY i.name
      `,
      [tenantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tenant integrations:", err);
    res.status(500).json({ error: "Failed to load tenant integrations" });
  }
});

/**
 * POST /api/integrations/tenant
 * Body: { tenant_id, integration_id, config_json }
 */
router.post("/tenant", requireAuth, async (req, res) => {
  try {
    const { tenant_id, integration_id, config_json } = req.body;
    if (!tenant_id || !integration_id) {
      return res.status(400).json({
        error: "tenant_id and integration_id are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO tenant_integrations (tenant_id, integration_id, status, config_json)
      VALUES ($1, $2, 'connected', $3::jsonb)
      RETURNING *
      `,
      [tenant_id, integration_id, JSON.stringify(config_json || {})]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error configuring tenant integration:", err);
    res.status(500).json({ error: "Failed to configure tenant integration" });
  }
});

export default router;
