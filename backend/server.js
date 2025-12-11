import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";

// ROUTES (IMPORTS)
import executionsRoutes from "./routes/executions.js";
import triggersRoutes from "./routes/triggers.js";
import tenantsRoutes from "./routes/tenants.js";
import integrationsRoutes from "./routes/integrations.js";
import blueprintsRoutes from "./routes/blueprints.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import workflowRoutes from "./routes/workflows.js";
import moduleRoutes from "./routes/modules.js";
import activityLogRoutes from "./routes/activityLogs.js";
import notificationRoutes from "./routes/notifications.js";
import teamRoutes from "./routes/teams.js";
import messageRoutes from "./routes/messages.js";
import analyticsRoutes from "./routes/analytics.js";
import systemSettingsRoutes from "./routes/systemSettings.js";
import apiKeyRoutes from "./routes/apiKeys.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES (ATTACH TO EXPRESS)
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", systemSettingsRoutes);
app.use("/api/api-keys", apiKeyRoutes);
app.use("/api/executions", executionsRoutes);
app.use("/api/triggers", triggersRoutes);
app.use("/api/tenants", tenantsRoutes);
app.use("/api/integrations", integrationsRoutes);
app.use("/api/blueprints", blueprintsRoutes);

app.get("/", (req, res) => {
  res.send("NexusFlow One Backend Running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
