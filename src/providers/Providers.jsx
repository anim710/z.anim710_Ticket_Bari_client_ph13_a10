"use client";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <HeroUIProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  );
}