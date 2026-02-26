import { useEffect, useRef, useState } from "react";
import { askQuestion, getChatHistory } from "../api";

export default function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getChatHistory();

        const formatted = [];
        for (const item of history) {
          formatted.push({ role: "user", content: item.question });
          formatted.push({ role: "assistant", content: item.answer });
        }

        setMessages(formatted);
      } catch (err) {
        console.log("No chat history yet.");
      }
    }

    loadHistory();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    setQuestion("");
    setBusy(true);

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    try {
      const res = await askQuestion(trimmed);
      const answer = res.answer || "(No answer returned)";
      const context = Array.isArray(res.context_used) ? res.context_used : [];

      const contextText =
        context.length > 0
          ? `\n\n---\nContext used:\n${context
              .map((c, i) => `${i + 1}. ${c}`)
              .join("\n")}`
          : "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer + contextText },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: e?.response?.data?.detail || "Chat request failed",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  }

  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>Ask About Company Documents</h3>

      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <div style={{ color: "#666", fontSize: 13 }}>
            Start by asking a question about uploaded documents.
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#111827" : "#f3f4f6",
              color: msg.role === "user" ? "white" : "#111",
            }}
          >
            <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <textarea
          style={styles.textarea}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question… (Ctrl + Enter to send)"
        />

        <button
          style={styles.button}
          onClick={handleSend}
          disabled={busy}
        >
          {busy ? "Thinking..." : "Send"}
        </button>
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
    display: "grid",
    gap: 12,
  },
  chatBox: {
    minHeight: 320,
    maxHeight: 520,
    overflow: "auto",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#fafafa",
  },
  message: {
    maxWidth: "85%",
    padding: 10,
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.35,
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    alignItems: "start",
  },
  textarea: {
    minHeight: 70,
    resize: "vertical",
    padding: 10,
    borderRadius: 12,
    border: "1px solid #ddd",
    outline: "none",
    fontFamily: "inherit",
    fontSize: 14,
  },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#111827",
    color: "white",
    fontWeight: 600,
    height: 42,
  },
};