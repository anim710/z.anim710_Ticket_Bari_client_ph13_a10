"use client";
import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { uploadImage } from "@/lib/imgbb";

const TRANSPORT_TYPES = ["Bus", "Train", "Launch", "Plane"];
const PERK_OPTIONS = [
  "AC",
  "Breakfast",
  "WiFi",
  "Charging Port",
  "Snacks",
  "Blanket",
  "Water",
];

function toInputDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TicketForm({
  initial,
  user,
  onSubmit,
  submitLabel = "Add Ticket",
}) {
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
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk],
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

    if (
      !form.title ||
      !form.from ||
      !form.to ||
      !form.price ||
      !form.quantity
    ) {
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
      departureDate: form.departureDate
        ? new Date(form.departureDate).toISOString()
        : null,
      perks,
      image: imageUrl,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Explicit label styling for high visibility
  const labelCls = "text-sm font-medium text-slate-700 mb-1.5 block dark:text-white";
  const selectCls =
    "bg-slate-50 text-slate-900  dark:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl px-3 h-[40px] text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all cursor-pointer shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl mx-auto p-6 bg-white dark:bg-[#0d0e12] rounded-2xl border border-slate-100 shadow-sm">
      
      {/* ── Transport Name Row ─────────────────────────────── */}
      <div className="flex flex-col">
        <label className={labelCls}>Transportation Name</label>
        <Input
          value={form.title}
          onChange={set("title")}
          placeholder="Dhaka to Cox's Bazar Express"
          variant="bordered"
          size="sm"
        />
      </div>

      {/* ── From & Destination Grid Row ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className={labelCls}>From</label>
          <Input
            value={form.from}
            onChange={set("from")}
            placeholder="Dhaka"
            variant="bordered"
            size="sm"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelCls}>Destination</label>
          <Input
            value={form.to}
            onChange={set("to")}
            placeholder="Cox's Bazar"
            variant="bordered"
            size="sm"
          />
        </div>
      </div>

      {/* ── Type, Price, & Seats Grid Row ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* 1. Transport Type Selection */}
        <div className="flex flex-col">
          <label className={labelCls}>Transport type</label>
          <select
            value={form.transportType}
            onChange={set("transportType")}
            className={selectCls}
          >
            {TRANSPORT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Ticket Price Input */}
        <div className="flex flex-col">
          <label className={labelCls}>Ticket Price</label>
          <Input
            type="number"
            min={0}
            value={String(form.price)}
            onChange={set("price")}
            placeholder="1200"
            variant="bordered"
            size="sm"
          />
        </div>

        {/* 3. Number of Seats Input */}
        <div className="flex flex-col">
          <label className={labelCls}>Number of seats</label>
          <Input
            type="number"
            min={1}
            value={String(form.quantity)}
            onChange={set("quantity")}
            placeholder="40"
            variant="bordered"
            size="sm"
          />
        </div>
      </div>

      {/* ── Departure Date & Time Row ──────────────────────── */}
      <div className="flex flex-col">
        <label className={labelCls}>Departure date &amp; time</label>
        <input
          type="datetime-local"
          value={form.departureDate}
          onChange={set("departureDate")}
          className="bg-slate-50 text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl px-3 h-[40px] text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all shadow-sm"
        />
      </div>

      {/* ── Perks Selectors Row ────────────────────────────── */}
      <div className="flex flex-col">
        <label className={labelCls}>Perks</label>
        <div className="flex flex-wrap gap-2">
          {PERK_OPTIONS.map((perk) => {
            const active = perks.includes(perk);
            return (
              <button
                key={perk}
                type="button"
                onClick={() => togglePerk(perk)}
                className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                  active
                    ? "bg-primary text-white border-primary font-medium"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {perk}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Media Drop Zone Row ────────────────────────────── */}
      <div className="flex flex-col">
        <label className={labelCls}>Ticket image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:px-4 file:py-2 file:text-xs file:font-medium file:cursor-pointer hover:file:bg-slate-200 transition-all"
        />
        {uploading && (
          <span className="text-xs text-slate-400 animate-pulse mt-1">
            Uploading image…
          </span>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            className="mt-2 w-40 h-24 object-cover rounded-xl border border-slate-200 shadow-sm"
          />
        )}
      </div>

      {/* ── Vendor Metadata Information Row ────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className={labelCls}>Vendor name</label>
          <Input
            value={user?.name || ""}
            readOnly
            isDisabled
            variant="flat"
            size="sm"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelCls}>Vendor email</label>
          <Input
            value={user?.email || ""}
            readOnly
            isDisabled
            variant="flat"
            size="sm"
          />
        </div>
      </div>

      {/* ── Error Output Box ────────────────────────────────── */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* ── Form Execution Action Trigger ──────────────────── */}
      <Button
        type="submit"
        className="w-full brand-gradient text-white font-semibold h-[44px] text-sm rounded-xl shadow-md hover:opacity-95 transition-opacity mt-2"
        isDisabled={submitting || uploading}
      >
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}