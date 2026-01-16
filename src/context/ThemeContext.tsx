'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedSettings = localStorage.getItem('lifeos-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.appearance?.theme) {
        if (parsed.appearance.theme === 'system') {
           const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
           setThemeState(isSystemDark ? 'dark' : 'light');
        } else {
           setThemeState(parsed.appearance.theme as Theme);
        }
      }
    } else {
        // Default to dark if no settings
        setThemeState('dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to settings to persist simple toggles
    // Note: The main SettingsPage might overwrite this with full JSON object, 
    // but this ensures simple toggling works.
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
      setThemeState(newTheme);
  };

  if (!mounted) {
      return null; // or a specific loading skeleton
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
