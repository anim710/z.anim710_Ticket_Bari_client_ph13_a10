"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Spinner } from "@heroui/react";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";
import TicketForm from "@/components/dashboard/TicketForm";

export default function AddTicketPage() {
  const { user, allowed, loading } = useRequireRole("vendor");
  const router = useRouter();
  const [done, setDone] = useState(false);

  if (loading || !allowed) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleSubmit = async (payload) => {
    await api.post("/tickets", payload);
    setDone(true);
    setTimeout(() => router.push("/dashboard/my-added-tickets"), 800);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Add a ticket</h1>
        <p className="text-muted text-sm">
          New tickets start as <span className="font-medium">pending</span> until an admin approves them.
        </p>
      </div>

      {done && (
        <div className="rounded-xl px-4 py-3 text-sm bg-success-soft text-success-soft-foreground">
          Ticket added! Redirecting to your tickets…
        </div>
      )}

      <Card className="bg-surface border border-separator">
        <Card.Content className="p-6">
          <TicketForm user={user} onSubmit={handleSubmit} submitLabel="Add Ticket" />
        </Card.Content>
      </Card>
    </div>
  );
}
