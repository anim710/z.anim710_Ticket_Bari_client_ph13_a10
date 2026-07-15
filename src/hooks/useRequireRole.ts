"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "./useRole";

/**
 * Guards a dashboard page to one or more roles.
 * - Not logged in -> /login
 * - Logged in but wrong role -> /dashboard/profile
 * Returns { user, role, loading, allowed }.
 */
export function useRequireRole(allowed) {
  const { user, role, loading, logout } = useRole();
  const router = useRouter();

  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  const isAllowed = !!role && allowedRoles.includes(role);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!isAllowed) {
      router.replace("/dashboard/profile");
    }
  }, [loading, user, isAllowed, router]);

  return { user, role, loading, allowed: isAllowed, logout };
}
