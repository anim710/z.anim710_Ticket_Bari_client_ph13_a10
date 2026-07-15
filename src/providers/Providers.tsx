"use client";
import { RouterProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {/* HeroUI v3: no HeroUIProvider — RouterProvider wires href navigation to Next */}
      <RouterProvider navigate={(href) => router.push(href)}>
        {children}
      </RouterProvider>
    </NextThemesProvider>
  );
}