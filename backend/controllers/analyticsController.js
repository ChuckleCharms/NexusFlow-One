// backend/controllers/analyticsController.js
import { pool } from "../config/db.js";

export const getUserAnalytics = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM analytics WHERE user_id = $1 ORDER BY created_at DESC LIMIT 500",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

export const createAnalyticsEvent = async (req, res) => {
  const { event_name, event_value } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO analytics (user_id, event_name, event_value) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, event_name, event_value || null]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to create analytics event" });
  }
};
