// src/LoginForm.jsx
import React, { useState } from "react";
import { login, signup } from "./nexusApi";

function LoginForm({ onLoggedIn }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (mode === "login") {
        result = await login(email, password);
      } else {
        result = await signup(email, password);
      }

      if (onLoggedIn) {
        onLoggedIn(result);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nf-login-page">
      {/* LEFT: Hero / marketing side */}
      <div className="nf-login-hero">
        <div className="nf-login-hero-inner">
          <div className="nf-login-logo-row">
            <div className="nf-logo-dot" />
            <div className="nf-login-logo-text">
              <div className="nf-login-logo-title">NexusFlow One</div>
              <div className="nf-login-logo-subtitle">
                AI Workflow &amp; Automation Control Unit
              </div>
            </div>
          </div>

          <h1 className="nf-login-hero-title">
            Run your entire operation from one AI control unit.
          </h1>
          <p className="nf-login-hero-text">
            NexusFlow One orchestrates workflows, AI decisions, and data flows
            across your business. Log in to configure projects, automate
            processes, and monitor activity in real time.
          </p>

          <ul className="nf-login-hero-list">
            <li>19-layer enterprise architecture</li>
            <li>640+ reusable automation &amp; integration modules</li>
            <li>3,000+ mapped workflows and execution nodes</li>
            <li>Full IP ownership – ready for your branding and teams</li>
          </ul>

          <div className="nf-login-hero-footer">
            <span className="nf-login-hero-pill">
              Multi-tenant • Audit-ready • Buyer-ready IP
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Auth card */}
      <div className="nf-login-panel">
        <div className="nf-login-card">
          <h2 className="nf-login-title">
            {mode === "login"
              ? "Welcome back"
              : "Create your NexusFlow One account"}
          </h2>
          <p className="nf-login-subtitle">
            {mode === "login"
              ? "Log in to access your NexusFlow One workspace and automation console."
              : "Sign up to create an operator account for this NexusFlow One environment."}
          </p>

          <div className="nf-login-mode-toggle">
            <button
              type="button"
              className={`nf-btn nf-btn-sm ${
                mode === "login" ? "nf-btn-accent" : "nf-btn-ghost"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`nf-btn nf-btn-sm ${
                mode === "signup" ? "nf-btn-accent" : "nf-btn-ghost"
              }`}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="nf-login-form">
            <label className="nf-control-label">
              Email
              <input
                type="email"
                className="nf-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="nf-control-label">
              Password
              <input
                type="password"
                className="nf-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
            </label>

            {error && <div className="nf-error-text">{error}</div>}

            <button
              type="submit"
              className="nf-btn nf-btn-accent nf-login-submit"
              disabled={loading}
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                ? "Login"
                : "Sign Up"}
            </button>
          </form>

          <p className="nf-login-footer">
            This environment is configured as an internal NexusFlow One control
            unit demo. All actions can be wired to activity logs, analytics, and
            workflow executions at the API layer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
