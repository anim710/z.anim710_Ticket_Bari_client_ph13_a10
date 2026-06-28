"use client";
import { useEffect, useState } from "react";
import { Button, Chip, Spinner } from "@heroui/react";
import { Megaphone } from "@gravity-ui/icons";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";

const MAX_ADVERTISED = 6;

export default function AdvertisePage() {
  const { allowed, loading: roleLoading } = useRequireRole("admin");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!allowed) return;
    api
      .get("/admin/tickets")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setTickets(list.filter((t) => t.verificationStatus === "approved"));
      })
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [allowed]);

  const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

  const toggle = async (ticket) => {
    setError(null);
    setBusyId(ticket._id);
    try {
      await api.patch(`/admin/tickets/${ticket._id}/advertise`);
      setTickets((prev) =>
        prev.map((t) => (t._id === ticket._id ? { ...t, isAdvertised: !t.isAdvertised } : t))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update advertisement.");
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Advertise tickets</h1>
          <p className="text-muted text-sm">Approved tickets you can feature on the homepage.</p>
        </div>
        <Chip color={advertisedCount >= MAX_ADVERTISED ? "warning" : "accent"} variant="soft">
          {advertisedCount} / {MAX_ADVERTISED} advertised
        </Chip>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm bg-danger-soft text-danger-soft-foreground">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-separator rounded-2xl text-muted">
          No approved tickets to advertise.
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-separator rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-separator text-left text-muted">
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Advertised</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => {
                const atLimit = advertisedCount >= MAX_ADVERTISED && !t.isAdvertised;
                return (
                  <tr key={t._id} className="border-b border-separator last:border-0 hover:bg-surface-secondary transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {t.image && <img src={t.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                        <span className="font-medium line-clamp-1">{t.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{t.from} → {t.to}</td>
                    <td className="px-4 py-3 font-semibold text-accent">৳{t.price}</td>
                    <td className="px-4 py-3">
                      <Chip size="sm" color={t.isAdvertised ? "success" : "default"} variant="soft">
                        {t.isAdvertised ? "Yes" : "No"}
                      </Chip>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant={t.isAdvertised ? "danger-soft" : "primary"}
                          className={t.isAdvertised ? "" : "brand-gradient text-white"}
                          isDisabled={busyId === t._id || atLimit}
                          onPress={() => toggle(t)}
                        >
                          <Megaphone className="w-4 h-4" />
                          {t.isAdvertised ? "Unadvertise" : "Advertise"}
                        </Button>
                      </div>
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
