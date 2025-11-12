'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'base', // sm, base, lg, xl
    focusOutlines: true,
  });

  useEffect(() => {
    // Check system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferences(prev => ({
      ...prev,
      reducedMotion: mediaQuery.matches,
    }));

    // Load saved preferences
    const saved = localStorage.getItem('accessibility');
    if (saved) {
      setPreferences(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  useEffect(() => {
    // Apply preferences to document
    const root = document.documentElement;

    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.setAttribute('data-font-size', preferences.fontSize);

    // Save preferences
    localStorage.setItem('accessibility', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);
