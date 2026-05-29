'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './index';

// ─── Context ──────────────────────────────────────────────────────────────────

type ColorMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ColorMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleMode: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AppThemeProviderProps {
  children: ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [mode, setMode] = useState<ColorMode>('light');

  // Sync with system preference on mount
  useEffect(() => {
    const stored = localStorage.getItem('color-mode') as ColorMode | null;
    if (stored) {
      setMode(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('color-mode', next);
      return next;
    });
  };

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
