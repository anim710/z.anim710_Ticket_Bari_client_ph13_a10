import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import Link from "next/link";
import { ArrowRight } from "@gravity-ui/icons";

export default function TicketCard({ ticket }) {
  return (
    <Card className="bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all h-full">
      <CardBody className="p-0">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-44 object-cover rounded-t-xl"
        />
        <div className="p-4">
          <Chip size="sm" className="bg-blue-900 text-blue-300 mb-2">
            {ticket.transportType}
          </Chip>
          <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">
            {ticket.title}
          </h3>
          <p className="text-blue-400 font-semibold text-base mb-1">
            ৳{ticket.price}{" "}
            <span className="text-slate-400 font-normal text-sm">/ seat</span>
          </p>
          <p className="text-slate-400 text-sm mb-2">
            Seats available: {ticket.quantity}
          </p>
          {ticket.perks?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {ticket.perks.slice(0, 3).map((p) => (
                <span
                  key={p}
                  className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter className="pt-0 px-4 pb-4">
        <Button
          as={Link}
          href={`/tickets/${ticket._id}`}
          className="w-full bg-blue-600 text-white"
          endContent={<ArrowRight />}
        >
          See Details
        </Button>
      </CardFooter>
    </Card>
  );
}