'use client';

import useSWR from 'swr';

// Fetcher function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

// Hook for user stats with caching
export function useUserStats() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/stats',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  return {
    stats: data?.success ? data.stats : null,
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
  };
}

// Hook for leaderboard with caching
export function useLeaderboard(limit = 100, period = 'all-time', page = 1) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/user/leaderboard?limit=${limit}&period=${period}&page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 15000, // 15 seconds
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    leaderboard: data?.success ? data.leaderboard : [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 1,
    currentPage: data?.page || 1,
    hasNextPage: data?.hasNextPage || false,
    hasPrevPage: data?.hasPrevPage || false,
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
  };
}

// Hook for user bets with caching
export function useUserBets() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/bets/user',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  return {
    bets: data?.success ? data.bets : [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
  };
}

// Hook for games with caching
export function useGames(sport = 'football') {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/games/fetch-espn?sport=${sport}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 15000, // 15 seconds
      refreshInterval: 60000, // Refresh every minute for live games
    }
  );

  return {
    games: data?.success ? data.games : [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
  };
}

// Generic hook for any API endpoint
export function useAPI(endpoint, options = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    endpoint,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      ...options,
    }
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
