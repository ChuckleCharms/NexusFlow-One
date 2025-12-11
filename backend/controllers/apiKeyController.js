// backend/controllers/apiKeyController.js
import crypto from "crypto";
import { pool } from "../config/db.js";

export const getApiKeys = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, label, created_at FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch API keys" });
  }
};

export const createApiKey = async (req, res) => {
  const { label } = req.body;
  const apiKey = crypto.randomBytes(32).toString("hex");

  try {
    const result = await pool.query(
      "INSERT INTO api_keys (user_id, api_key, label) VALUES ($1, $2, $3) RETURNING id, label, created_at",
      [req.user.id, apiKey, label || null]
    );
    res.status(201).json({ ...result.rows[0], api_key: apiKey });
  } catch {
    res.status(500).json({ error: "Failed to create API key" });
  }
};

export const deleteApiKey = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM api_keys WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ]);
    res.json({ message: "API key deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete API key" });
  }
};
