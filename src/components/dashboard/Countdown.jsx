"use client";
import { useEffect, useState } from "react";
import { Clock } from "@gravity-ui/icons";

function diff(target) {
  const ms = new Date(target).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return ms;
}

export default function Countdown({ date, className = "" }) {
  const [ms, setMs] = useState(() => diff(date));

  useEffect(() => {
    setMs(diff(date));
    const id = setInterval(() => setMs(diff(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  if (ms === null) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-muted text-sm ${className}`}>
        <Clock className="w-4 h-4" /> No departure set
      </span>
    );
  }

  if (ms <= 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-danger text-sm font-medium ${className}`}>
        <Clock className="w-4 h-4" /> Departed
      </span>
    );
  }

  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  parts.push(`${hours}h`, `${mins}m`, `${secs}s`);

  return (
    <span className={`inline-flex items-center gap-1.5 text-accent text-sm font-semibold tabular-nums ${className}`}>
      <Clock className="w-4 h-4" /> {parts.join(" ")}
    </span>
  );
}
