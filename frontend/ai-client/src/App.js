import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { useAuth } from "./hooks/useAuth";

// We'll create these next steps
import AdminUpload from "./components/AdminUpload";
import ChatInterface from "./components/ChatInterface";
import DocumentList from "./components/DocumentList";

function Protected({ isAuthed, children }) {
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function Shell({ user, onLogout, children }) {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.badge}>RAG</div>
          <div>
            <div style={{ fontWeight: 800 }}>AI Workplace Assistant</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              Signed in as <b>{user?.username}</b> ({user?.role})
            </div>
          </div>
        </div>

        <button style={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </header>

      <nav style={styles.nav}>
        <Link style={styles.navLink} to="/chat">Chat</Link>
        {user?.role === "admin" && (
          <Link style={styles.navLink} to="/admin/upload">Upload</Link>
        )}
        <Link style={styles.navLink} to="/documents">Documents</Link>
      </nav>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

export default function App() {
  const { isAuthed, setToken, user, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/chat" replace /> : <Login onLogin={setToken} />}
        />

        <Route
          path="/*"
          element={
            <Protected isAuthed={isAuthed}>
              <Shell user={user} onLogout={logout}>
                <Routes>
                  <Route path="/chat" element={<ChatInterface />} />
                  <Route path="/documents" element={<DocumentList />} />

                  <Route
                    path="/admin/upload"
                    element={
                      user?.role === "admin" ? <AdminUpload /> : <Navigate to="/chat" replace />
                    }
                  />

                  <Route path="*" element={<Navigate to="/chat" replace />} />
                </Routes>
              </Shell>
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f6f7fb" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    background: "white",
    borderBottom: "1px solid #eee",
  },
  badge: {
    background: "#111827",
    color: "white",
    borderRadius: 10,
    padding: "6px 10px",
    fontWeight: 800,
    fontSize: 12,
  },
  logout: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    cursor: "pointer",
    background: "white",
    fontWeight: 700,
  },
  nav: {
    display: "flex",
    gap: 10,
    padding: "12px 16px",
    flexWrap: "wrap",
  },
  navLink: {
    textDecoration: "none",
    color: "#111827",
    background: "white",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #eee",
    fontWeight: 700,
    fontSize: 13,
  },
  main: {
    padding: 16,
    display: "grid",
    gap: 16,
    maxWidth: 1100,
    margin: "0 auto",
  },
};