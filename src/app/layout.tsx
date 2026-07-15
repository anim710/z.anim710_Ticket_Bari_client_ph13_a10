import Providers from "@/providers/Providers";
import "./globals.css";
import React from "react";

export const metadata = {
  title: "TicketBari | Online Ticket Booking Platform",
  description: "Book bus, train, launch & flight tickets easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}