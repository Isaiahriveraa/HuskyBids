'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyBonusMessage, setDailyBonusMessage] = useState(null);

  // Fetch user data from MongoDB (also handles daily bonus)
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

      console.log('[UserContext] Syncing user (checking for daily bonus)...');
      // Use sync-user which handles user creation AND daily bonus
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
        dailyBonusAwarded: data.dailyBonusAwarded
      });

      if (data.success) {
        setUser(data.user);
        console.log('[UserContext] User set successfully');

        // Show daily bonus notification if awarded
        if (data.dailyBonusAwarded) {
          const message = `🎁 Daily Login Bonus! +${data.bonusAmount} biscuits`;
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
      console.error('[UserContext] Error fetching user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
