// src/ProjectsPanel.jsx
import React, { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "./nexusApi";

function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  async function loadProjects() {
    setLoading(true);
    setError("");
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const project = await createProject(newName, newDescription);
      setProjects((prev) => [project, ...prev]);
      setNewName("");
      setNewDescription("");
    } catch (err) {
      setError(err.message || "Failed to create project");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete project");
    }
  }

  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Projects Control Panel</h1>
        <p className="nf-page-subtitle">
          These projects represent NexusFlow One environments or customers. Each
          project can host workflows, modules, and analytics.
        </p>
      </header>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Create New Project</h2>
        <form className="nf-controls-row" onSubmit={handleCreate}>
          <div className="nf-control-group">
            <label className="nf-control-label">
              Project Name
              <input
                className="nf-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ACME Corp – Global Automation"
              />
            </label>
          </div>
          <div className="nf-control-group">
            <label className="nf-control-label">
              Description
              <input
                className="nf-input"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief description of what this project runs"
              />
            </label>
          </div>
          <div className="nf-control-group nf-control-inline">
            <button type="submit" className="nf-btn nf-btn-accent">
              Add Project
            </button>
          </div>
        </form>
      </section>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Existing Projects</h2>

        {loading && <div>Loading projects...</div>}
        {error && <div className="nf-error-text">{error}</div>}

        {!loading && projects.length === 0 && !error && (
          <div className="nf-text-muted">
            No projects yet. Use the form above to create your first NexusFlow
            One project environment.
          </div>
        )}

        {projects.length > 0 && (
          <div className="nf-table-wrapper">
            <table className="nf-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.description}</td>
                    <td>{p.status || "active"}</td>
                    <td>
                      {p.created_at
                        ? new Date(p.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="nf-btn nf-btn-outline-sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectsPanel;
