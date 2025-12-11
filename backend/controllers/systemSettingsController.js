// backend/controllers/systemSettingsController.js
import { pool } from "../config/db.js";

export const getAllSettings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM system_settings");
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const upsertSetting = async (req, res) => {
  const { key, value } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO system_settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = now()
       RETURNING *`,
      [key, value]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to upsert setting" });
  }
};
