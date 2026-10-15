import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks";
import {
  isTheme,
  type ResolvedTheme,
  type Theme,
  ThemeContext,
  THEME_STORAGE_KEY,
} from "./themeContext";

const PREFERS_DARK = "(prefers-color-scheme: dark)";

const readStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    // Storage blocked (private mode, disabled cookies): follow the system theme
    return "system";
  }
};

// Light / dark / system theme via the `dark` class on <html> (shadcn's dark variant).
// The first paint is handled by the inline script in index.html; this keeps it in sync after.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const prefersDark = useMediaQuery(PREFERS_DARK);
  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice still applies for this session
    }
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
