"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "@gravity-ui/icons";
import api from "@/lib/axios";
import TicketCard from "../tickets/TicketCard";

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-separator bg-surface overflow-hidden animate-pulse">
      <div className="h-44 bg-surface-secondary" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 bg-surface-secondary rounded" />
        <div className="h-5 w-3/4 bg-surface-secondary rounded" />
        <div className="h-4 w-1/3 bg-surface-secondary rounded" />
      </div>
    </div>
  );
}

export default function LatestTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tickets/latest")
      .then((r) => setTickets(r.data))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-surface/40 border-y border-separator">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-accent">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Just added</span>
            </div>
            <h2 className="text-3xl font-bold">Latest tickets</h2>
            <p className="text-muted mt-1">Recently listed — grab yours fast</p>
          </div>
          <Link
            href="/tickets"
            className="hidden sm:inline-flex items-center gap-1 text-accent hover:underline text-sm font-medium shrink-0"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : tickets.map((t) => <TicketCard key={t._id} ticket={t} />)}
        </div>

        {!loading && tickets.length === 0 && (
          <p className="text-muted text-center py-10">No tickets available yet.</p>
        )}
      </div>
    </section>
  );
}
