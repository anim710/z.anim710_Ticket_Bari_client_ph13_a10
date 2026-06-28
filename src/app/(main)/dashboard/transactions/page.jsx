"use client";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionsPage() {
  const { allowed, loading: roleLoading } = useRequireRole("user");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!allowed) return;
    api
      .get("/payments/my")
      .then((r) => setTransactions(Array.isArray(r.data) ? r.data : []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [allowed]);

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
        <h1 className="text-2xl font-bold">Transaction history</h1>
        <p className="text-muted text-sm">{transactions.length} payment(s)</p>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-separator rounded-2xl text-muted">
          No transactions yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-separator rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-separator text-left text-muted">
                <th className="px-4 py-3 font-medium">Transaction ID</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Ticket Title</th>
                <th className="px-4 py-3 font-medium">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-separator last:border-0 hover:bg-surface-secondary transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{t.transactionId}</td>
                  <td className="px-4 py-3 font-semibold text-accent">৳{t.amount}</td>
                  <td className="px-4 py-3">{t.ticketTitle || "—"}</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(t.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
