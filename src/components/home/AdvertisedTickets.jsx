"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import TicketCard from "../tickets/TicketCard";

export default function AdvertisedTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get("/tickets/advertised").then((r) => setTickets(r.data));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-white mb-2">
        🎯 Featured Tickets
      </h2>
      <p className="text-slate-400 mb-8">Hand-picked deals for you</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((t) => (
          <TicketCard key={t._id} ticket={t} />
        ))}
      </div>
    </section>
  );
}