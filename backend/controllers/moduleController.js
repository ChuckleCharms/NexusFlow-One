// backend/controllers/moduleController.js
import { pool } from "../config/db.js";

export const getModulesByWorkflow = async (req, res) => {
  const { workflowId } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.*
       FROM modules m
       JOIN workflows w ON w.id = m.workflow_id
       JOIN projects p ON p.id = w.project_id
       WHERE m.workflow_id = $1 AND p.user_id = $2
       ORDER BY m.created_at DESC`,
      [workflowId, req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch modules" });
  }
};

export const createModule = async (req, res) => {
  const { workflow_id, module_type, config_json } = req.body;
  try {
    const wf = await pool.query(
      `SELECT w.id
       FROM workflows w
       JOIN projects p ON p.id = w.project_id
       WHERE w.id = $1 AND p.user_id = $2`,
      [workflow_id, req.user.id]
    );
    if (!wf.rows.length)
      return res.status(403).json({ error: "Not your workflow" });

    const result = await pool.query(
      "INSERT INTO modules (workflow_id, module_type, config_json) VALUES ($1, $2, $3) RETURNING *",
      [workflow_id, module_type, config_json || {}]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to create module" });
  }
};

export const updateModule = async (req, res) => {
  const { id } = req.params;
  const { module_type, config_json } = req.body;
  try {
    const result = await pool.query(
      `UPDATE modules SET module_type = $1, config_json = $2
       WHERE id = $3 AND workflow_id IN (
         SELECT w.id FROM workflows w
         JOIN projects p ON p.id = w.project_id
         WHERE p.user_id = $4
       )
       RETURNING *`,
      [module_type, config_json || {}, id, req.user.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to update module" });
  }
};

export const deleteModule = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `DELETE FROM modules WHERE id = $1 AND workflow_id IN (
         SELECT w.id FROM workflows w
         JOIN projects p ON p.id = w.project_id
         WHERE p.user_id = $2
       )`,
      [id, req.user.id]
    );
    res.json({ message: "Module deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete module" });
  }
};
