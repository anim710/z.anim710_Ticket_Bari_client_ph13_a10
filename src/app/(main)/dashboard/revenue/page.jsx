"use client";
import { useEffect, useState } from "react";
import { Card, Spinner } from "@heroui/react";
import { Ticket, CircleCheck, TagDollar } from "@gravity-ui/icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";

const COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function RevenuePage() {
  const { allowed, loading: roleLoading } = useRequireRole("vendor");
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!allowed) return;
    Promise.all([
      api.get("/tickets/vendor/my-tickets").then((r) => r.data).catch(() => []),
      api.get("/bookings/vendor").then((r) => r.data).catch(() => []),
    ])
      .then(([tk, bk]) => {
        setTickets(Array.isArray(tk) ? tk : []);
        setBookings(Array.isArray(bk) ? bk : []);
      })
      .finally(() => setLoading(false));
  }, [allowed]);

  if (roleLoading || !allowed || loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  const paid = bookings.filter((b) => b.status === "paid");
  const totalAdded = tickets.length;
  const totalSold = paid.reduce((sum, b) => sum + (b.quantity || 0), 0);
  const totalRevenue = paid.reduce(
    (sum, b) => sum + (b.totalPrice ?? (b.unitPrice || 0) * (b.quantity || 1)),
    0
  );

  const stats = [
    { label: "Tickets added", value: totalAdded, Icon: Ticket },
    { label: "Tickets sold", value: totalSold, Icon: CircleCheck },
    { label: "Total revenue", value: `৳${totalRevenue}`, Icon: TagDollar },
  ];

  const overviewData = [
    { name: "Added", value: totalAdded },
    { name: "Sold", value: totalSold },
  ];

  // Revenue grouped per ticket title
  const revenueByTicket = Object.values(
    paid.reduce((acc, b) => {
      const key = b.ticketTitle || "Untitled";
      const amount = b.totalPrice ?? (b.unitPrice || 0) * (b.quantity || 1);
      if (!acc[key]) acc[key] = { name: key, revenue: 0 };
      acc[key].revenue += amount;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Revenue overview</h1>
        <p className="text-muted text-sm">Your sales performance at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, Icon }) => (
          <Card key={label} className="bg-surface border border-separator">
            <Card.Content className="p-5">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-soft text-accent-soft-foreground mb-3">
                <Icon className="w-5 h-5" />
              </span>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-muted text-sm">{label}</p>
            </Card.Content>
          </Card>
        ))}
      </div>

      {!mounted ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Added vs Sold */}
          <Card className="bg-surface border border-separator">
            <Card.Content className="p-5">
              <h3 className="font-semibold mb-4">Tickets added vs sold</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#88888833" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {overviewData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Content>
          </Card>

          {/* Revenue by ticket */}
          <Card className="bg-surface border border-separator">
            <Card.Content className="p-5">
              <h3 className="font-semibold mb-4">Revenue by ticket</h3>
              <div className="h-72">
                {revenueByTicket.length === 0 ? (
                  <div className="h-full grid place-items-center text-muted text-sm">
                    No revenue yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByTicket}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(d) => `৳${d.revenue}`}
                      >
                        {revenueByTicket.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
}
