import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { setAuthToken } from "../api";

const STORAGE_KEY = "aiwa_token";

function safeDecode(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [claims, setClaims] = useState(() => (token ? safeDecode(token) : null));

  useEffect(() => {
    setAuthToken(token || null);
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
    setClaims(token ? safeDecode(token) : null);
  }, [token]);

  const user = useMemo(() => {
    if (!claims) return null;
    return {
      username: claims.sub || "",
      role: claims.role || "employee",
    };
  }, [claims]);

  function logout() {
    setToken("");
  }

  return { token, setToken, user, logout, isAuthed: !!token };
}