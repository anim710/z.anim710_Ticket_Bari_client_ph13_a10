import Providers from "@/providers/Providers";
import "./globals.css";

export const metadata = {
  title: "TicketBari | Online Ticket Booking Platform",
  description: "Book bus, train, launch & flight tickets easily",
};

export default function RootLayout({ children }) {
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