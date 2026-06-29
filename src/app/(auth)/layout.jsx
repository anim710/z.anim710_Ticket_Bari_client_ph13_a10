import Link from "next/link";
import { Ticket, CircleCheck } from "@gravity-ui/icons";

const highlights = [
  "Book bus, train, launch & flight tickets",
  "Secure Stripe-powered payments",
  "Manage every booking from one dashboard",
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      {/* ── Brand panel ─────────────────────────────────────── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 brand-gradient text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/10 blur-2xl" />

        <Link href="/" className="relative flex items-center gap-2">
          {/* Custom Image Logo with proportions balanced for larger text */}
          <img
            src="/ticketbari-r.png"
            alt="TicketBari Logo"
            height={32}
            width={64}
            className="h-8 w-auto object-contain" // Scaled to h-8 to perfectly balance with text-2xl
          />
          <span className="font-bold text-2xl">TicketBari</span>
        </Link>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Travel Bangladesh, the easy way.
          </h1>
          <p className="text-white/80 mb-8 max-w-md">
            Join thousands of travelers booking their journeys in seconds.
          </p>
          <ul className="space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-white/90">
                <CircleCheck className="w-5 h-5 shrink-0" /> {h}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-white/60 text-sm">
          © {new Date().getFullYear()} TicketBari
        </p>
      </div>

      {/* ── Form area ───────────────────────────────────────── */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
