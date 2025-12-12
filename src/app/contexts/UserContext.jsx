'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useLoadingActions } from './LoadingContext';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { userId } = useAuth();
  const { setLoading: setGlobalLoading, clearLoading: clearGlobalLoading } = useLoadingActions();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyBonusMessage, setDailyBonusMessage] = useState(null);
  const [settlementMessage, setSettlementMessage] = useState(null);

  // Fetch user data from MongoDB (also handles daily bonus and bet settlement)
  const fetchUserData = async () => {
    console.log('[UserContext] fetchUserData called', { userId, clerkLoaded, isSignedIn });

    if (!userId) {
      console.log('[UserContext] No userId, setting user to null');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // STEP 1: Sync games from ESPN to get latest scores and statuses
      setGlobalLoading('Syncing games from ESPN...');
      console.log('[UserContext] 🔄 Syncing games from ESPN...');
      try {
        // Sync both football and basketball games in parallel
        await Promise.all([
          fetch('/api/games/sync-from-espn?sport=football', { method: 'POST' })
            .then(res => res.ok ? console.log('[UserContext] ✅ Football games synced') : console.warn('[UserContext] ⚠️  Football sync failed'))
            .catch(err => console.warn('[UserContext] ⚠️  Football sync error:', err.message)),
          fetch('/api/games/sync-from-espn?sport=basketball', { method: 'POST' })
            .then(res => res.ok ? console.log('[UserContext] ✅ Basketball games synced') : console.warn('[UserContext] ⚠️  Basketball sync failed'))
            .catch(err => console.warn('[UserContext] ⚠️  Basketball sync error:', err.message)),
        ]);
      } catch (syncError) {
        // Don't fail login if game sync fails - just log it
        console.warn('[UserContext] ⚠️  Game sync error (non-critical):', syncError.message);
      }

      // STEP 2: Auto-settle user's pending bets based on completed games
      setGlobalLoading('Settling pending bets...');
      console.log('[UserContext] 💰 Auto-settling pending bets...');
      try {
        const settleResponse = await fetch('/api/bets/auto-settle-user', {
          method: 'POST',
        });

        if (settleResponse.ok) {
          const settleData = await settleResponse.json();
          console.log('[UserContext] Settlement result:', {
            settled: settleData.settled,
            won: settleData.won,
            lost: settleData.lost,
            netChange: settleData.netChange,
          });

          // Show settlement notification if bets were settled
          if (settleData.settled > 0) {
            const netChange = settleData.netChange || 0;
            const sign = netChange > 0 ? '+' : '';
            const message = `${settleData.settled} bet${settleData.settled > 1 ? 's' : ''} settled: ${sign}${netChange} pts`;
            setSettlementMessage(message);
            console.log('[UserContext]', message);

            // Clear message after 8 seconds
            setTimeout(() => {
              setSettlementMessage(null);
            }, 8000);
          }
        } else {
          console.warn('[UserContext] ⚠️  Bet settlement failed (non-critical)');
        }
      } catch (settleError) {
        // Don't fail login if settlement fails - just log it
        console.warn('[UserContext] ⚠️  Bet settlement error (non-critical):', settleError.message);
      }

      // STEP 3: Sync user data (handles user creation and daily bonus)
      setGlobalLoading('Loading your profile...');
      console.log('[UserContext] 👤 Syncing user data...');
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
      });

      console.log('[UserContext] API Response:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to sync user: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[UserContext] User data received:', {
        success: data.success,
        username: data.user?.username,
        biscuits: data.user?.biscuits,
        dailyBonusAwarded: data.dailyBonusAwarded,
      });

      if (data.success) {
        setUser(data.user);
        console.log('[UserContext] ✅ User set successfully');

        // Show daily bonus notification if awarded
        if (data.dailyBonusAwarded) {
          const message = `Daily login bonus: +${data.bonusAmount} pts`;
          setDailyBonusMessage(message);
          console.log('[UserContext]', message);

          // Clear message after 5 seconds
          setTimeout(() => {
            setDailyBonusMessage(null);
          }, 5000);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch user data');
      }
    } catch (err) {
      console.error('[UserContext] ❌ Error fetching user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      clearGlobalLoading();
    }
  };


  // Refresh user data (useful after placing bets, etc.)
  const refreshUser = async () => {
    console.log('[UserContext] refreshUser called');
    await fetchUserData();
  };

  // Update local biscuits optimistically (before API confirms)
  const updateBiscuits = (newAmount) => {
    console.log('[UserContext] updateBiscuits called:', newAmount);
    if (user) {
      setUser({ ...user, biscuits: newAmount });
    }
  };

  // Fetch user data when Clerk user is loaded
  useEffect(() => {
    console.log('[UserContext] useEffect triggered', {
      clerkLoaded,
      userId,
      isSignedIn,
      clerkUserExists: !!clerkUser
    });

    if (clerkLoaded) {
      if (userId && isSignedIn) {
        console.log('[UserContext] User is authenticated, fetching data...');
        fetchUserData();
      } else {
        // User is not authenticated
        console.log('[UserContext] User not authenticated');
        setUser(null);
        setLoading(false);
      }
    }
  }, [clerkLoaded, userId, isSignedIn]);

  const value = {
    user,
    loading,
    error,
    dailyBonusMessage,
    settlementMessage,
    refreshUser,
    updateBiscuits,
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
