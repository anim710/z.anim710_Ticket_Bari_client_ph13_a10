import Providers from "@/providers/Providers";
import "./globals.css"; // Ensure Tailwind v4 is imported here globally!

export const metadata = {
  title: "TicketBari | Online Ticket Booking Platform",
  description: "Book bus, train, launch & flight tickets easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-navy-900 text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}