import Link from "next/link";
import { Bus } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Logo */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bus className="text-blue-500 w-5 h-5" />
            <span className="font-bold text-lg text-white">
              Ticket<span className="text-blue-500">Bari</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Book bus, train, launch & flight tickets easily.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-slate-400 text-sm">
            {["Home", "All Tickets", "Contact Us", "About"].map((l) => (
              <li key={l}>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>ticketbari@gmail.com</li>
            <li>+880 1700-000000</li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Facebook Page
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Payment */}
        <div>
          <h4 className="text-white font-semibold mb-3">Payment Methods</h4>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-xs font-medium">
              Stripe
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 text-center py-4 text-slate-500 text-sm">
        © 2025 TicketBari. All rights reserved.
      </div>
    </footer>
  );
}