// src/App.jsx
import React, { useState, useMemo } from "react";

const ROLES = [
  "CEO",
  "COO",
  "CFO",
  "CMO",
  "Head of Sales",
  "Head of Operations",
  "Head of HR",
  "Head of Compliance",
  "CTO / CIO",
  "Customer Portal",
];

const TENANTS = ["Global Workspace", "ACME Corp", "Internal Sandbox"];

const PAGES = {
  OVERVIEW: "Overview",
  OPERATIONS: "Operations",
  WORKFLOWS: "Workflows",
  ANALYTICS: "Analytics",
  AI_BRAIN: "AI Brain",
  FINANCE: "Finance",
  SALES: "Sales",
  MARKETING: "Marketing",
  HR: "HR & People",
  USERS: "Users & Access",
  INTEGRATIONS: "Integration Hub",
  AI_MODELS: "AI & Models",
  DATA_SCHEMA: "Data & Schema",
  ACTIVITY: "Activity & Audit",
  BLUEPRINTS: "Blueprints Library",
  LEGAL: "Legal & IP",
  SETTINGS: "System Settings",
  HELP: "Help & Onboarding",
};

const sampleWorkflows = [
  {
    id: "wf-001",
    name: "Lead Nurturing & Sales Handoff",
    category: "Sales & Marketing",
    status: "Active",
    type: "revenue",
    nodes: [
      "Trigger: New Lead",
      "AI Enrichment Node",
      "Scoring Module",
      "Nurture Sequence",
      "Handoff to CRM",
    ],
    sla: "Under 5 minutes",
    owner: "Sales Operations",
  },
  {
    id: "wf-002",
    name: "Customer Onboarding Journey",
    category: "Operations",
    status: "Active",
    type: "customer",
    nodes: [
      "Application Intake",
      "Document Parsing",
      "AI Risk Evaluation Node",
      "KYC Module",
      "Account Activation",
    ],
    sla: "Same day",
    owner: "Operations",
  },
  {
    id: "wf-003",
    name: "Invoice-to-Cash Automation",
    category: "Finance",
    status: "Active",
    type: "finance",
    nodes: [
      "Invoice Generation Node",
      "Email Dispatch",
      "Payment Reconciliation",
      "Reminder & Escalation Flow",
    ],
    sla: "Real time",
    owner: "Finance",
  },
  {
    id: "wf-004",
    name: "AI-Based Support Routing",
    category: "Customer Success",
    status: "Pilot",
    type: "customer",
    nodes: [
      "Ticket Ingest",
      "Intent Classifier",
      "Sentiment Node",
      "Priority Routing",
      "Agent Assignment",
    ],
    sla: "Instant",
    owner: "Customer Success",
  },
];

const sampleUsers = [
  {
    name: "Maria Robles",
    email: "maria@nexusflow.one",
    role: "Owner / Admin",
    tenant: "Global Workspace",
    status: "Active",
    lastLogin: "Today",
  },
  {
    name: "Alex Rivera",
    email: "alex@acme.com",
    role: "Tenant Admin",
    tenant: "ACME Corp",
    status: "Active",
    lastLogin: "Yesterday",
  },
  {
    name: "Priya Shah",
    email: "priya@internal",
    role: "Engineer",
    tenant: "Internal Sandbox",
    status: "Active",
    lastLogin: "2 days ago",
  },
  {
    name: "Jordan Lee",
    email: "jordan@sales",
    role: "Head of Sales",
    tenant: "ACME Corp",
    status: "Invited",
    lastLogin: "-",
  },
];

const sampleIntegrations = [
  {
    name: "Salesforce CRM",
    type: "CRM",
    status: "Connected",
    lastSync: "5 min ago",
    tenant: "ACME Corp",
  },
  {
    name: "Stripe",
    type: "Payments",
    status: "Connected",
    lastSync: "12 min ago",
    tenant: "Global Workspace",
  },
  {
    name: "HubSpot",
    type: "Marketing",
    status: "Not Connected",
    lastSync: "-",
    tenant: "Global Workspace",
  },
  {
    name: "Zendesk",
    type: "Support",
    status: "Connected",
    lastSync: "2 min ago",
    tenant: "ACME Corp",
  },
];

const sampleModels = [
  {
    provider: "OpenAI-style LLM",
    model: "Enterprise-GPT",
    role: "Primary Reasoning",
    status: "Healthy",
    latency: "480 ms",
  },
  {
    provider: "Claude-style Model",
    model: "Decision-XL",
    role: "Risk & Compliance Flows",
    status: "Healthy",
    latency: "520 ms",
  },
  {
    provider: "Local LLM",
    model: "Nexus-Local-13B",
    role: "Internal, Low-Cost Flows",
    status: "Warm Standby",
    latency: "650 ms",
  },
];

const sampleActivity = [
  {
    time: "09:12",
    actor: "Maria Robles",
    type: "Deployment",
    detail: "Workflow 'Invoice-to-Cash' promoted to production.",
    risk: "Low",
  },
  {
    time: "08:47",
    actor: "Alex Rivera",
    type: "Access Change",
    detail: "New user 'Jordan Lee' invited as 'Head of Sales' for ACME Corp.",
    risk: "Medium",
  },
  {
    time: "08:20",
    actor: "System",
    type: "AI Config",
    detail: "Primary LLM provider latency increased slightly above baseline.",
    risk: "Low",
  },
  {
    time: "07:58",
    actor: "System",
    type: "Error Cluster",
    detail: "3 failed API calls in Data Pipeline 'Daily CRM Sync'.",
    risk: "High",
  },
];

const sampleBlueprints = [
  {
    name: "Finance Automation Blueprint",
    tag: "Efficiency",
    summary:
      "Automate invoice-to-cash, approvals, and reporting across entities.",
    layers: [4, 6, 7, 10, 12, 14],
    focus: "Finance",
  },
  {
    name: "Sales Funnel Blueprint",
    tag: "Growth",
    summary: "End-to-end lead-to-customer journey with AI scoring and routing.",
    layers: [3, 6, 7, 8, 9, 10],
    focus: "Sales",
  },
  {
    name: "Customer Onboarding Blueprint",
    tag: "Customer",
    summary: "Document ingest, approvals, risk checks, and welcome sequences.",
    layers: [4, 5, 6, 7, 8, 12],
    focus: "Operations",
  },
  {
    name: "Compliance & Audit Blueprint",
    tag: "Risk",
    summary: "Locked workflows, full logging, and audit-friendly reporting.",
    layers: [5, 10, 12, 13],
    focus: "Compliance",
  },
];

const dataEntities = [
  {
    name: "Workflows",
    table: "workflows",
    purpose: "Stores all workflow definitions, metadata, and version history.",
    keyFields: [
      "id",
      "name",
      "category",
      "status",
      "tenant_id",
      "definition_json",
    ],
  },
  {
    name: "Modules",
    table: "modules",
    purpose: "Defines functional building blocks grouped by purpose and layer.",
    keyFields: [
      "id",
      "name",
      "layer",
      "category",
      "input_schema",
      "output_schema",
    ],
  },
  {
    name: "Nodes",
    table: "nodes",
    purpose: "Atomic execution steps within workflows and modules.",
    keyFields: ["id", "workflow_id", "type", "position", "config_json"],
  },
  {
    name: "Executions",
    table: "executions",
    purpose: "Stores every workflow run, including status and metrics.",
    keyFields: [
      "id",
      "workflow_id",
      "tenant_id",
      "status",
      "duration_ms",
      "started_at",
      "finished_at",
    ],
  },
  {
    name: "Logs",
    table: "logs",
    purpose: "Event, error, and audit logs for compliance and debugging.",
    keyFields: [
      "id",
      "entity_type",
      "entity_id",
      "message",
      "level",
      "created_at",
    ],
  },
];

function App() {
  const [activeRole, setActiveRole] = useState("CEO");
  const [activeTenant, setActiveTenant] = useState("Global Workspace");
  const [activePage, setActivePage] = useState(PAGES.OVERVIEW);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchablePages = Object.values(PAGES);
  const searchableWorkflows = sampleWorkflows;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { pages: [], workflows: [] };
    const q = searchQuery.toLowerCase();

    const pages = searchablePages.filter((p) => p.toLowerCase().includes(q));
    const workflows = searchableWorkflows.filter((w) =>
      w.name.toLowerCase().includes(q)
    );

    return { pages, workflows };
  }, [searchQuery]);

  const handleOpenSearch = () => {
    setShowSearch(true);
    setSearchQuery("");
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  return (
    <div className="nf-app">
      <TopBar
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        activeTenant={activeTenant}
        onTenantChange={setActiveTenant}
        activePage={activePage}
        onOpenSearch={handleOpenSearch}
      />
      <div className="nf-layout">
        <Sidebar activePage={activePage} onChangePage={setActivePage} />
        <main className="nf-main">
          <PageRouter
            activePage={activePage}
            activeRole={activeRole}
            activeTenant={activeTenant}
          />
        </main>
      </div>
      <footer className="nf-footer">
        <div>
          © {new Date().getFullYear()} Maria Robles – All Rights Reserved.
        </div>
        <div className="nf-footer-sub">
          NexusFlow One • 19-Layer AI Workflow Automation • 640+ Modules •
          3,000+ Workflows • 3,000+ Nodes
        </div>
      </footer>

      {showSearch && (
        <SearchOverlay
          query={searchQuery}
          onChangeQuery={setSearchQuery}
          results={searchResults}
          onClose={handleCloseSearch}
          onSelectPage={(page) => {
            setActivePage(page);
            handleCloseSearch();
          }}
        />
      )}
    </div>
  );
}

/* ----------------- Top Bar ----------------- */

function TopBar({
  activeRole,
  onRoleChange,
  activeTenant,
  onTenantChange,
  activePage,
  onOpenSearch,
}) {
  return (
    <header className="nf-topbar">
      <div className="nf-brand">
        <div className="nf-logo-dot" />
        <div>
          <div className="nf-brand-title">NexusFlow One</div>
          <div className="nf-brand-subtitle">
            Enterprise AI Workflow &amp; Business Automation Control Unit
          </div>
        </div>
      </div>
      <div className="nf-topbar-center">
        <div className="nf-topbar-page">{activePage}</div>
        <div className="nf-topbar-pill">
          19 Layers · 640+ Modules · 3,000+ Workflows · 3,000+ Nodes
        </div>
      </div>
      <div className="nf-topbar-right">
        <div className="nf-role-select-wrap">
          <label className="nf-role-label">Workspace</label>
          <select
            className="nf-role-select"
            value={activeTenant}
            onChange={(e) => onTenantChange(e.target.value)}
          >
            {TENANTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="nf-role-select-wrap">
          <label className="nf-role-label">Active Login</label>
          <select
            className="nf-role-select"
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="nf-topbar-actions">
          <button className="nf-btn nf-btn-outline" onClick={onOpenSearch}>
            Search / Command
          </button>
          <button
            className="nf-btn nf-btn-outline"
            onClick={() =>
              alert(
                "Notifications center would show deployments, failures, and AI config changes in production."
              )
            }
          >
            Notifications
          </button>
          <button className="nf-btn nf-btn-accent">Run Scenario</button>
        </div>
      </div>
    </header>
  );
}

/* ----------------- Sidebar ----------------- */

function Sidebar({ activePage, onChangePage }) {
  const groups = [
    {
      label: "Executive",
      pages: [
        PAGES.OVERVIEW,
        PAGES.ANALYTICS,
        PAGES.AI_BRAIN,
        PAGES.BLUEPRINTS,
      ],
    },
    {
      label: "Operations & Growth",
      pages: [
        PAGES.OPERATIONS,
        PAGES.WORKFLOWS,
        PAGES.FINANCE,
        PAGES.SALES,
        PAGES.MARKETING,
        PAGES.HR,
      ],
    },
    {
      label: "Platform & Governance",
      pages: [
        PAGES.USERS,
        PAGES.INTEGRATIONS,
        PAGES.AI_MODELS,
        PAGES.DATA_SCHEMA,
        PAGES.ACTIVITY,
        PAGES.LEGAL,
        PAGES.SETTINGS,
        PAGES.HELP,
      ],
    },
  ];

  return (
    <aside className="nf-sidebar">
      {groups.map((group) => (
        <div key={group.label} className="nf-sidebar-group">
          <div className="nf-sidebar-group-label">{group.label}</div>
          {group.pages.map((page) => (
            <button
              key={page}
              className={`nf-sidebar-item ${
                activePage === page ? "nf-sidebar-item-active" : ""
              }`}
              onClick={() => onChangePage(page)}
            >
              <span className="nf-sidebar-item-dot" />
              <span>{page}</span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

/* ----------------- Search Overlay ----------------- */

function SearchOverlay({
  query,
  onChangeQuery,
  results,
  onClose,
  onSelectPage,
}) {
  return (
    <div className="nf-search-overlay">
      <div className="nf-search-panel">
        <div className="nf-search-header">
          <span className="nf-search-title">Global Search & Command</span>
          <button className="nf-search-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          className="nf-search-input"
          placeholder="Search pages, workflows..."
        />
        <div className="nf-search-body">
          <div className="nf-search-section">
            <div className="nf-search-section-title">Pages</div>
            {results.pages.length === 0 && (
              <div className="nf-search-empty">No pages match yet.</div>
            )}
            {results.pages.map((p) => (
              <button
                key={p}
                className="nf-search-result"
                onClick={() => onSelectPage(p)}
              >
                <span className="nf-search-result-label">{p}</span>
                <span className="nf-search-result-meta">Go to page</span>
              </button>
            ))}
          </div>
          <div className="nf-search-section">
            <div className="nf-search-section-title">Workflows</div>
            {results.workflows.length === 0 && (
              <div className="nf-search-empty">No workflows match yet.</div>
            )}
            {results.workflows.map((wf) => (
              <div
                key={wf.id}
                className="nf-search-result nf-search-result-static"
              >
                <span className="nf-search-result-label">{wf.name}</span>
                <span className="nf-search-result-meta">
                  {wf.category} · {wf.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Page Router ----------------- */

function PageRouter({ activePage, activeRole, activeTenant }) {
  switch (activePage) {
    case PAGES.OVERVIEW:
      return (
        <OverviewPage activeRole={activeRole} activeTenant={activeTenant} />
      );
    case PAGES.OPERATIONS:
      return <OperationsPage />;
    case PAGES.WORKFLOWS:
      return <WorkflowsPage />;
    case PAGES.ANALYTICS:
      return <AnalyticsPage />;
    case PAGES.AI_BRAIN:
      return <AIBrainPage />;
    case PAGES.FINANCE:
      return <FinancePage />;
    case PAGES.SALES:
      return <SalesPage />;
    case PAGES.MARKETING:
      return <MarketingPage />;
    case PAGES.HR:
      return <HRPage />;
    case PAGES.USERS:
      return <UsersPage />;
    case PAGES.INTEGRATIONS:
      return <IntegrationHubPage />;
    case PAGES.AI_MODELS:
      return <AIModelsPage />;
    case PAGES.DATA_SCHEMA:
      return <DataSchemaPage />;
    case PAGES.ACTIVITY:
      return <ActivityPage />;
    case PAGES.BLUEPRINTS:
      return <BlueprintsPage />;
    case PAGES.LEGAL:
      return <LegalPage />;
    case PAGES.SETTINGS:
      return <SettingsPage />;
    case PAGES.HELP:
      return <HelpPage />;
    default:
      return (
        <OverviewPage activeRole={activeRole} activeTenant={activeTenant} />
      );
  }
}

/* ----------------- Overview Page ----------------- */

function OverviewPage({ activeRole, activeTenant }) {
  const [timeRange, setTimeRange] = useState("30d");
  const [scenario, setScenario] = useState("efficiency");

  const summaryCards = [
    {
      label: "Layers Online",
      value: 19,
      desc: "Complete 19-layer architecture across UI, AI, data, security, and deployment.",
    },
    {
      label: "Modules Available",
      value: 640,
      suffix: "+",
      desc: "Reusable logic blocks for automations, integrations, and governance.",
    },
    {
      label: "Workflows Defined",
      value: 3000,
      suffix: "+",
      desc: "Mapped processes for revenue, operations, risk, and customer experience.",
    },
    {
      label: "Execution Nodes",
      value: 3000,
      suffix: "+",
      desc: "Atomic AI and automation steps orchestrated by the workflow engine.",
    },
  ];

  const roleText = {
    CEO: "As CEO, this view shows strategic impact: automation coverage, IP value, risk control, and revenue leverage.",
    COO: "As COO, you see throughput, cycle time reduction, and failure rates across mission-critical workflows.",
    CFO: "As CFO, you monitor cost savings, AI spend, and financial control layers tied to automation.",
    CMO: "As CMO, you track campaign orchestration, funnel conversion, and personalized journeys.",
    "Head of Sales":
      "As Head of Sales, you focus on pipeline velocity, lead routing, and follow-up automation.",
    "Head of Operations":
      "As Head of Operations, you track task automation, SLAs, and removal of manual bottlenecks.",
    "Head of HR":
      "As Head of HR, you oversee employee lifecycle workflows, access provisioning, and compliance training.",
    "Head of Compliance":
      "As Head of Compliance, you inspect logging, auditability, and policy enforcement inside workflows.",
    "CTO / CIO":
      "As CTO/CIO, you manage stack integrity, integrations, security, and scalability of the engine.",
    "Customer Portal":
      "As a customer, you view workflow status, SLAs, and self-service automation for your requests.",
  };

  const scenarioDescription = {
    efficiency:
      "Efficiency mode highlights cycle-time reductions, manual task removal, and automation coverage across departments.",
    growth:
      "Growth mode focuses on revenue acceleration, lead-to-cash flows, and activation of new productized automations.",
    risk: "Risk mode emphasizes control, auditability, and protection through policy-locked workflows and compliance layers.",
  };

  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Executive Command Overview</h1>
        <p className="nf-page-subtitle">
          NexusFlow One operates as a 19-layer AI workflow automation engine
          with full IP ownership, allowing <strong>{activeTenant}</strong> to
          control every workflow, node, and decision path.
        </p>
      </header>

      <section className="nf-controls-row">
        <div className="nf-control-group">
          <label className="nf-control-label">Time Range</label>
          <select
            className="nf-control-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="365d">Last 12 months</option>
          </select>
        </div>
        <div className="nf-control-group">
          <label className="nf-control-label">Scenario Focus</label>
          <select
            className="nf-control-select"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            <option value="efficiency">Operational Efficiency</option>
            <option value="growth">Revenue Growth</option>
            <option value="risk">Risk & Compliance</option>
          </select>
        </div>
        <div className="nf-control-group nf-control-inline">
          <button className="nf-btn nf-btn-outline-sm">Export Summary</button>
          <button className="nf-btn nf-btn-outline-sm">Share Exec View</button>
        </div>
      </section>

      <section className="nf-grid nf-grid-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="nf-card nf-card-highlight">
            <div className="nf-card-label">{card.label}</div>
            <div className="nf-card-value">
              {card.value.toLocaleString()}
              {card.suffix || ""}
            </div>
            <div className="nf-card-desc">{card.desc}</div>
          </div>
        ))}
      </section>

      <section className="nf-grid nf-grid-2 nf-section-space">
        <div className="nf-card">
          <h2 className="nf-card-title">Role-Based Perspective</h2>
          <p className="nf-card-body">
            <strong>Active login:</strong> {activeRole}
          </p>
          <p className="nf-card-body nf-text-muted">{roleText[activeRole]}</p>
          <p className="nf-card-body nf-text-muted">
            Each role surfaces the same automation engine through a different
            lens: executives see value and risk, operators see processes and
            SLAs, and engineers see architecture and load.
          </p>
        </div>

        <div className="nf-card">
          <h2 className="nf-card-title">Scenario Summary</h2>
          <p className="nf-card-body nf-text-muted">
            {scenarioDescription[scenario]}
          </p>
          <ul className="nf-list">
            <li>
              Triggers (API calls, cron jobs, webhooks, or AI requests) initiate
              workflows.
            </li>
            <li>
              The Workflow Engine executes node-by-node, combining modules, AI,
              and business rules.
            </li>
            <li>
              Analytics, logging, and feedback layers capture outcomes and tune
              future runs.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Operations Page ----------------- */

function OperationsPage() {
  const [opsFilter, setOpsFilter] = useState("all");

  const opsRows = [
    {
      domain: "Customer Onboarding",
      coverage: "High",
      workflows: 58,
      owner: "Operations",
      status: "Stable",
      category: "customer",
      comment:
        "KYC, document ingestion, approvals, and welcome flows are fully automated with human-review nodes where required.",
    },
    {
      domain: "Internal Processes",
      coverage: "Medium",
      workflows: 34,
      owner: "HR & Operations",
      status: "Scaling",
      category: "internal",
      comment:
        "Onboarding, offboarding, asset assignment, and compliance acknowledgments are rolled out in waves.",
    },
    {
      domain: "Support & Tickets",
      coverage: "High",
      workflows: 41,
      owner: "Customer Success",
      status: "Optimized",
      category: "customer",
      comment:
        "AI triage and routing flows cut response time while keeping complex cases in human queues with full context.",
    },
    {
      domain: "Data Pipelines",
      coverage: "Medium",
      workflows: 27,
      owner: "Data & Engineering",
      status: "In Rollout",
      category: "internal",
      comment:
        "Stream and batch workflows move data between systems, with checks for schema drift and data quality.",
    },
  ];

  const filteredRows =
    opsFilter === "all"
      ? opsRows
      : opsRows.filter((row) => row.category === opsFilter);

  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Operational Coverage</h1>
        <p className="nf-page-subtitle">
          Map NexusFlow One&apos;s 3,000+ workflows against real business
          operations and identify where to automate next.
        </p>
      </header>

      <section className="nf-controls-row">
        <div className="nf-control-group">
          <label className="nf-control-label">View</label>
          <select
            className="nf-control-select"
            value={opsFilter}
            onChange={(e) => setOpsFilter(e.target.value)}
          >
            <option value="all">All domains</option>
            <option value="customer">Customer-facing</option>
            <option value="internal">Internal operations</option>
          </select>
        </div>
        <div className="nf-control-group nf-control-inline">
          <button className="nf-btn nf-btn-outline-sm">Add Domain Plan</button>
          <button className="nf-btn nf-btn-outline-sm">
            Download Ops Blueprint
          </button>
        </div>
      </section>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Automation Coverage by Domain</h2>
        <div className="nf-table-wrapper">
          <table className="nf-table">
            <thead>
              <tr>
                <th>Operational Domain</th>
                <th>Coverage</th>
                <th>Workflows</th>
                <th>Primary Owner</th>
                <th>Health</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.domain}>
                  <td>{row.domain}</td>
                  <td>{row.coverage}</td>
                  <td>{row.workflows}</td>
                  <td>{row.owner}</td>
                  <td>{row.status}</td>
                  <td>{row.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Workflows Page ----------------- */

function WorkflowsPage() {
  const [selectedId, setSelectedId] = useState(sampleWorkflows[0].id);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = sampleWorkflows.filter((wf) => {
    if (statusFilter !== "all" && wf.status.toLowerCase() !== statusFilter) {
      return false;
    }
    if (typeFilter !== "all" && wf.type !== typeFilter) {
      return false;
    }
    return true;
  });

  const selected =
    filtered.find((w) => w.id === selectedId) ||
    filtered[0] ||
    sampleWorkflows[0];

  const handleSimulate = () => {
    alert(
      `Simulation started for workflow: "${selected.name}".\n\n` +
        "In production, this would run all nodes in sandbox mode, log execution details, and report impact before rollout."
    );
  };

  return (
    <div className="nf-page nf-page-split">
      <div className="nf-page-split-left">
        <header className="nf-page-header">
          <h1 className="nf-page-title">Workflow Catalog</h1>
          <p className="nf-page-subtitle">
            Explore representative workflows from the 3,000+ included in
            NexusFlow One. Each can be extended or cloned.
          </p>
        </header>

        <section className="nf-controls-row">
          <div className="nf-control-group">
            <label className="nf-control-label">Status</label>
            <select
              className="nf-control-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="pilot">Pilot</option>
            </select>
          </div>
          <div className="nf-control-group">
            <label className="nf-control-label">Type</label>
            <select
              className="nf-control-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="revenue">Revenue</option>
              <option value="customer">Customer</option>
              <option value="finance">Finance</option>
            </select>
          </div>
        </section>

        <ul className="nf-list-workflows">
          {filtered.map((wf) => (
            <li key={wf.id}>
              <button
                className={`nf-workflow-item ${
                  wf.id === selected.id ? "nf-workflow-item-active" : ""
                }`}
                onClick={() => setSelectedId(wf.id)}
              >
                <div className="nf-workflow-title">{wf.name}</div>
                <div className="nf-workflow-meta">
                  <span>{wf.category}</span>
                  <span>•</span>
                  <span>{wf.status}</span>
                  <span>•</span>
                  <span>{wf.owner}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="nf-page-split-right">
        <div className="nf-card nf-card-detail">
          <h2 className="nf-card-title">{selected.name}</h2>
          <p className="nf-card-body nf-text-muted">
            This workflow is one of the 3,000+ sequences included in NexusFlow
            One. Each workflow chains nodes, modules, and AI layers into a
            deterministic business outcome.
          </p>

          <div className="nf-grid nf-grid-3 nf-section-space">
            <div className="nf-mini-card">
              <div className="nf-mini-label">Category</div>
              <div className="nf-mini-value">{selected.category}</div>
            </div>
            <div className="nf-mini-card">
              <div className="nf-mini-label">Owner</div>
              <div className="nf-mini-value">{selected.owner}</div>
            </div>
            <div className="nf-mini-card">
              <div className="nf-mini-label">SLA Target</div>
              <div className="nf-mini-value">{selected.sla}</div>
            </div>
          </div>

          <div className="nf-section-space">
            <h3 className="nf-section-title">Node Chain</h3>
            <p className="nf-card-body nf-text-muted">
              Nodes are the smallest execution units in NexusFlow One: they
              orchestrate triggers, AI decisions, data operations, and outbound
              actions step by step.
            </p>
            <div className="nf-node-chain">
              {selected.nodes.map((node, index) => (
                <React.Fragment key={node}>
                  <div className="nf-node-pill">{node}</div>
                  {index < selected.nodes.length - 1 && (
                    <span className="nf-node-arrow">➜</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="nf-section-space nf-workflow-actions">
            <button className="nf-btn nf-btn-accent" onClick={handleSimulate}>
              Run Workflow Simulation
            </button>
            <button className="nf-btn nf-btn-outline">
              Duplicate Workflow
            </button>
            <button className="nf-btn nf-btn-outline">Export Definition</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Analytics Page ----------------- */

function AnalyticsPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Automation Analytics & Insights</h1>
        <p className="nf-page-subtitle">
          NexusFlow One tracks every execution to give a full picture of
          performance, reliability, AI usage, and business impact.
        </p>
      </header>

      <section className="nf-grid nf-grid-3 nf-section-space">
        <div className="nf-card">
          <h2 className="nf-card-title">Execution Health</h2>
          <ul className="nf-list">
            <li>
              99.97% successful workflow executions across the last 30 days.
            </li>
            <li>
              Automatic retries and fallback paths for transient failures.
            </li>
            <li>
              Heatmaps by layer, module, and node to pinpoint systemic issues.
            </li>
          </ul>
        </div>
        <div className="nf-card">
          <h2 className="nf-card-title">AI Utilization</h2>
          <ul className="nf-list">
            <li>
              AI Intelligence Layer invoked for 72% of workflows in production.
            </li>
            <li>
              Decision nodes log reasoning paths for auditability and tuning.
            </li>
            <li>
              Cost/performance metrics per provider to adjust model strategy.
            </li>
          </ul>
        </div>
        <div className="nf-card">
          <h2 className="nf-card-title">Business Impact</h2>
          <ul className="nf-list">
            <li>Hours of manual work replaced each week across teams.</li>
            <li>
              Time-to-decision compressed from days to seconds for key flows.
            </li>
            <li>
              Ownable IP increases enterprise valuation versus rented SaaS
              flows.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ----------------- AI Brain Page ----------------- */

function AIBrainPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">AI Intelligence & Decision Layer</h1>
        <p className="nf-page-subtitle">
          Layers 3, 8, and 15 form the AI brain: prompt logic, decision routing,
          and continuous optimization.
        </p>
      </header>

      <section className="nf-grid nf-grid-2 nf-section-space">
        <div className="nf-card">
          <h2 className="nf-card-title">AI Logic & Routing</h2>
          <ul className="nf-list">
            <li>
              Prompt logic engine with structured instruction stacks per
              workflow.
            </li>
            <li>
              Context windows managed to avoid hallucination and maintain
              traceability.
            </li>
            <li>
              Model-agnostic routing (OpenAI-style, Claude, Gemini, local LLMs).
            </li>
          </ul>
        </div>
        <div className="nf-card">
          <h2 className="nf-card-title">Feedback & Self-Improvement</h2>
          <ul className="nf-list">
            <li>
              Layer 15 captures outcomes, quality signals, and exception
              patterns.
            </li>
            <li>
              High-value workflows can require human sign-off for AI-suggested
              changes.
            </li>
            <li>
              All AI decisions are logged with structured metadata for
              governance.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Finance Page ----------------- */

function FinancePage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Finance Automation Console</h1>
        <p className="nf-page-subtitle">
          NexusFlow One automates invoice-to-cash, approvals, financial
          reporting, and forecasting—under full CFO control.
        </p>
      </header>

      <section className="nf-grid nf-grid-2 nf-section-space">
        <div className="nf-card">
          <h2 className="nf-card-title">Key Finance Workflows</h2>
          <ul className="nf-list">
            <li>
              Automated invoice generation, delivery, and payment
              reconciliation.
            </li>
            <li>
              Spend approvals with policy-based routing and escalation rules.
            </li>
            <li>
              Recurring and on-demand closing workflows with scheduled
              reporting.
            </li>
          </ul>
        </div>
        <div className="nf-card">
          <h2 className="nf-card-title">CFO Control Panel</h2>
          <ul className="nf-list">
            <li>
              Full visibility into AI spend and provider usage by workflow.
            </li>
            <li>
              Audit logs kept by the Logging & Monitoring Layer for all finance
              actions.
            </li>
            <li>
              Multi-entity support with separate ledgers and consolidation
              workflows.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Sales Page ----------------- */

function SalesPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Sales Pipeline Automation</h1>
        <p className="nf-page-subtitle">
          From lead capture to renewal, NexusFlow One runs the automations that
          keep your pipeline moving.
        </p>
      </header>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Sales Automation Highlights</h2>
        <ul className="nf-list">
          <li>
            Lead routing based on territory, segment, intent, and deal size.
          </li>
          <li>
            Automatic follow-up sequences with AI-personalized emails and tasks.
          </li>
          <li>
            Opportunity scoring using engagement and product usage signals.
          </li>
          <li>
            Renewal workflows that coordinate success, finance, and product
            teams.
          </li>
        </ul>
      </section>
    </div>
  );
}

/* ----------------- Marketing Page ----------------- */

function MarketingPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Marketing Orchestration Hub</h1>
        <p className="nf-page-subtitle">
          Coordinate campaigns, content, and journeys with AI as the
          orchestration engine.
        </p>
      </header>

      <section className="nf-grid nf-grid-2 nf-section-space">
        <div className="nf-card">
          <h2 className="nf-card-title">Campaign Automation</h2>
          <ul className="nf-list">
            <li>
              Launch, monitor, and optimize campaigns with multi-step automation
              flows.
            </li>
            <li>
              AI nodes generate copy variants and auto-promote winning
              creatives.
            </li>
            <li>
              Attribution workflows link outcomes back to pipeline and revenue.
            </li>
          </ul>
        </div>
        <div className="nf-card">
          <h2 className="nf-card-title">Customer Journeys</h2>
          <ul className="nf-list">
            <li>
              Lifecycle journeys built around onboarding, adoption, and
              expansion.
            </li>
            <li>
              Cross-channel orchestration (email, in-app, SMS, chatbots, ads).
            </li>
            <li>
              Churn-risk journeys hand off accounts to success and sales
              workflows.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ----------------- HR Page ----------------- */

function HRPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">HR & People Operations</h1>
        <p className="nf-page-subtitle">
          Automate the employee lifecycle under clear, auditable workflows—from
          offer to offboarding.
        </p>
      </header>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Core HR Workflows</h2>
        <ul className="nf-list">
          <li>Offer letter generation, approvals, and digital signatures.</li>
          <li>Account provisioning across internal tools and systems.</li>
          <li>Policy update notifications and acknowledgment tracking.</li>
          <li>
            Offboarding flows including access revocation and asset retrieval.
          </li>
        </ul>
      </section>
    </div>
  );
}

/* ----------------- Users & Access Page ----------------- */

function UsersPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [tenantFilter, setTenantFilter] = useState("all");

  const filteredUsers = sampleUsers.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (tenantFilter !== "all" && u.tenant !== tenantFilter) return false;
    return true;
  });

  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Users & Access Control</h1>
        <p className="nf-page-subtitle">
          Manage users, roles, tenants, and permissions across your NexusFlow
          One deployment.
        </p>
      </header>

      <section className="nf-controls-row">
        <div className="nf-control-group">
          <label className="nf-control-label">Role</label>
          <select
            className="nf-control-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All roles</option>
            <option value="Owner / Admin">Owner / Admin</option>
            <option value="Tenant Admin">Tenant Admin</option>
            <option value="Engineer">Engineer</option>
            <option value="Head of Sales">Head of Sales</option>
          </select>
        </div>
        <div className="nf-control-group">
          <label className="nf-control-label">Tenant</label>
          <select
            className="nf-control-select"
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
          >
            <option value="all">All tenants</option>
            {TENANTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="nf-control-group nf-control-inline">
          <button className="nf-btn nf-btn-outline-sm">Invite User</button>
          <button className="nf-btn nf-btn-outline-sm">
            Export Access Matrix
          </button>
        </div>
      </section>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">User Directory</h2>
        <div className="nf-table-wrapper">
          <table className="nf-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Tenant</th>
                <th>Status</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.email}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.tenant}</td>
                  <td>{u.status}</td>
                  <td>{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Integration Hub Page ----------------- */

function IntegrationHubPage() {
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredIntegrations =
    typeFilter === "all"
      ? sampleIntegrations
      : sampleIntegrations.filter((i) => i.type === typeFilter);

  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Integration Hub</h1>
        <p className="nf-page-subtitle">
          Connect NexusFlow One with your CRMs, payment platforms, support
          tools, and internal systems.
        </p>
      </header>

      <section className="nf-controls-row">
        <div className="nf-control-group">
          <label className="nf-control-label">Integration Type</label>
          <select
            className="nf-control-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="CRM">CRM</option>
            <option value="Payments">Payments</option>
            <option value="Marketing">Marketing</option>
            <option value="Support">Support</option>
          </select>
        </div>
        <div className="nf-control-group nf-control-inline">
          <button className="nf-btn nf-btn-outline-sm">Add Integration</button>
          <button className="nf-btn nf-btn-outline-sm">
            Download Connector Docs
          </button>
        </div>
      </section>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Connectors</h2>
        <div className="nf-table-wrapper">
          <table className="nf-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Tenant</th>
                <th>Last Sync</th>
              </tr>
            </thead>
            <tbody>
              {filteredIntegrations.map((i) => (
                <tr key={i.name}>
                  <td>{i.name}</td>
                  <td>{i.type}</td>
                  <td>{i.status}</td>
                  <td>{i.tenant}</td>
                  <td>{i.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="nf-card-body nf-text-muted">
          The Integration Layer supports REST APIs, webhooks, OAuth, JSON
          connectors, and custom internal endpoints to fit your stack.
        </p>
      </section>
    </div>
  );
}

/* ----------------- AI & Models Page ----------------- */

function AIModelsPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">AI & Model Management</h1>
        <p className="nf-page-subtitle">
          Configure model providers, routing strategies, and AI governance for
          NexusFlow One.
        </p>
      </header>

      <section className="nf-grid nf-grid-2 nf-section-space">
        <div className="nf-card">
          <h2 className="nf-card-title">Model Providers</h2>
          <div className="nf-table-wrapper">
            <table className="nf-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Model</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Latency</th>
                </tr>
              </thead>
              <tbody>
                {sampleModels.map((m) => (
                  <tr key={m.model}>
                    <td>{m.provider}</td>
                    <td>{m.model}</td>
                    <td>{m.role}</td>
                    <td>{m.status}</td>
                    <td>{m.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="nf-card-body nf-text-muted">
            The AI engine is model-agnostic: swap providers for different
            workloads without rebuilding workflows.
          </p>
        </div>
        <div className="nf-card">
          <h2 className="nf-card-title">AI Governance</h2>
          <ul className="nf-list">
            <li>
              Separate policies for revenue-critical, customer-facing, and
              internal workflows.
            </li>
            <li>
              Locked workflows require explicit approvals for AI-driven changes
              to logic or thresholds.
            </li>
            <li>
              AI usage logs are retained in the Logging & Monitoring Layer for
              compliance review.
            </li>
          </ul>
          <button
            className="nf-btn nf-btn-outline nf-section-space"
            onClick={() =>
              alert(
                "In a live system, this would run a diagnostics check across all AI providers and routes."
              )
            }
          >
            Run AI Health Check
          </button>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Data & Schema Page ----------------- */

function DataSchemaPage() {
  const [selectedEntity, setSelectedEntity] = useState(dataEntities[0].name);
  const entity =
    dataEntities.find((e) => e.name === selectedEntity) || dataEntities[0];

  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Data & Schema</h1>
        <p className="nf-page-subtitle">
          Understand how NexusFlow One structures workflows, modules, nodes,
          executions, and logs at the data layer.
        </p>
      </header>

      <section className="nf-page-split nf-section-space">
        <div className="nf-page-split-left">
          <div className="nf-card">
            <h2 className="nf-card-title">Entities</h2>
            <ul className="nf-list-workflows">
              {dataEntities.map((e) => (
                <li key={e.name}>
                  <button
                    className={`nf-workflow-item ${
                      e.name === selectedEntity ? "nf-workflow-item-active" : ""
                    }`}
                    onClick={() => setSelectedEntity(e.name)}
                  >
                    <div className="nf-workflow-title">{e.name}</div>
                    <div className="nf-workflow-meta">
                      <span>Table: {e.table}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="nf-page-split-right">
          <div className="nf-card nf-card-detail">
            <h2 className="nf-card-title">{entity.name} Schema Snapshot</h2>
            <p className="nf-card-body nf-text-muted">{entity.purpose}</p>
            <h3 className="nf-section-title">Key Fields</h3>
            <ul className="nf-list">
              {entity.keyFields.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="nf-card-body nf-text-muted">
              The Data Persistence Layer uses PostgreSQL for durable storage and
              Redis for caching and event acceleration. Schema documentation is
              provided in the technical pack.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Activity & Audit Page ----------------- */

function ActivityPage() {
  const [riskFilter, setRiskFilter] = useState("all");

  const filteredActivity =
    riskFilter === "all"
      ? sampleActivity
      : sampleActivity.filter((a) => a.risk.toLowerCase() === riskFilter);

  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Activity & Audit Trail</h1>
        <p className="nf-page-subtitle">
          Every deployment, access change, and AI configuration update is
          tracked for transparency and compliance.
        </p>
      </header>

      <section className="nf-controls-row">
        <div className="nf-control-group">
          <label className="nf-control-label">Risk Level</label>
          <select
            className="nf-control-select"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="nf-control-group nf-control-inline">
          <button className="nf-btn nf-btn-outline-sm">Export Audit Log</button>
          <button className="nf-btn nf-btn-outline-sm">
            Open Compliance Report
          </button>
        </div>
      </section>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Recent Activity</h2>
        <ul className="nf-activity-list">
          {filteredActivity.map((a, idx) => (
            <li key={idx} className="nf-activity-item">
              <div className="nf-activity-time">{a.time}</div>
              <div className="nf-activity-main">
                <div className="nf-activity-title">{a.type}</div>
                <div className="nf-activity-detail">{a.detail}</div>
                <div className="nf-activity-meta">
                  <span>Actor: {a.actor}</span>
                  <span className={`nf-tag nf-tag-${a.risk.toLowerCase()}`}>
                    Risk: {a.risk}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ----------------- Blueprints Library Page ----------------- */

function BlueprintsPage() {
  const [focusFilter, setFocusFilter] = useState("all");

  const filteredBlueprints =
    focusFilter === "all"
      ? sampleBlueprints
      : sampleBlueprints.filter((b) => b.focus === focusFilter);

  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Blueprints Library</h1>
        <p className="nf-page-subtitle">
          High-level automation blueprints to roll out Finance, Sales, Customer,
          and Compliance playbooks with NexusFlow One.
        </p>
      </header>

      <section className="nf-controls-row">
        <div className="nf-control-group">
          <label className="nf-control-label">Focus Area</label>
          <select
            className="nf-control-select"
            value={focusFilter}
            onChange={(e) => setFocusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="Compliance">Compliance</option>
          </select>
        </div>
      </section>

      <section className="nf-grid nf-grid-2 nf-section-space">
        {filteredBlueprints.map((b) => (
          <div key={b.name} className="nf-card">
            <h2 className="nf-card-title">{b.name}</h2>
            <div className="nf-tag nf-tag-pill">{b.tag}</div>
            <p className="nf-card-body nf-text-muted">{b.summary}</p>
            <div className="nf-card-body nf-text-muted">
              Layers involved:{" "}
              {b.layers
                .sort((a, c) => a - c)
                .map((l) => `Layer ${l}`)
                .join(", ")}
            </div>
            <button className="nf-btn nf-btn-outline nf-section-space">
              View Blueprint Details
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ----------------- Legal & IP Page ----------------- */

function LegalPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Legal, Ownership & IP</h1>
        <p className="nf-page-subtitle">
          This section describes legal ownership, IP guarantees, and commercial
          rights for NexusFlow One.
        </p>
      </header>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Ownership Statement</h2>
        <p className="nf-card-body">
          NexusFlow One is a 100% original AI workflow automation system created
          exclusively by <strong>Maria Robles</strong>. There are:
        </p>
        <ul className="nf-list">
          <li>No external developers, agencies, or contractors.</li>
          <li>
            No shared repositories, third-party co-ownership, or encumbered
            assets.
          </li>
          <li>No GPL/AGPL or viral licenses embedded in the core system.</li>
        </ul>
        <p className="nf-card-body nf-text-muted">
          Every architectural layer, module, workflow, node, and document was
          authored and curated by Maria Robles, making this a clean,
          uncontested, and fully transferable IP asset.
        </p>
      </section>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Legal Terms (High-Level Summary)</h2>
        <ul className="nf-list">
          <li>
            Upon sale, the buyer receives full ownership of the NexusFlow One
            system, including source structure, documentation, and branding
            assets, unless otherwise specified in a signed purchase agreement.
          </li>
          <li>
            The buyer gains the right to rebrand, commercialize, license, host,
            and extend NexusFlow One as a SaaS, enterprise solution, or internal
            system.
          </li>
          <li>
            The seller, Maria Robles, retains no hidden control or callable
            rights once the IP transfer is completed and payment is settled in
            escrow.
          </li>
          <li>
            Any future customizations, derivatives, or new modules created by
            the buyer after acquisition remain under the buyer&apos;s control,
            unless separate agreements are executed.
          </li>
        </ul>
        <p className="nf-card-body nf-text-muted">
          Detailed language, jurisdiction, warranties, and limitations of
          liability are provided in the final IP transfer agreement between
          buyer and Maria Robles.
        </p>
      </section>
    </div>
  );
}

/* ----------------- Settings Page ----------------- */

function SettingsPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">System Settings & Configuration</h1>
        <p className="nf-page-subtitle">
          Configure deployment, multi-tenancy, and integration defaults for
          NexusFlow One.
        </p>
      </header>

      <section className="nf-grid nf-grid-3 nf-section-space">
        <div className="nf-card">
          <h2 className="nf-card-title">Deployment Profile</h2>
          <ul className="nf-list">
            <li>Docker, Docker Compose, and Kubernetes-ready layout.</li>
            <li>
              Cloud-agnostic: AWS, GCP, Azure, or self-hosted infrastructure.
            </li>
            <li>Environment configuration handled centrally in Layer 0.</li>
          </ul>
        </div>
        <div className="nf-card">
          <h2 className="nf-card-title">Multi-Tenant Controls</h2>
          <ul className="nf-list">
            <li>Tenant-aware workflows and segregated data partitions.</li>
            <li>
              Role-based permissions per tenant, per workspace, and per user.
            </li>
            <li>Ready to be productized as a SaaS automation platform.</li>
          </ul>
        </div>
        <div className="nf-card">
          <h2 className="nf-card-title">Integration Defaults</h2>
          <ul className="nf-list">
            <li>
              REST APIs, webhooks, and OAuth templates for external systems.
            </li>
            <li>JSON-based connectors for CRMs, ERPs, and internal tools.</li>
            <li>
              Rate-limit and timeout policies configurable per integration.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Help & Onboarding Page ----------------- */

function HelpPage() {
  return (
    <div className="nf-page">
      <header className="nf-page-header">
        <h1 className="nf-page-title">Help, Onboarding & Documentation</h1>
        <p className="nf-page-subtitle">
          NexusFlow One includes a complete documentation package for
          executives, engineers, and operators.
        </p>
      </header>

      <section className="nf-card nf-section-space">
        <h2 className="nf-card-title">Included Documentation</h2>
        <ul className="nf-list">
          <li>Layer-by-layer technical documentation for all 19 layers.</li>
          <li>
            Module index, workflow index, and node directory with definitions.
          </li>
          <li>Developer quickstart, deployment guide, and API usage guide.</li>
          <li>
            Business plan, marketing plan, research pack, and investor pitch
            deck.
          </li>
          <li>
            Technical Due-Diligence FAQ for engineering, legal, and investors.
          </li>
        </ul>
        <p className="nf-card-body nf-text-muted">
          The goal is simple: any qualified team can take NexusFlow One on Day
          1, deploy it, understand it, extend it, and commercialize it without
          guesswork.
        </p>
      </section>
    </div>
  );
}

export default App;
