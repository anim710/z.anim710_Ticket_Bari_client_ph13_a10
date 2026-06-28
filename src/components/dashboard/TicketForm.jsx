"use client";
import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { uploadImage } from "@/lib/imgbb";

const TRANSPORT_TYPES = ["Bus", "Train", "Launch", "Plane"];
const PERK_OPTIONS = ["AC", "Breakfast", "WiFi", "Charging Port", "Snacks", "Blanket", "Water"];

function toInputDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  // Format as local datetime-local string (YYYY-MM-DDTHH:mm)
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TicketForm({ initial, user, onSubmit, submitLabel = "Add Ticket" }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    from: initial?.from || "",
    to: initial?.to || "",
    transportType: initial?.transportType || "Bus",
    price: initial?.price ?? "",
    quantity: initial?.quantity ?? "",
    departureDate: toInputDateTime(initial?.departureDate),
  });
  const [perks, setPerks] = useState(initial?.perks || []);
  const [imageUrl, setImageUrl] = useState(initial?.image || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const togglePerk = (perk) =>
    setPerks((prev) =>
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]
    );

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.from || !form.to || !form.price || !form.quantity) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!imageUrl) {
      setError("Please upload a ticket image.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      from: form.from.trim(),
      to: form.to.trim(),
      transportType: form.transportType,
      price: Number(form.price),
      quantity: Number(form.quantity),
      departureDate: form.departureDate ? new Date(form.departureDate).toISOString() : null,
      perks,
      image: imageUrl,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const labelCls = "text-xs text-muted";
  const selectCls =
    "bg-field text-field-foreground border border-separator rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-focus";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label="Ticket title" value={form.title} onChange={set("title")} placeholder="Dhaka to Cox's Bazar Express" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="From" value={form.from} onChange={set("from")} placeholder="Dhaka" />
        <Input label="To" value={form.to} onChange={set("to")} placeholder="Cox's Bazar" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Transport type</label>
          <select value={form.transportType} onChange={set("transportType")} className={selectCls}>
            {TRANSPORT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <Input type="number" label="Price (per unit)" min={0} value={String(form.price)} onChange={set("price")} placeholder="1200" />
        <Input type="number" label="Ticket quantity" min={1} value={String(form.quantity)} onChange={set("quantity")} placeholder="40" />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelCls}>Departure date &amp; time</label>
        <input type="datetime-local" value={form.departureDate} onChange={set("departureDate")} className={selectCls} />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelCls}>Perks</label>
        <div className="flex flex-wrap gap-2">
          {PERK_OPTIONS.map((perk) => {
            const active = perks.includes(perk);
            return (
              <button
                key={perk}
                type="button"
                onClick={() => togglePerk(perk)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-soft-foreground border-accent"
                    : "bg-surface text-muted border-separator hover:text-foreground"
                }`}
              >
                {perk}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelCls}>Ticket image</label>
        <input type="file" accept="image/*" onChange={handleImage} className="text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent-soft file:text-accent-soft-foreground file:px-3 file:py-2 file:text-sm file:font-medium" />
        {uploading && <span className="text-xs text-muted">Uploading image…</span>}
        {imageUrl && (
          <img src={imageUrl} alt="preview" className="mt-1 w-40 h-24 object-cover rounded-xl border border-separator" />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Vendor name" value={user?.name || ""} isReadOnly isDisabled />
        <Input label="Vendor email" value={user?.email || ""} isReadOnly isDisabled />
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm bg-danger-soft text-danger-soft-foreground">{error}</div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full brand-gradient text-white font-semibold"
        isDisabled={submitting || uploading}
      >
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
