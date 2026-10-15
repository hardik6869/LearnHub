import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

// Light / dark / system theme via the `dark` class on <html> (shadcn's dark variant)
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
