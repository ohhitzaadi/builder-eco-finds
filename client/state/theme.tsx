import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "./storage";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const KEY = "theme";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => loadJSON<Theme>(KEY, "system"));
  const [resolved, setResolved] = useState<"light" | "dark">(() => (theme === "system" ? getSystemTheme() : theme));

  useEffect(() => {
    const updateResolved = () => {
      const r = theme === "system" ? getSystemTheme() : theme;
      setResolved(r);
      const root = document.documentElement;
      if (r === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    };

    updateResolved();

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const listener = () => updateResolved();
    try {
      mq?.addEventListener?.("change", listener);
    } catch {
      // safari
      mq?.addListener?.(listener as any);
    }

    return () => {
      try { mq?.removeEventListener?.("change", listener); } catch { mq?.removeListener?.(listener as any); }
    };
  }, [theme]);

  useEffect(() => {
    saveJSON(KEY, theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggle = () => setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

  const value = useMemo(() => ({ theme, resolved, setTheme, toggle }), [theme, resolved]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
