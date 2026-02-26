import { useState } from "react";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const data = await login(username, password);
      onLogin(data.access_token);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.center}>
      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>AI Workplace Assistant</h2>
        <p style={{ marginTop: 0, color: "#555" }}>Sign in to continue</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={styles.label}>
            Username
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {err && <div style={styles.error}>{err}</div>}

          <button style={styles.button} disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>

          <div style={{ fontSize: 12, color: "#666" }}>
            Use an <b>admin</b> account to upload documents. Employees can only chat.
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
    background: "#f6f7fb",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  label: { display: "grid", gap: 6, fontSize: 14 },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#111827",
    color: "white",
    fontWeight: 600,
  },
  error: {
    background: "#fee2e2",
    color: "#7f1d1d",
    padding: 10,
    borderRadius: 10,
    fontSize: 13,
  },
};