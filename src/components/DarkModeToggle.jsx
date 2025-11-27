'use client';

import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function DarkModeToggle() {
  const { isDark, toggleDarkMode, isLoaded } = useDarkMode();

  // Render a stable placeholder during SSR/hydration to prevent mismatch
  // The button structure stays the same, only icon changes after hydration
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
      suppressHydrationWarning
    >
      {/* Show Moon by default (SSR), then switch based on actual state */}
      {!isLoaded ? (
        <Moon className="w-5 h-5" />
      ) : isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
