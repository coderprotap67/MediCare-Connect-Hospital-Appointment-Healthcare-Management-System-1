"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function MyThemeProvider({ children }) {
  return (
    <NextThemesProvider 
      attribute="data-theme" 
      defaultTheme="light" 
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}