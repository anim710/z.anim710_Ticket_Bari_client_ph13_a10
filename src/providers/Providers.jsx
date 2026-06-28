"use client";
import { RouterProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }) {
  const router = useRouter();

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {/* Wire react-aria/HeroUI client navigation (e.g. items with `href`) to Next's router */}
      <RouterProvider navigate={(href) => router.push(href)}>
        {children}
      </RouterProvider>
    </NextThemesProvider>
  );
}