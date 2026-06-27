import { useState, useEffect } from "react";
import api from "@/lib/axios";

export function useRole() {
  const [role,   setRole]   = useState(null);
  const [user,   setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read user from localStorage (set at login/register)
    const stored = localStorage.getItem("tb_user");
    const token  = localStorage.getItem("tb_token");

    if (!token || !stored) {
      setLoading(false);
      return;
    }

    // Parse stored user for quick render
    const parsed = JSON.parse(stored);
    setUser(parsed);
    setRole(parsed.role);

    // Verify with server to get fresh role (in case admin changed it)
    api.get("/auth/me")
      .then((res) => {
        setRole(res.data.role);
        setUser(res.data);
        // Update stored user with fresh data
        localStorage.setItem("tb_user", JSON.stringify(res.data));
      })
      .catch(() => {
        // Token expired — clear storage
        localStorage.removeItem("tb_token");
        localStorage.removeItem("tb_user");
        setRole(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
    setRole(null);
    setUser(null);
    window.location.href = "/login";
  };

  return { role, user, loading, logout };
}