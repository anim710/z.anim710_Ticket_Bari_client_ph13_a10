"use client";
import { JSX, useEffect, useState } from "react";
import { Clock } from "@gravity-ui/icons";

function diff(target: unknown) {
  const ms = new Date(target as string | number | Date).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return ms;
}

export default function Countdown({
  date,
  className,
}: {
  date: unknown;
  className?: string;
}): JSX.Element {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [date]);

  const ms = diff(date);

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

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  parts.push(`${hours}h`, `${mins}m`, `${secs}s`);

  return (
    <span className={`inline-flex items-center gap-1.5 text-accent text-sm font-semibold tabular-nums ${className}`}>
      <Clock className="w-4 h-4" /> {parts.join(" ")}
    </span>
  );
}
