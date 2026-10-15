import { createContext } from "react";

export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

export type ResolvedTheme = Exclude<Theme, "system">;

// localStorage key; must match the inline script in index.html that applies the theme before
// React loads (same key next-themes used, so saved choices carry over)
export const THEME_STORAGE_KEY = "theme";

export interface ThemeContextValue {
  /** The user's choice */
  theme: Theme;
  /** What is actually shown: "system" resolved through prefers-color-scheme */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const isTheme = (value: unknown): value is Theme =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value);
