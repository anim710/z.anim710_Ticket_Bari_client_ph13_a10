"use client";
import { useEffect } from "react";
import { Xmark } from "@gravity-ui/icons";

export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass =
    size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-sm" : "max-w-md";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeClass} max-h-[90vh] overflow-y-auto bg-surface border border-separator rounded-2xl shadow-2xl`}
      >
        <div className="flex items-center justify-between gap-4 p-5 border-b border-separator">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
            aria-label="Close"
          >
            <Xmark className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-separator">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
