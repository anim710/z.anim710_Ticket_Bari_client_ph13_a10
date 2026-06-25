"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import { Car } from "@gravity-ui/icons";

// ── Only import valid HeroUI v3 core primitives ──
import {
  Avatar,
  Dropdown,
  Button,
  Switch,
} from "@heroui/react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to determine if a route link is currently active
  const isActive = (path) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-800 bg-navy-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ── Column 1: Logo ── */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Car className="h-6 w-6 text-accent animate-pulse" />
            <span>Ticket<span className="text-accent">Bari</span></span>
          </Link>
        </div>

        {/* ── Column 2: Nav Items (Desktop Navigation) ── */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-accent font-semibold" : "text-slate-300 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/tickets" 
            className={`text-sm font-medium transition-colors ${
              isActive("/tickets") ? "text-accent font-semibold" : "text-slate-300 hover:text-white"
            }`}
          >
            All Tickets
          </Link>
          
          {/* Dashboard is structurally private, always accessible but view depends on auth */}
          <Link 
            href="/dashboard/profile" 
            className={`text-sm font-medium transition-colors ${
              isActive("/dashboard") ? "text-accent font-semibold" : "text-slate-300 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* ── Column 3: Actions & Auth Configuration ── */}
        <div className="flex items-center gap-4">
          
          {/* Challenge Element: Dark/Light Mode Switch */}
          <Switch
            size="sm"
            isSelected={theme === "dark"}
            onValueChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
            aria-label="Toggle theme color"
          />

          {session?.user ? (
            /* Logged In State: Dropdown Portal Menu */
            <Dropdown placement="bottom-end">
              <Dropdown.Trigger>
                <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-full p-0.5">
                  <Avatar 
                    src={session.user.image || undefined} 
                    name={session.user.name || "User"} 
                    size="sm" 
                    className="cursor-pointer border border-accent/20" 
                  />
                  <span className="hidden lg:inline text-sm font-medium text-slate-200">
                    {session.user.name}
                  </span>
                </button>
              </Dropdown.Trigger>
              <Dropdown.Portal>
                <Dropdown.Content 
                  presentation="popover" 
                  className="w-48 bg-navy-800 border border-navy-700 shadow-xl rounded-xl p-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
                >
                  <Dropdown.Item id="user-details" className="px-3 py-2 border-b border-navy-700/50 pointer-events-none mb-1">
                    <p className="text-xs text-slate-400 font-normal">Logged in as</p>
                    <p className="text-sm text-white font-semibold truncate">{session.user.name}</p>
                  </Dropdown.Item>
                  <Dropdown.Item id="profile-link" className="w-full">
                    <Link href="/dashboard/profile" className="block text-slate-200 hover:text-white w-full h-full px-3 py-2 rounded-lg transition-colors hover:bg-navy-700">
                      My Profile
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item id="logout-btn" className="w-full">
                    <button 
                      onClick={() => signOut()} 
                      className="w-full text-left font-medium text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg transition-colors hover:bg-rose-950/30"
                    >
                      Logout
                    </button>
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Portal>
            </Dropdown>
          ) : (
            /* Logged Out State: Render Direct Action Authentication Buttons */
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login">
                <Button size="sm" variant="ghost" className="text-slate-200 hover:text-white border-slate-700">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-accent text-white font-medium shadow-md shadow-accent/20 hover:bg-blue-600 transition-all">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Layout Toggle Button */}
          <button 
            className="block md:hidden text-slate-300 hover:text-white transition-colors focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer Menu Dropdown ── */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-navy-800 bg-navy-900/95 backdrop-blur-lg px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          <Link 
            href="/" 
            onClick={() => setIsMenuOpen(false)}
            className={`block rounded-lg px-3 py-2 text-base font-medium ${
              isActive("/") ? "bg-navy-800 text-accent" : "text-slate-300 hover:bg-navy-800"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/tickets" 
            onClick={() => setIsMenuOpen(false)}
            className={`block rounded-lg px-3 py-2 text-base font-medium ${
              isActive("/tickets") ? "bg-navy-800 text-accent" : "text-slate-300 hover:bg-navy-800"
            }`}
          >
            All Tickets
          </Link>
          <Link 
            href="/dashboard/profile" 
            onClick={() => setIsMenuOpen(false)}
            className={`block rounded-lg px-3 py-2 text-base font-medium ${
              isActive("/dashboard") ? "bg-navy-800 text-accent" : "text-slate-300 hover:bg-navy-800"
            }`}
          >
            Dashboard
          </Link>

          {/* Fallback Auth for Mobile View when logged out */}
          {!session?.user && (
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-navy-800 mt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" variant="flat" className="w-full bg-navy-800 text-slate-200">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="w-full bg-accent text-white">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}