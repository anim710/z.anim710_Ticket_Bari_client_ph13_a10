"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useRole } from "@/hooks/useRole";
import { Sun, Moon, Person, ArrowRightToSquare, Ticket } from "@gravity-ui/icons";
import {
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";

export default function AppNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const { user, role, logout }  = useRole();
  const { theme, setTheme }     = useTheme();
  const pathname = usePathname();

  // Avoid hydration mismatch with theme
  useEffect(() => setMounted(true), []);

  const navLinks = [
    { label: "Home",        href: "/" },
    { label: "All Tickets", href: "/tickets" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard/profile" }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-separator">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ───────────────────────────────────────────── */}
             <Link href="/" className="flex items-center gap-2 shrink-0">
                {/* Custom Image Logo with corrected aspect ratio */}
                <img
                  src="/ticketbari-r.png"
                  alt="TicketBari Logo"
                  height={36}
                  width={72} // Increased width to give the image breathing room
                  className="h-7 w-auto object-contain" // Locks height nicely with text, lets width scale naturally
                />
                
                {/* Your original text branding */}
                <span className="font-bold text-xl tracking-tight">
                  Ticket<span className="brand-text">Bari</span>
                </span>
              </Link>

        {/* ── Desktop nav links ───────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-soft-foreground"
                    : "text-muted hover:text-foreground hover:bg-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── Right side ──────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Dark/Light toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="grid place-items-center w-9 h-9 rounded-lg bg-surface hover:bg-surface-hover text-muted hover:text-foreground border border-separator transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Auth: logged in */}
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger className="flex items-center gap-2 bg-surface hover:bg-surface-hover border border-separator rounded-full pl-1 pr-3 py-1 transition-colors">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full brand-gradient grid place-items-center text-white text-sm font-bold overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name}
                         className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-24 truncate">
                  {user.name?.split(" ")[0]}
                </span>
              </DropdownTrigger>

              <DropdownMenu className="bg-surface border border-separator rounded-2xl shadow-xl p-1.5 min-w-56">
                <DropdownItem
                  key="info"
                  isReadOnly
                  className="px-3 py-2 cursor-default rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    <span className="text-muted text-xs truncate">{user.email}</span>
                    <span className="mt-1 w-fit bg-accent-soft text-accent-soft-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                      {role}
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  className="flex items-center gap-2 text-foreground hover:bg-surface-secondary rounded-lg px-3 py-2"
                  href="/dashboard/profile"
                >
                  <Person className="w-4 h-4" /> My Dashboard
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="flex items-center gap-2 text-danger hover:bg-danger-soft rounded-lg px-3 py-2"
                  onPress={logout}
                >
                  <ArrowRightToSquare className="w-4 h-4" /> Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

          ) : (
            /* Auth: not logged in */
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-muted hover:text-foreground px-4 py-2 rounded-lg hover:bg-surface transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-brand/30 hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden grid place-items-center w-9 h-9 rounded-lg bg-surface hover:bg-surface-hover text-muted border border-separator transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-separator px-4 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? "bg-accent-soft text-accent-soft-foreground"
                      : "text-muted hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {!user && (
              <div className="flex gap-2 pt-3 mt-2 border-t border-separator">
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-foreground border border-separator py-2.5 rounded-lg hover:bg-surface transition-colors text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center brand-gradient text-white py-2.5 rounded-lg transition-opacity hover:opacity-90 text-sm font-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
