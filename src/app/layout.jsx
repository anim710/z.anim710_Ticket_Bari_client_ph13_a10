import "./globals.css";
import Providers from "@/providers/Providers";

export const metadata = {
  title: "TicketBari",
  description: "Book bus, train, launch & flight tickets easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}