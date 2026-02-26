import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export async function login(username, password) {
  // FastAPI OAuth2PasswordRequestForm expects x-www-form-urlencoded
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data; // {access_token, token_type}
}

export async function uploadDocument(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await api.post("/documents/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function askQuestion(question) {
  const res = await api.post("/chat/", { question });
  return res.data; // {answer, context_used}
}

export async function getChatHistory() {
  const res = await api.get("/chat/history");
  return res.data; // list
}

export default api;