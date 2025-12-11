// backend/controllers/activityLogController.js
import { pool } from "../config/db.js";

export const getActivityLogs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 200",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
};
