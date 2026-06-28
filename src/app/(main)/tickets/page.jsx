"use client";
import { useEffect, useState, useCallback } from "react";
import { Input, Button } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";
import api from "@/lib/axios";
import TicketCard from "@/components/tickets/TicketCard";

const TRANSPORT_TYPES = ["", "Bus", "Train", "Launch", "Plane"];

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

export default function AllTicketsPage() {
  const [filters, setFilters] = useState({ from: "", to: "", type: "", sort: "" });
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      try {
        const { data } = await api.get("/tickets", {
          params: {
            from: filters.from || undefined,
            to: filters.to || undefined,
            type: filters.type || undefined,
            sort: filters.sort || undefined,
            page: targetPage,
          },
        });
        setTickets(data.tickets || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
        setPage(data.page || targetPage);
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchTickets(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets(1);
  };

  const resetFilters = () => {
    setFilters({ from: "", to: "", type: "", sort: "" });
    setTimeout(() => fetchTickets(1), 0);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All tickets</h1>
        <p className="text-muted">
          {total > 0 ? `${total} routes available` : "Search bus, train, launch & flight tickets"}
        </p>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-surface border border-separator rounded-2xl p-4 mb-10"
      >
        <Input
          label="From"
          placeholder="Dhaka"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <Input
          label="To"
          placeholder="Chittagong"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="bg-field text-field-foreground border border-separator rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
          >
            {TRANSPORT_TYPES.map((t) => (
              <option key={t || "all"} value={t}>
                {t || "All types"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">Sort by price</label>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="bg-field text-field-foreground border border-separator rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
          >
            <option value="">Default</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" variant="primary" className="flex-1 brand-gradient text-white font-semibold">
            <Magnifier className="w-4 h-4" /> Search
          </Button>
          <Button type="button" variant="outline" onPress={resetFilters}>
            Reset
          </Button>
        </div>
      </form>

      {/* ── Results ────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-24 text-muted border border-separator rounded-2xl bg-surface">
          No tickets found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((t) => (
              <TicketCard key={t._id} ticket={t} />
            ))}
          </div>

          {/* ── Pagination ───────────────────────────────────────── */}
          {pages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
              <Button variant="outline" isDisabled={page <= 1} onPress={() => fetchTickets(page - 1)}>
                Prev
              </Button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "primary" : "outline"}
                  className={p === page ? "brand-gradient text-white" : ""}
                  onPress={() => fetchTickets(p)}
                >
                  {p}
                </Button>
              ))}
              <Button variant="outline" isDisabled={page >= pages} onPress={() => fetchTickets(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
