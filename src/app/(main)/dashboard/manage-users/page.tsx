"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Spinner } from "@heroui/react";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";

const ROLE_COLOR = { admin: "accent", vendor: "warning", user: "default" };

export default function ManageUsersPage() {
  const { allowed, loading: roleLoading } = useRequireRole("admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!allowed) return;
    api
      .get("/users")
      .then((r) => setUsers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [allowed]);

  const changeRole = async (id, role) => {
    setBusyId(id);
    try {
      await api.patch(`/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch {
      /* ignore */
    } finally {
      setBusyId(null);
    }
  };

  const markFraud = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/users/${id}/fraud`);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isFraud: true } : u)));
    } catch {
      /* ignore */
    } finally {
      setBusyId(null);
    }
  };

  if (roleLoading || !allowed || loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage users</h1>
        <p className="text-muted text-sm">{users.length} user(s)</p>
      </div>

      <div className="overflow-x-auto bg-surface border border-separator rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-separator text-left text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const busy = busyId === u._id;
              return (
                <tr key={u._id} className="border-b border-separator last:border-0 hover:bg-surface-secondary transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name || "—"}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Chip size="sm" color={ROLE_COLOR[u.role] || "default"} variant="soft" className="capitalize">
                        {u.role || "user"}
                      </Chip>
                      {u.isFraud && <Chip size="sm" color="danger" variant="soft">Fraud</Chip>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        isDisabled={busy || u.role === "admin"}
                        onPress={() => changeRole(u._id, "admin")}
                      >
                        Make Admin
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        isDisabled={busy || u.role === "vendor"}
                        onPress={() => changeRole(u._id, "vendor")}
                      >
                        Make Vendor
                      </Button>
                      {u.role === "vendor" && (
                        <Button
                          size="sm"
                          variant="danger-soft"
                          isDisabled={busy || u.isFraud}
                          onPress={() => markFraud(u._id)}
                        >
                          {u.isFraud ? "Fraud" : "Mark as Fraud"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
