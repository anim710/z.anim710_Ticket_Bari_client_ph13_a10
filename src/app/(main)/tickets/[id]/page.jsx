"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Chip, Spinner, Input } from "@heroui/react";
import { ArrowLeft, MapPin, Calendar, Person, CircleCheck } from "@gravity-ui/icons";
import api from "@/lib/axios";

function formatDate(value) {
  if (!value) return "TBA";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "TBA";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [qty, setQty] = useState(1);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  useEffect(() => {
    if (!id) return;
    api
      .get(`/tickets/${id}`)
      .then((r) => setTicket(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    setMessage(null);

    const token = localStorage.getItem("tb_token");
    const stored = localStorage.getItem("tb_user");
    if (!token || !stored) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(stored);
    const quantity = Math.max(1, Math.min(Number(qty) || 1, ticket.quantity || 1));

    setBooking(true);
    try {
      await api.post("/bookings", {
        ticketId: ticket._id,
        ticketTitle: ticket.title,
        image: ticket.image,
        from: ticket.from,
        to: ticket.to,
        transportType: ticket.transportType,
        departureDate: ticket.departureDate,
        vendorEmail: ticket.vendorEmail,
        userEmail: user.email,
        userName: user.name,
        quantity,
        unitPrice: ticket.price,
        totalPrice: ticket.price * quantity,
      });
      setMessage({
        type: "success",
        text: `Booked ${quantity} seat(s)! Manage it from your dashboard.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Booking failed. Please try again.",
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="text-center py-32">
        <p className="text-muted mb-4">Ticket not found.</p>
        <Button onPress={() => router.push("/tickets")} variant="primary" className="brand-gradient text-white">
          Back to all tickets
        </Button>
      </div>
    );
  }

  const soldOut = !ticket.quantity || ticket.quantity <= 0;
  const quantity = Math.max(1, Math.min(Number(qty) || 1, ticket.quantity || 1));

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-1.5 text-muted hover:text-accent text-sm mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all tickets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left: image + info ──────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative rounded-2xl overflow-hidden border border-separator">
            <img src={ticket.image} alt={ticket.title} className="w-full h-72 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Chip size="sm" variant="primary" className="brand-gradient text-white border-0 mb-2">
                {ticket.transportType}
              </Chip>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{ticket.title}</h1>
            </div>
          </div>

          <Card className="bg-surface border border-separator">
            <Card.Content className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info icon={MapPin} label="Route" value={`${ticket.from} → ${ticket.to}`} />
              <Info icon={Calendar} label="Departure" value={formatDate(ticket.departureDate)} />
              <Info icon={Person} label="Operator" value={ticket.vendorName || "TicketBari Partner"} />
              <Info icon={CircleCheck} label="Seats available" value={ticket.quantity ?? 0} />
            </Card.Content>
          </Card>

          {ticket.perks?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Onboard perks</h3>
              <div className="flex flex-wrap gap-2">
                {ticket.perks.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 text-sm bg-surface border border-separator px-3 py-1.5 rounded-full"
                  >
                    <CircleCheck className="w-4 h-4 text-accent" /> {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: sticky booking card ──────────────────────── */}
        <div className="lg:col-span-2">
          <Card className="bg-surface border border-separator lg:sticky lg:top-24">
            <Card.Content className="p-6">
              <p className="text-muted text-sm">Price per seat</p>
              <p className="text-4xl font-bold text-accent mb-1">৳{ticket.price}</p>

              {message && (
                <div
                  className={`rounded-xl px-4 py-3 my-4 text-sm ${
                    message.type === "success"
                      ? "bg-success-soft text-success-soft-foreground"
                      : "bg-danger-soft text-danger-soft-foreground"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {soldOut ? (
                <div className="mt-4 bg-default-soft text-default-soft-foreground text-center rounded-xl py-3 font-medium">
                  Sold out
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <Input
                    type="number"
                    label="Seats"
                    min={1}
                    max={ticket.quantity}
                    value={String(qty)}
                    onChange={(e) => setQty(e.target.value)}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Total</span>
                    <span className="font-bold text-lg">৳{ticket.price * quantity}</span>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full brand-gradient text-white font-semibold"
                    isDisabled={booking}
                    onPress={handleBook}
                  >
                    {booking ? "Booking..." : "Book now"}
                  </Button>
                  <p className="text-muted text-xs text-center">
                    You won&apos;t be charged yet — confirm from your dashboard.
                  </p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid place-items-center w-9 h-9 rounded-lg bg-accent-soft text-accent-soft-foreground shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <div>
        <p className="text-muted text-xs">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
