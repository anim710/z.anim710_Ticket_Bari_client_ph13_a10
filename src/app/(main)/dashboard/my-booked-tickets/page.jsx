"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import { MapPin, Calendar, CreditCard } from "@gravity-ui/icons";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";
import Countdown from "@/components/dashboard/Countdown";

function formatDateTime(value) {
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

const STATUS_COLOR = {
  pending: "warning",
  accepted: "accent",
  paid: "success",
  rejected: "danger",
};

export default function MyBookedTicketsPage() {
  const router = useRouter();
  const { allowed, loading: roleLoading } = useRequireRole("user");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [payError, setPayError] = useState(null);

  const load = () => {
    api
      .get("/bookings/my")
      .then((r) => setBookings(Array.isArray(r.data) ? r.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!allowed) return;
    load();
  }, [allowed]);

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch {
      /* non-pending can't be cancelled */
    }
  };

  const startCheckout = async (booking) => {
    setPayError(null);
    setPayingId(booking._id);
    try {
      const res = await api.post("/payments/create-checkout-session", {
        bookingId: booking._id,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setPayError(err.response?.data?.message || "Could not start payment. Please try again.");
      setPayingId(null);
    }
  };

  if (roleLoading || !allowed || loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My booked tickets</h1>
          <p className="text-muted text-sm">{bookings.length} total</p>
        </div>
        <Button onPress={() => router.push("/tickets")} variant="outline" size="sm">
          Browse tickets
        </Button>
      </div>

      {payError && (
        <div className="rounded-xl px-4 py-3 text-sm bg-danger-soft text-danger-soft-foreground">
          {payError}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-separator rounded-2xl">
          <p className="text-muted mb-4">You haven&apos;t booked any tickets yet.</p>
          <Button onPress={() => router.push("/tickets")} variant="primary" className="brand-gradient text-white">
            Find a ticket
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => {
            const qty = b.quantity || 1;
            const total = b.totalPrice ?? (b.unitPrice || 0) * qty;
            const departed = b.departureDate && new Date(b.departureDate) < new Date();
            const canPay = b.status === "accepted" && !departed;

            return (
              <Card key={b._id} className="bg-surface border border-separator overflow-hidden flex flex-col">
                <Card.Content className="p-0">
                  <div className="relative">
                    <img
                      src={b.image || "https://placehold.co/600x300?text=Ticket"}
                      alt={b.ticketTitle}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Chip
                      size="sm"
                      color={STATUS_COLOR[b.status] || "default"}
                      variant="soft"
                      className="absolute top-3 right-3 capitalize"
                    >
                      {b.status || "pending"}
                    </Chip>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg line-clamp-1">{b.ticketTitle || "Ticket"}</h3>

                    {b.from && b.to && (
                      <p className="text-muted text-sm flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-accent" /> {b.from} → {b.to}
                      </p>
                    )}

                    <p className="text-muted text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-accent" /> {formatDateTime(b.departureDate)}
                    </p>

                    <div className="flex items-center justify-between text-sm pt-1">
                      <span className="text-muted">{qty} seat(s)</span>
                      <span className="font-bold text-accent text-lg">৳{total}</span>
                    </div>

                    {/* Countdown hidden once rejected */}
                    {b.status !== "rejected" && (
                      <div className="pt-1">
                        <Countdown date={b.departureDate} />
                      </div>
                    )}
                  </div>
                </Card.Content>

                <Card.Footer className="mt-auto px-4 pb-4 pt-0 flex flex-col gap-2">
                  {canPay && (
                    <Button
                      variant="primary"
                      className="w-full brand-gradient text-white font-semibold"
                      isDisabled={payingId === b._id}
                      onPress={() => startCheckout(b)}
                    >
                      <CreditCard className="w-4 h-4" /> {payingId === b._id ? "Redirecting..." : "Pay Now"}
                    </Button>
                  )}
                  {b.status === "accepted" && departed && (
                    <Button variant="outline" className="w-full" isDisabled>
                      Departed — cannot pay
                    </Button>
                  )}
                  {b.status === "paid" && (
                    <Chip color="success" variant="soft" className="self-start">Payment complete</Chip>
                  )}
                  {b.status === "pending" && (
                    <Button
                      size="sm"
                      variant="danger-soft"
                      className="self-start"
                      onPress={() => cancelBooking(b._id)}
                    >
                      Cancel request
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
