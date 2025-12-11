// backend/controllers/projectController.js
import { pool } from "../config/db.js";

export const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO projects (user_id, name, description) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, name, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE projects SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, description || null, id, req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM projects WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ]);
    res.json({ message: "Project deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete project" });
  }
};
