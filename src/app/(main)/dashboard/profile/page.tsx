"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Chip, Spinner } from "@heroui/react";
import { Person, Envelope, ShieldCheck, Calendar } from "@gravity-ui/icons";
import api from "@/lib/axios";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tb_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    api
      .get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => {
        localStorage.removeItem("tb_token");
        localStorage.removeItem("tb_user");
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  const details = [
    { label: "Full name", value: user.name || "—", Icon: Person },
    { label: "Email", value: user.email || "—", Icon: Envelope },
    { label: "Role", value: user.role || "user", Icon: ShieldCheck, capitalize: true },
    { label: "Member since", value: formatDate(user.createdAt), Icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      {/* ── Profile banner ──────────────────────────────────── */}
      <Card className="bg-surface border border-separator overflow-hidden">
        <div className="h-24 brand-gradient" />
        <Card.Content className="p-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="w-24 h-24 rounded-2xl brand-gradient ring-4 ring-surface grid place-items-center text-white text-3xl font-bold overflow-hidden shrink-0">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 sm:pb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Chip size="sm" color="accent" variant="soft" className="capitalize">{user.role}</Chip>
                {user.provider && (
                  <Chip size="sm" color="default" variant="soft" className="capitalize">{user.provider}</Chip>
                )}
                {user.isFraud && (
                  <Chip size="sm" color="danger" variant="soft">Suspended</Chip>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* ── Account details ─────────────────────────────────── */}
      <Card className="bg-surface border border-separator">
        <Card.Content className="p-6">
          <h3 className="font-semibold mb-4">Account information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {details.map(({ label, value, Icon, capitalize }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-soft text-accent-soft-foreground shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-muted text-xs">{label}</p>
                  <p className={`font-medium break-words ${capitalize ? "capitalize" : ""}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
