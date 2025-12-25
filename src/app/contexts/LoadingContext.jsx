'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

const LoadingContext = createContext();

/**
 * LoadingProvider - Centralized loading state management
 *
 * Manages global loading state and messages that are displayed
 * by the global loading.jsx Suspense boundary.
 *
 * Features:
 * - 150ms minimum display time to prevent flashing
 * - Automatic cleanup on route changes
 * - Simple "last message wins" approach for concurrent loading
 */
export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const loadingStartTimeRef = useRef(null);
  const clearTimeoutRef = useRef(null);
  const pathname = usePathname();

  /**
   * Set loading state with a message
   * @param {string} newMessage - Loading message to display
   */
  const setLoading = useCallback((newMessage) => {
    // Clear any pending clearLoading timeout
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }

    setIsLoading(true);
    setMessage(newMessage || 'Loading...');
    loadingStartTimeRef.current = Date.now();
  }, []);

  /**
   * Clear loading state with 150ms minimum display time
   * Prevents jarring flashes on fast API responses
   */
  const clearLoading = useCallback(() => {
    const elapsedTime = Date.now() - (loadingStartTimeRef.current || 0);
    const remainingTime = Math.max(0, 150 - elapsedTime);

    if (remainingTime > 0) {
      // Delay clearing to meet minimum display time
      clearTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setMessage('');
        loadingStartTimeRef.current = null;
        clearTimeoutRef.current = null;
      }, remainingTime);
    } else {
      // Clear immediately
      setIsLoading(false);
      setMessage('');
      loadingStartTimeRef.current = null;
    }
  }, []);

  // Clear loading state directly on route changes
  useEffect(() => {
    // When pathname changes, clear any loading state immediately
    if (isLoading) {
      setIsLoading(false);
      setMessage('');
      loadingStartTimeRef.current = null;
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
        clearTimeoutRef.current = null;
      }
    }
  }, [pathname, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    isLoading,
    message,
    setLoading,
    clearLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Hook to access loading state (for consumers like loading.jsx)
 * @returns {{ isLoading: boolean, message: string }}
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return {
    isLoading: context.isLoading,
    message: context.message,
  };
}

/**
 * Hook to control loading state (for components that trigger loading)
 * @returns {{ setLoading: (message: string) => void, clearLoading: () => void }}
 */
export function useLoadingActions() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoadingActions must be used within a LoadingProvider');
  }
  return {
    setLoading: context.setLoading,
    clearLoading: context.clearLoading,
  };
}
