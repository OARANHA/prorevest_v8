import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';

export function SeasonalThemeToggle() {
  const { seasonalTheme, setSeasonalTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'default', name: '', colors: 'bg-gray-200', icon: '🎨' },
    { id: 'spring', name: '', colors: 'bg-green-200', icon: '🌸' },
    { id: 'summer', name: '', colors: 'bg-blue-200', icon: '☀️' },
    { id: 'autumn', name: '', colors: 'bg-orange-200', icon: '🍂' },
    { id: 'winter', name: '', colors: 'bg-gray-100', icon: '❄️' },
  ];

  const currentTheme = themes.find(t => t.id === seasonalTheme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Alternar tema sazonal"
      >
        <span className="text-lg">{currentTheme.icon}</span>
        <span className="hidden md:inline">{currentTheme.name}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-10">
          <div className="py-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setSeasonalTheme(theme.id as any);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-2 w-full px-4 py-2 text-left text-sm ${
                  seasonalTheme === theme.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className="text-lg">{theme.icon}</span>
                <span>{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}