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
    <section className="max-w-7xl mx-auto px-6 py-16 bg-slate-900/50">
      <h2 className="text-3xl font-bold text-white mb-2">🗺️ Popular Routes</h2>
      <p className="text-slate-400 mb-8">Most booked destinations</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((r) => (
          <div
            key={r.from + r.to}
            className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 hover:border-blue-500 transition-all cursor-pointer"
          >
            <div>
              <p className="text-white font-semibold">
                {r.from} → {r.to}
              </p>
              <p className="text-slate-400 text-sm">{r.type}</p>
            </div>
            <span className="text-blue-400 font-bold">{r.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}