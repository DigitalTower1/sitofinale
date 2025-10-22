'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'digital-tower-theme';

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const rootTheme = document.documentElement.dataset.theme;
  if (rootTheme === 'light' || rootTheme === 'dark') {
    return rootTheme;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (error) {
    // Ignore storage access errors and fall back to system preference.
  }

  const prefersLight = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: light)').matches
    : false;
  return prefersLight ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const body = document.body;
  root.dataset.theme = theme;
  if (body) {
    body.dataset.theme = theme;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => resolveInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    applyTheme(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // Ignore storage access errors so theme toggling still works.
    }
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
