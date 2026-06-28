import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}