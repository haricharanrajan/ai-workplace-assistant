export default function DocumentList() {
  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>Documents</h3>

      <div style={{ color: "#555", fontSize: 14 }}>
        Document listing is not enabled yet (no <code>GET /documents</code> endpoint in backend).
      </div>

      <div style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
        For demo: upload documents via <b>Admin → Upload</b>, then ask questions in <b>Chat</b>.
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  },
};