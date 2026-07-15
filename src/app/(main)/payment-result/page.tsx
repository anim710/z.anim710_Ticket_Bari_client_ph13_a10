"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Spinner } from "@heroui/react";
import { CircleCheck, CircleXmark, Clock } from "@gravity-ui/icons";
import api from "@/lib/axios";

function PaymentResult() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status");
  const bookingId = params.get("bookingId");

  // success states: "confirming" | "paid" | "processing"
  const [state, setState] = useState(status === "success" ? "confirming" : "cancel");

  useEffect(() => {
    if (status !== "success") return;

    const token = localStorage.getItem("tb_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    let attempts = 0;
    let timer;

    const poll = async () => {
      attempts += 1;
      try {
        const { data } = await api.get("/bookings/my");
        const booking = Array.isArray(data)
          ? data.find((b) => b._id === bookingId)
          : null;
        if (booking?.status === "paid") {
          setState("paid");
          return;
        }
      } catch {
        /* ignore and retry */
      }
      // Webhook can lag a moment; poll for ~12s then fall back.
      if (attempts >= 8) {
        setState("processing");
        return;
      }
      timer = setTimeout(poll, 1500);
    };

    poll();
    return () => clearTimeout(timer);
  }, [status, bookingId, router]);

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <Card className="bg-surface border border-separator">
        <Card.Content className="p-8 text-center">
          {state === "confirming" && (
            <>
              <div className="flex justify-center mb-5">
                <Spinner size="lg" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Confirming your payment…</h1>
              <p className="text-muted text-sm">Hang tight, this only takes a moment.</p>
            </>
          )}

          {state === "paid" && (
            <>
              <div className="flex justify-center mb-5">
                <span className="grid place-items-center w-16 h-16 rounded-full bg-success-soft text-success-soft-foreground">
                  <CircleCheck className="w-9 h-9" />
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment successful!</h1>
              <p className="text-muted text-sm mb-6">
                Your ticket is now confirmed. A receipt is available in your transaction history.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="primary"
                  className="brand-gradient text-white"
                  onPress={() => router.push("/dashboard/my-booked-tickets")}
                >
                  My booked tickets
                </Button>
                <Button variant="outline" onPress={() => router.push("/dashboard/transactions")}>
                  View transactions
                </Button>
              </div>
            </>
          )}

          {state === "processing" && (
            <>
              <div className="flex justify-center mb-5">
                <span className="grid place-items-center w-16 h-16 rounded-full bg-accent-soft text-accent-soft-foreground">
                  <Clock className="w-9 h-9" />
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment received</h1>
              <p className="text-muted text-sm mb-6">
                We&apos;re still finalizing your booking. It will update to &quot;paid&quot; shortly — check your booked tickets in a minute.
              </p>
              <Button
                variant="primary"
                className="brand-gradient text-white"
                onPress={() => router.push("/dashboard/my-booked-tickets")}
              >
                Go to my booked tickets
              </Button>
            </>
          )}

          {state === "cancel" && (
            <>
              <div className="flex justify-center mb-5">
                <span className="grid place-items-center w-16 h-16 rounded-full bg-danger-soft text-danger-soft-foreground">
                  <CircleXmark className="w-9 h-9" />
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment cancelled</h1>
              <p className="text-muted text-sm mb-6">
                No charge was made. You can complete the payment any time from your booked tickets.
              </p>
              <Button
                variant="primary"
                className="brand-gradient text-white"
                onPress={() => router.push("/dashboard/my-booked-tickets")}
              >
                Back to my booked tickets
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
    </section>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-32">
          <Spinner size="lg" />
        </div>
      }
    >
      <PaymentResult />
    </Suspense>
  );
}
