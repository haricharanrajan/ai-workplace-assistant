import { useState } from "react";
import { uploadDocument } from "../api";

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleUpload() {
    if (!file) return;
    setBusy(true);
    setMsg("");

    try {
      const res = await uploadDocument(file);
      setMsg(res?.message || "Uploaded successfully");
      setFile(null);
      // reset file input
      const el = document.getElementById("upload-input");
      if (el) el.value = "";
    } catch (e) {
      setMsg(e?.response?.data?.detail || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>Admin: Upload Company Documents</h3>
      <div style={{ color: "#555", fontSize: 13, marginBottom: 10 }}>
        Supported formats: <b>.txt</b>, <b>.pdf</b>, <b>.docx</b>
      </div>

      <div style={styles.row}>
        <input
          id="upload-input"
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button style={styles.button} disabled={busy || !file} onClick={handleUpload}>
          {busy ? "Uploading..." : "Upload"}
        </button>
      </div>

      {msg && <div style={styles.notice}>{msg}</div>}

      <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
        Note: Upload is restricted to admins by backend authorization.
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
  row: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#111827",
    color: "white",
    fontWeight: 600,
  },
  notice: {
    marginTop: 12,
    background: "#ecfeff",
    color: "#164e63",
    padding: 10,
    borderRadius: 10,
    fontSize: 13,
  },
};