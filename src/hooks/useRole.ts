import { useState, useEffect } from "react";
import api from "@/lib/axios";

export function useRole() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Yield so auth state updates are not sync setState inside the effect body
      await Promise.resolve();

      const stored = localStorage.getItem("tb_user");
      const token = localStorage.getItem("tb_token");

      if (!token || !stored) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        if (!cancelled) {
          setUser(parsed);
          setRole(parsed.role);
        }

        const res = await api.get("/auth/me");
        if (cancelled) return;
        setRole(res.data.role);
        setUser(res.data);
        localStorage.setItem("tb_user", JSON.stringify(res.data));
      } catch {
        localStorage.removeItem("tb_token");
        localStorage.removeItem("tb_user");
        if (!cancelled) {
          setRole(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
    setRole(null);
    setUser(null);
    window.location.assign("/login");
  };

  return { role, user, loading, logout };
}
