"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Spinner } from "@heroui/react";
import { Check, Xmark } from "@gravity-ui/icons";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";

const STATUS_COLOR = {
  pending: "warning",
  accepted: "accent",
  paid: "success",
  rejected: "danger",
};

export default function RequestedBookingsPage() {
  const { allowed, loading: roleLoading } = useRequireRole("vendor");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!allowed) return;
    api
      .get("/bookings/vendor")
      .then((r) => setBookings(Array.isArray(r.data) ? r.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [allowed]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
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
        <h1 className="text-2xl font-bold">Requested bookings</h1>
        <p className="text-muted text-sm">{bookings.length} request(s)</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-separator rounded-2xl text-muted">
          No booking requests yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-separator rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-separator text-left text-muted">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const qty = b.quantity || 1;
                const total = b.totalPrice ?? (b.unitPrice || 0) * qty;
                return (
                  <tr key={b._id} className="border-b border-separator last:border-0 hover:bg-surface-secondary transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.userName || "—"}</p>
                      <p className="text-muted text-xs">{b.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">{b.ticketTitle || "—"}</td>
                    <td className="px-4 py-3">{qty}</td>
                    <td className="px-4 py-3 font-semibold text-accent">৳{total}</td>
                    <td className="px-4 py-3">
                      <Chip size="sm" color={STATUS_COLOR[b.status] || "default"} variant="soft" className="capitalize">
                        {b.status || "pending"}
                      </Chip>
                    </td>
                    <td className="px-4 py-3">
                      {b.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            className="brand-gradient text-white"
                            isDisabled={busyId === b._id}
                            onPress={() => updateStatus(b._id, "accepted")}
                          >
                            <Check className="w-4 h-4" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="danger-soft"
                            isDisabled={busyId === b._id}
                            onPress={() => updateStatus(b._id, "rejected")}
                          >
                            <Xmark className="w-4 h-4" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <p className="text-right text-muted text-xs capitalize">{b.status}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
