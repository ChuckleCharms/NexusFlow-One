// backend/controllers/messageController.js
import { pool } from "../config/db.js";

export const getMessagesWithUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [req.user.id, userId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  const { receiver_id, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, receiver_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to send message" });
  }
};
