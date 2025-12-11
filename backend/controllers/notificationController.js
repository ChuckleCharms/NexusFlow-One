// backend/controllers/notificationController.js
import { pool } from "../config/db.js";

export const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to update notification" });
  }
};
