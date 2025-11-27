'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Initialize state to match what the inline script set (check the DOM)
  // This prevents hydration mismatch by syncing with the pre-rendered state
  const [isDark, setIsDark] = useState(() => {
    // During SSR, return false (server doesn't have localStorage)
    if (typeof window === 'undefined') return false;
    // On client, check if dark class was already added by inline script
    return document.documentElement.classList.contains('dark');
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state with DOM on mount (handles edge cases)
  useEffect(() => {
    const hasDarkClass = document.documentElement.classList.contains('dark');
    if (hasDarkClass !== isDark) {
      setIsDark(hasDarkClass);
    }
    setIsLoaded(true);
  }, []);

  // Handle dark mode changes after initial load
  useEffect(() => {
    if (!isLoaded) return;

    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDark, isLoaded]);

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode, isLoaded }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};
