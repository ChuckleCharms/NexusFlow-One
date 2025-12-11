// src/nexusApi.js

// 👉 Put your real backend URL here (Railway)
export const API_URL =
  "https://nexusflowone-backend-production.up.railway.app";

// Example: "https://nexusflow-one-backend.up.railway.app"

// ---------- AUTH ----------

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export async function signup(email, password) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Signup failed");
  }

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// ---------- PROJECTS ----------

export async function getProjects() {
  const res = await fetch(`${API_URL}/api/projects`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load projects");
  }
  return data;
}

export async function createProject(name, description) {
  const res = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ name, description }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create project");
  }
  return data;
}

export async function updateProject(id, name, description, status) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({ name, description, status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update project");
  }
  return data;
}

export async function deleteProject(id) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete project");
  }
  return data;
}

// ---------- WORKFLOWS ----------

export async function getWorkflows(projectId) {
  const res = await fetch(`${API_URL}/api/workflows/project/${projectId}`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load workflows");
  }
  return data;
}

export async function createWorkflow(projectId, name, status = "inactive") {
  const res = await fetch(`${API_URL}/api/workflows`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ project_id: projectId, name, status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create workflow");
  }
  return data;
}

export async function updateWorkflow(id, name, status) {
  const res = await fetch(`${API_URL}/api/workflows/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({ name, status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update workflow");
  }
  return data;
}

export async function deleteWorkflow(id) {
  const res = await fetch(`${API_URL}/api/workflows/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete workflow");
  }
  return data;
}

// ---------- MODULES ----------

export async function getModules(workflowId) {
  const res = await fetch(`${API_URL}/api/modules/workflow/${workflowId}`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load modules");
  }
  return data;
}

export async function createModule(workflowId, moduleType, config) {
  const res = await fetch(`${API_URL}/api/modules`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({
      workflow_id: workflowId,
      module_type: moduleType,
      config_json: config,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create module");
  }
  return data;
}

export async function updateModule(id, moduleType, config) {
  const res = await fetch(`${API_URL}/api/modules/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({
      module_type: moduleType,
      config_json: config,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update module");
  }
  return data;
}

export async function deleteModule(id) {
  const res = await fetch(`${API_URL}/api/modules/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete module");
  }
  return data;
}

// ---------- ACTIVITY LOGS ----------

export async function getActivityLogs() {
  const res = await fetch(`${API_URL}/api/activity-logs`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load activity logs");
  }
  return data;
}

// ---------- NOTIFICATIONS ----------

export async function getNotifications() {
  const res = await fetch(`${API_URL}/api/notifications`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load notifications");
  }
  return data;
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
    method: "POST",
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to mark notification read");
  }
  return data;
}

// ---------- ANALYTICS ----------

export async function getAnalytics() {
  const res = await fetch(`${API_URL}/api/analytics`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load analytics");
  }
  return data;
}

export async function createAnalytics(eventName, eventValue) {
  const res = await fetch(`${API_URL}/api/analytics`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({
      event_name: eventName,
      event_value: eventValue,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create analytics event");
  }
  return data;
}

// ---------- SYSTEM SETTINGS ----------

export async function getSettings() {
  const res = await fetch(`${API_URL}/api/settings`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load settings");
  }
  return data;
}

export async function saveSetting(key, value) {
  const res = await fetch(`${API_URL}/api/settings`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ key, value }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to save setting");
  }
  return data;
}

// ---------- API KEYS ----------

export async function getApiKeys() {
  const res = await fetch(`${API_URL}/api/api-keys`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load API keys");
  }
  return data;
}

export async function createApiKey(label) {
  const res = await fetch(`${API_URL}/api/api-keys`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ label }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create API key");
  }
  return data;
}

export async function deleteApiKey(id) {
  const res = await fetch(`${API_URL}/api/api-keys/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete API key");
  }
  return data;
}
// ---------- EXECUTIONS (RUN HISTORY) ----------

export async function getExecutions() {
  const res = await fetch(`${API_URL}/api/executions`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load executions");
  }
  return data;
}

export async function simulateExecution(workflowId) {
  const res = await fetch(`${API_URL}/api/executions/simulate`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ workflow_id: workflowId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to simulate execution");
  }
  return data;
}

// ---------- TRIGGERS ----------

export async function getTriggers() {
  const res = await fetch(`${API_URL}/api/triggers`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load triggers");
  }
  return data;
}

export async function createTrigger(workflowId, triggerType, config = {}) {
  const res = await fetch(`${API_URL}/api/triggers`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({
      workflow_id: workflowId,
      trigger_type: triggerType,
      config_json: config,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create trigger");
  }
  return data;
}

// ---------- TENANTS ----------

export async function getTenants() {
  const res = await fetch(`${API_URL}/api/tenants`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load tenants");
  }
  return data;
}

export async function createTenant(name, slug) {
  const res = await fetch(`${API_URL}/api/tenants`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ name, slug }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create tenant");
  }
  return data;
}

// ---------- INTEGRATIONS ----------

export async function getIntegrationCatalog() {
  const res = await fetch(`${API_URL}/api/integrations/catalog`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load integration catalog");
  }
  return data;
}

export async function getTenantIntegrations(tenantId) {
  const res = await fetch(`${API_URL}/api/integrations/tenant/${tenantId}`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load tenant integrations");
  }
  return data;
}

// ---------- BLUEPRINTS ----------

export async function getBlueprints() {
  const res = await fetch(`${API_URL}/api/blueprints`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load blueprints");
  }
  return data;
}

export async function createBlueprint(payload) {
  const res = await fetch(`${API_URL}/api/blueprints`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create blueprint");
  }
  return data;
}
