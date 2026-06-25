import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy-900 text-white">
      {/* Sticky/Fixed Top Navigation */}
      <Navbar />
      
      {/* Dynamic Content Body Area with proper padding */}
      <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Footer at absolute bottom */}
      <Footer />
    </div>
  );
}