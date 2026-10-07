import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type SeasonalTheme = 'default' | 'spring' | 'summer' | 'autumn' | 'winter';

type ThemeContextType = {
  theme: Theme;
  seasonalTheme: SeasonalTheme;
  setTheme: (theme: Theme) => void;
  setSeasonalTheme: (theme: SeasonalTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [seasonalTheme, setSeasonalTheme] = useState<SeasonalTheme>('default');

  useEffect(() => {
    // Force light theme for now
    const forcedTheme = 'light';
    const savedSeasonalTheme = localStorage.getItem('seasonalTheme') as SeasonalTheme | null;
    
    setTheme(forcedTheme);
    if (savedSeasonalTheme) setSeasonalTheme(savedSeasonalTheme);
    
    // Apply theme classes to document
    applyTheme(forcedTheme, savedSeasonalTheme || seasonalTheme);
  }, []);

  const applyTheme = (newTheme: Theme, newSeasonalTheme: SeasonalTheme) => {
    // Remove existing theme classes
    document.documentElement.classList.remove(
      'light',
      'dark',
      'spring',
      'summer',
      'autumn',
      'winter'
    );
    
    // Apply seasonal theme
    if (newSeasonalTheme !== 'default') {
      document.documentElement.classList.add(newSeasonalTheme);
    }
    
    // Apply color theme
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(newTheme);
    }
  };

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, seasonalTheme);
  };

  const updateSeasonalTheme = (newSeasonalTheme: SeasonalTheme) => {
    setSeasonalTheme(newSeasonalTheme);
    localStorage.setItem('seasonalTheme', newSeasonalTheme);
    applyTheme(theme, newSeasonalTheme);
  };

  const value = {
    theme,
    seasonalTheme,
    setTheme: updateTheme,
    setSeasonalTheme: updateSeasonalTheme
  };

  return (
    <ThemeContext.Provider value={value}>
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