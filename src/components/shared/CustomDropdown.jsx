"use client";
import { useState, useEffect, useRef } from "react";
import { Person, ArrowRightToSquare, Ticket } from "@gravity-ui/icons";

export default function CustomDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown manually
  const closeDropdown = () => setIsOpen(false);

  // 1. Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Close dropdown when pressing the Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* ── Dropdown Trigger Button ────────────────────────── */}
      <button
        onClick={toggleDropdown}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-2 bg-surface hover:bg-surface-hover border border-separator rounded-full pl-1 pr-3 py-1 transition-colors cursor-pointer select-none outline-none focus:ring-2 focus:ring-accent"
      >
        <div className="w-8 h-8 rounded-full brand-gradient grid place-items-center text-white text-sm font-bold overflow-hidden">
          S
        </div>
        <span className="text-sm font-medium text-foreground">Super Admin</span>
        
        {/* Animated Chevron Indicator */}
        <svg
          className={`w-4 h-4 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Dropdown Menu Menu Card ────────────────────────── */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 origin-top-right bg-surface border border-separator rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          role="menu"
        >
          {/* Read-only User Info Section */}
          <div className="px-3 py-2 cursor-default rounded-lg border-b border-separator/50 mb-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground truncate">Super Admin</span>
              <span className="text-muted text-xs truncate">admin@ticketbari.com</span>
              <span className="mt-1 w-fit bg-accent-soft text-accent-soft-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                Admin
              </span>
            </div>
          </div>

          {/* Interactive Menu Items */}
          <button
            onClick={() => { console.log("Navigating to Profile..."); closeDropdown(); }}
            className="w-full flex items-center gap-2 text-foreground hover:bg-surface-secondary rounded-lg px-3 py-2 text-sm transition-colors text-left"
            role="menuitem"
          >
            <Person className="w-4 h-4" /> My Dashboard
          </button>

          <button
            onClick={() => { console.log("Navigating to Tickets..."); closeDropdown(); }}
            className="w-full flex items-center gap-2 text-foreground hover:bg-surface-secondary rounded-lg px-3 py-2 text-sm transition-colors text-left"
            role="menuitem"
          >
            <Ticket className="w-4 h-4" /> Bookings
          </button>

          <button
            onClick={() => { console.log("Logging out..."); closeDropdown(); }}
            className="w-full flex items-center gap-2 text-danger hover:bg-danger-soft rounded-lg px-3 py-2 text-sm transition-colors text-left mt-1 pt-2 border-t border-separator/50"
            role="menuitem"
          >
            <ArrowRightToSquare className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}