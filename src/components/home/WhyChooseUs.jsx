const reasons = [
  { icon: "⚡", title: "Instant Booking", desc: "Confirm your seat in under 60 seconds." },
  { icon: "🔒", title: "Secure Payments", desc: "Stripe-powered, 100% safe transactions." },
  { icon: "📱", title: "Mobile Friendly", desc: "Book from anywhere, any device." },
  { icon: "🎫", title: "All Transport", desc: "Bus, Train, Launch, Plane — all in one." },
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">
        Why Choose TicketBari?
      </h2>
      <p className="text-slate-400 text-center mb-10">
        We make travel easy, fast, and affordable
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 transition-all"
          >
            <div className="text-4xl mb-3">{r.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{r.title}</h3>
            <p className="text-slate-400 text-sm">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}