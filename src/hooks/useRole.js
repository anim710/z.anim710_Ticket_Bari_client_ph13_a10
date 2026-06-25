import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import api from "@/lib/axios";

export function useRole() {
  const { data: session, isPending: sessionLoading } = useSession();
  
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    // 1. If BetterAuth is actively resolving, do nothing.
    if (sessionLoading) return;

    // 2. Verified session found -> Fetch the role asynchronously
    if (session?.user?.email) {
      api
        .get(`/auth/me?email=${session.user.email}`)
        .then((res) => {
          setRole(res.data.role);
        })
        .catch((err) => {
          console.error("Failed to fetch user role:", err);
          setRole(null);
        })
        .finally(() => {
          setRoleLoading(false);
        });
    } else {
      // 3. No session found. Defer state updates cleanly outside 
      // of React's active rendering pass to prevent render cascades.
      queueMicrotask(() => {
        setRole(null);
        setRoleLoading(false);
      });
    }
  }, [session, sessionLoading]); // Removed local states from dependencies to prevent cyclic loops

  const combinedLoading = sessionLoading || roleLoading;

  return { role, loading: combinedLoading, user: session?.user };
}