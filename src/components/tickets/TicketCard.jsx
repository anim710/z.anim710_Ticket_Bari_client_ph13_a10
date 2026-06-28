"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin } from "@gravity-ui/icons";
import { Card, Button, Chip } from "@heroui/react";

export default function TicketCard({ ticket }) {
  const router = useRouter();
  return (
    <Card className="group bg-surface border border-separator hover:border-accent transition-all h-full rounded-2xl overflow-hidden flex flex-col">
      <Card.Content className="p-0">
        <div className="relative">
          <img
            src={ticket?.image}
            alt={ticket?.title}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Chip
            size="sm"
            variant="primary"
            className="absolute top-3 left-3 brand-gradient text-white border-0"
          >
            {ticket?.transportType}
          </Chip>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{ticket?.title}</h3>

          {ticket?.from && ticket?.to && (
            <p className="text-muted text-sm flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-accent" />
              {ticket.from} → {ticket.to}
            </p>
          )}

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-accent font-bold text-xl">৳{ticket?.price}</span>
            <span className="text-muted text-sm">/ seat</span>
          </div>
          <p className="text-muted text-sm">Seats available: {ticket?.quantity}</p>

          {ticket?.perks?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {ticket.perks.slice(0, 3).map((p) => (
                <span
                  key={p}
                  className="text-xs bg-surface-secondary text-surface-secondary-foreground border border-separator px-2 py-0.5 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card.Content>

      <Card.Footer className="mt-auto pt-0 px-4 pb-4">
        <Button
          onPress={() => router.push(`/tickets/${ticket?._id}`)}
          variant="primary"
          className="w-full brand-gradient text-white font-medium"
        >
          See details <ArrowRight className="w-4 h-4" />
        </Button>
      </Card.Footer>
    </Card>
  );
}
