import Link from "next/link";
import { Ticket, CreditCard } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-separator mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1: Logo */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {/* Custom Image Logo replaces the old smaller icon wrapper */}
                      <img
                        src="/ticketbari-r.png"
                        alt="TicketBari Logo"
                        height={28}
                        width={56} 
                        className="h-10 w-auto object-contain" // Fluid width so it retains its natural shape
                      />
                      
                      <span className="font-bold text-lg">
                        Ticket<span className="brand-text">Bari</span>
                      </span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">
                      Book bus, train, launch and flight tickets across Bangladesh — fast, secure, and reliable.
                    </p>
                  </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-muted text-sm">
            {[
              { label: "Home", href: "/" },
              { label: "All Tickets", href: "/tickets" },
              { label: "My Dashboard", href: "/dashboard/profile" },
              { label: "Register", href: "/register" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-muted text-sm">
            <li>ticketbari@gmail.com</li>
            <li>+880 1700-000000</li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">
                Facebook Page
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Payment */}
        <div>
          <h4 className="font-semibold mb-3">Payment Methods</h4>
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-surface-secondary text-surface-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium border border-separator">
              <CreditCard className="w-4 h-4" /> Stripe
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-separator text-center py-4 text-muted text-sm">
        © {new Date().getFullYear()} TicketBari. All rights reserved.
      </div>
    </footer>
  );
}
