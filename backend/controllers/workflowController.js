// backend/controllers/workflowController.js
import { pool } from "../config/db.js";

export const getWorkflowsByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await pool.query(
      `SELECT w.* 
       FROM workflows w
       JOIN projects p ON p.id = w.project_id
       WHERE w.project_id = $1 AND p.user_id = $2
       ORDER BY w.created_at DESC`,
      [projectId, req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch workflows" });
  }
};

export const getWorkflowById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT w.* 
       FROM workflows w
       JOIN projects p ON p.id = w.project_id
       WHERE w.id = $1 AND p.user_id = $2`,
      [id, req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch workflow" });
  }
};

export const createWorkflow = async (req, res) => {
  const { project_id, name, status } = req.body;
  try {
    // ensure project belongs to user
    const proj = await pool.query(
      "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
      [project_id, req.user.id]
    );
    if (!proj.rows.length)
      return res.status(403).json({ error: "Not your project" });

    const result = await pool.query(
      "INSERT INTO workflows (project_id, name, status) VALUES ($1, $2, $3) RETURNING *",
      [project_id, name, status || "inactive"]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to create workflow" });
  }
};

export const updateWorkflow = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE workflows SET name = $1, status = $2
       WHERE id = $3 AND project_id IN 
         (SELECT id FROM projects WHERE user_id = $4)
       RETURNING *`,
      [name, status, id, req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to update workflow" });
  }
};

export const deleteWorkflow = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `DELETE FROM workflows 
       WHERE id = $1 AND project_id IN 
         (SELECT id FROM projects WHERE user_id = $2)`,
      [id, req.user.id]
    );
    res.json({ message: "Workflow deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete workflow" });
  }
};
