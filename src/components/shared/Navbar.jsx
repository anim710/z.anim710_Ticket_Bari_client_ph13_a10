"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useRole } from "@/hooks/useRole";
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900
                    border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ── Logo ───────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🚌</span>
          <span className="font-bold text-xl text-white">
            Ticket<span className="text-blue-500">Bari</span>
          </span>
        </Link>

        {/* ── Desktop nav links ───────────────────────────────── */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-blue-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Right side ──────────────────────────────────────── */}
        <div className="flex items-center gap-3">

          {/* Dark/Light toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700
                         text-slate-300 transition-colors text-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}

          {/* Auth: logged in */}
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className="flex items-center gap-2 bg-slate-800
                                   hover:bg-slate-700 rounded-full px-2 py-1
                                   transition-colors">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center
                                  justify-center text-white text-sm font-bold overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name}
                           className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-slate-300 text-sm hidden sm:block max-w-24 truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                </button>
              </DropdownTrigger>

              <DropdownMenu
                className="bg-slate-800 border border-slate-700 rounded-xl
                           shadow-xl p-1 min-w-48"
              >
                <DropdownItem
                  key="info"
                  isReadOnly
                  className="text-slate-400 text-xs px-3 py-2 cursor-default"
                >
                  {user.email}
                  <span className="ml-2 bg-blue-900 text-blue-300 px-1.5 py-0.5
                                   rounded text-xs capitalize">
                    {role}
                  </span>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  className="text-slate-300 hover:bg-slate-700 rounded-lg px-3 py-2"
                  as={Link}
                  href="/dashboard/profile"
                >
                  👤 My Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-red-400 hover:bg-red-900/30 rounded-lg px-3 py-2"
                  onPress={logout}
                >
                  🚪 Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

          ) : (
            /* Auth: not logged in */
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="text-slate-300 hover:text-white text-sm
                           px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm
                           font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700
                       text-slate-300 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300
                ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300
                ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300
                ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium py-2 transition-colors ${
                  pathname === link.href
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-slate-300 border border-slate-600
                             py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white
                             py-2 rounded-lg transition-colors text-sm font-semibold">
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