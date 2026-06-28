import { Rocket, ShieldCheck, Display, Ticket } from "@gravity-ui/icons";

const reasons = [
  { Icon: Rocket, title: "Instant Booking", desc: "Confirm your seat in under 60 seconds." },
  { Icon: ShieldCheck, title: "Secure Payments", desc: "Stripe-powered, 100% safe transactions." },
  { Icon: Display, title: "Mobile Friendly", desc: "Book from anywhere, on any device." },
  { Icon: Ticket, title: "All Transport", desc: "Bus, train, launch & plane — all in one." },
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Why choose TicketBari?</h2>
        <p className="text-muted">We make travel easy, fast, and affordable</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="group bg-surface border border-separator rounded-2xl p-6 text-center hover:border-accent hover:-translate-y-1 transition-all"
          >
            <div className="mx-auto mb-4 grid place-items-center w-14 h-14 rounded-2xl bg-accent-soft text-accent-soft-foreground group-hover:scale-110 transition-transform">
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-muted text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
