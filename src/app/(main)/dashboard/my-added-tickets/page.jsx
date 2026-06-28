"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import { MapPin, Pencil, TrashBin, Plus } from "@gravity-ui/icons";
import api from "@/lib/axios";
import { useRequireRole } from "@/hooks/useRequireRole";
import TicketForm from "@/components/dashboard/TicketForm";
import Modal from "@/components/dashboard/Modal";

const VERIFY_COLOR = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export default function MyAddedTicketsPage() {
  const router = useRouter();
  const { user, allowed, loading: roleLoading } = useRequireRole("vendor");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    api
      .get("/tickets/vendor/my-tickets")
      .then((r) => setTickets(Array.isArray(r.data) ? r.data : []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!allowed) return;
    load();
  }, [allowed]);

  const handleUpdate = async (payload) => {
    await api.patch(`/tickets/${editing._id}`, payload);
    setEditing(null);
    setLoading(true);
    load();
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/tickets/${deleting._id}`);
      setTickets((prev) => prev.filter((t) => t._id !== deleting._id));
    } catch {
      /* ignore */
    } finally {
      setDeleting(null);
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
          <h1 className="text-2xl font-bold">My added tickets</h1>
          <p className="text-muted text-sm">{tickets.length} total</p>
        </div>
        <Button onPress={() => router.push("/dashboard/add-ticket")} variant="primary" className="brand-gradient text-white" size="sm">
          <Plus className="w-4 h-4" /> Add ticket
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-separator rounded-2xl">
          <p className="text-muted mb-4">You haven&apos;t added any tickets yet.</p>
          <Button onPress={() => router.push("/dashboard/add-ticket")} variant="primary" className="brand-gradient text-white">
            Add your first ticket
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => {
            const rejected = t.verificationStatus === "rejected";
            return (
              <Card key={t._id} className="bg-surface border border-separator overflow-hidden flex flex-col">
                <Card.Content className="p-0">
                  <div className="relative">
                    <img src={t.image} alt={t.title} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Chip
                      size="sm"
                      color={VERIFY_COLOR[t.verificationStatus] || "default"}
                      variant="soft"
                      className="absolute top-3 right-3 capitalize"
                    >
                      {t.verificationStatus || "pending"}
                    </Chip>
                    {t.isAdvertised && (
                      <Chip size="sm" variant="primary" className="absolute top-3 left-3 brand-gradient text-white border-0">
                        Advertised
                      </Chip>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg line-clamp-1">{t.title}</h3>
                    {t.from && t.to && (
                      <p className="text-muted text-sm flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-accent" /> {t.from} → {t.to}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm pt-1">
                      <span className="text-muted">{t.quantity} seats</span>
                      <span className="font-bold text-accent text-lg">৳{t.price}</span>
                    </div>
                  </div>
                </Card.Content>

                <Card.Footer className="mt-auto px-4 pb-4 pt-0 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    isDisabled={rejected}
                    onPress={() => setEditing(t)}
                  >
                    <Pencil className="w-4 h-4" /> Update
                  </Button>
                  <Button
                    size="sm"
                    variant="danger-soft"
                    className="flex-1"
                    isDisabled={rejected}
                    onPress={() => setDeleting(t)}
                  >
                    <TrashBin className="w-4 h-4" /> Delete
                  </Button>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      )}

      {/* Update modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Update ticket" size="lg">
        {editing && (
          <TicketForm
            initial={editing}
            user={user}
            onSubmit={handleUpdate}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete ticket"
        size="sm"
        footer={
          <>
            <Button variant="outline" onPress={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onPress={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Are you sure you want to delete <span className="font-medium text-foreground">{deleting?.title}</span>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
