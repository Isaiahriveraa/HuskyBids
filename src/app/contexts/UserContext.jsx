'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

const UserContext = createContext();

/**
 * UserContext - Provides user data to the app
 *
 * Responsibilities:
 * - Sync user profile from MongoDB on login
 * - Handle daily bonus notifications
 * - Provide user data (biscuits, stats) to components
 *
 * NOT responsible for:
 * - ESPN game sync (handled by Games page)
 * - Bet settlement (handled by Dashboard/Betting History)
 */
export function UserProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyBonusMessage, setDailyBonusMessage] = useState(null);
  const [settlementMessage, setSettlementMessage] = useState(null);

  // Fetch user profile from MongoDB
  const fetchUserData = useCallback(async () => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to sync user: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.user);

        // Show daily bonus notification if awarded
        if (data.dailyBonusAwarded) {
          const message = `Daily login bonus: +${data.bonusAmount} pts`;
          setDailyBonusMessage(message);
          setTimeout(() => setDailyBonusMessage(null), 5000);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch user data');
      }
    } catch (err) {
      console.error('[UserContext] Error fetching user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Refresh user data (call after placing bets, etc.)
  const refreshUser = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  // Update biscuits optimistically (before API confirms)
  const updateBiscuits = useCallback((newAmount) => {
    if (user) {
      setUser(prev => ({ ...prev, biscuits: newAmount }));
    }
  }, [user]);

  // Show settlement notification (called by pages that settle bets)
  const showSettlementNotification = useCallback((message) => {
    setSettlementMessage(message);
    setTimeout(() => setSettlementMessage(null), 8000);
  }, []);

  // Fetch user data when Clerk loads
  useEffect(() => {
    if (clerkLoaded) {
      if (userId && isSignedIn) {
        fetchUserData();
      } else {
        setUser(null);
        setLoading(false);
      }
    }
  }, [clerkLoaded, userId, isSignedIn, fetchUserData]);

  const value = {
    user,
    loading,
    error,
    dailyBonusMessage,
    settlementMessage,
    refreshUser,
    updateBiscuits,
    showSettlementNotification,
    isAuthenticated: !!userId && !!isSignedIn,
    clerkUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
