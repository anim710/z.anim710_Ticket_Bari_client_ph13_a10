"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Person,
  Receipt,
  Ticket,
  ArrowRightToSquare,
  CreditCard,
  Plus,
  Folders,
  Tray,
  ChartColumn,
  Persons,
  Megaphone,
  ShieldCheck,
} from "@gravity-ui/icons";
import { Spinner } from "@heroui/react";
import { useRole } from "@/hooks/useRole";

const PROFILE_LINK = { label: "Profile", href: "/dashboard/profile", Icon: Person };

const linksByRole = {
  user: [
    PROFILE_LINK,
    { label: "My Booked Tickets", href: "/dashboard/my-booked-tickets", Icon: Receipt },
    { label: "Transaction History", href: "/dashboard/transactions", Icon: CreditCard },
    { label: "Browse Tickets", href: "/tickets", Icon: Ticket },
  ],
  vendor: [
    PROFILE_LINK,
    { label: "Add Ticket", href: "/dashboard/add-ticket", Icon: Plus },
    { label: "My Added Tickets", href: "/dashboard/my-added-tickets", Icon: Folders },
    { label: "Requested Bookings", href: "/dashboard/requested-bookings", Icon: Tray },
    { label: "Revenue Overview", href: "/dashboard/revenue", Icon: ChartColumn },
  ],
  admin: [
    PROFILE_LINK,
    { label: "Manage Tickets", href: "/dashboard/manage-tickets", Icon: ShieldCheck },
    { label: "Manage Users", href: "/dashboard/manage-users", Icon: Persons },
    { label: "Advertise Tickets", href: "/dashboard/advertise", Icon: Megaphone },
  ],
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, logout } = useRole();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  const links = linksByRole[role] || linksByRole.user;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="bg-surface border border-separator rounded-2xl p-4">
          {/* mini profile */}
          <div className="flex items-center gap-3 p-2 mb-3">
            <div className="w-11 h-11 rounded-full brand-gradient grid place-items-center text-white font-bold overflow-hidden shrink-0">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "?"
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{user?.name || "Guest"}</p>
              {role && (
                <span className="text-[10px] font-semibold uppercase tracking-wide bg-accent-soft text-accent-soft-foreground px-2 py-0.5 rounded-full">
                  {role}
                </span>
              )}
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {links.map(({ label, href, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-accent-soft text-accent-soft-foreground"
                      : "text-muted hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" /> {label}
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-soft transition-colors text-left whitespace-nowrap"
            >
              <ArrowRightToSquare className="w-4 h-4 shrink-0" /> Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
