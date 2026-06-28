"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Spinner } from "@heroui/react";
import { Check, Xmark } from "@gravity-ui/icons";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";

const VERIFY_COLOR = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export default function ManageTicketsPage() {
  const { allowed, loading: roleLoading } = useRequireRole("admin");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!allowed) return;
    api
      .get("/admin/tickets")
      .then((r) => setTickets(Array.isArray(r.data) ? r.data : []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [allowed]);

  const verify = async (id, verificationStatus) => {
    setBusyId(id);
    try {
      await api.patch(`/admin/tickets/${id}/verify`, { verificationStatus });
      setTickets((prev) => prev.map((t) => (t._id === id ? { ...t, verificationStatus } : t)));
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
        <h1 className="text-2xl font-bold">Manage tickets</h1>
        <p className="text-muted text-sm">{tickets.length} ticket(s)</p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-separator rounded-2xl text-muted">
          No tickets found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-separator rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-separator text-left text-muted">
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id} className="border-b border-separator last:border-0 hover:bg-surface-secondary transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {t.image && (
                        <img src={t.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      )}
                      <span className="font-medium line-clamp-1">{t.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{t.from} → {t.to}</td>
                  <td className="px-4 py-3 text-muted text-xs">{t.vendorEmail}</td>
                  <td className="px-4 py-3 font-semibold text-accent">৳{t.price}</td>
                  <td className="px-4 py-3">
                    <Chip size="sm" color={VERIFY_COLOR[t.verificationStatus] || "default"} variant="soft" className="capitalize">
                      {t.verificationStatus || "pending"}
                    </Chip>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="brand-gradient text-white"
                        isDisabled={busyId === t._id || t.verificationStatus === "approved"}
                        onPress={() => verify(t._id, "approved")}
                      >
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger-soft"
                        isDisabled={busyId === t._id || t.verificationStatus === "rejected"}
                        onPress={() => verify(t._id, "rejected")}
                      >
                        <Xmark className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
