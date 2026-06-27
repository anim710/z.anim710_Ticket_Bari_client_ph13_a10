"use client";
// 1. FIX: Only import the validated named RouterProvider that exists in the module
import { RouterProvider } from "@heroui/react"; 
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark"
      enableSystem={false}
    >
      {/* 2. FIX: Use RouterProvider as your root UI engine */}
      <RouterProvider>
        {children}
      </RouterProvider>
    </NextThemesProvider>
  );
}