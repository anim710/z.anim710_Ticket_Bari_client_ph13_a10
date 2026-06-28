import Link from "next/link";
import { MapPin, ArrowRight } from "@gravity-ui/icons";

const routes = [
  { from: "Dhaka", to: "Chittagong", price: "৳450", type: "Bus" },
  { from: "Dhaka", to: "Sylhet", price: "৳500", type: "Train" },
  { from: "Dhaka", to: "Cox's Bazar", price: "৳650", type: "Bus" },
  { from: "Dhaka", to: "Khulna", price: "৳800", type: "Launch" },
  { from: "Dhaka", to: "Barisal", price: "৳350", type: "Launch" },
  { from: "Dhaka", to: "Rajshahi", price: "৳600", type: "Train" },
];

export default function PopularRoutes() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-1 text-accent">
        <MapPin className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">Trending</span>
      </div>
      <h2 className="text-3xl font-bold">Popular routes</h2>
      <p className="text-muted mt-1 mb-8">Most booked destinations this week</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((r) => (
          <Link
            key={r.from + r.to}
            href={`/tickets?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`}
            className="group flex items-center justify-between bg-surface border border-separator rounded-2xl px-5 py-4 hover:border-accent transition-all"
          >
            <div>
              <p className="font-semibold flex items-center gap-2">
                {r.from}
                <ArrowRight className="w-4 h-4 text-accent" />
                {r.to}
              </p>
              <p className="text-muted text-sm">{r.type}</p>
            </div>
            <span className="text-accent font-bold group-hover:scale-110 transition-transform">
              {r.price}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
