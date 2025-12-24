'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import useSWR from 'swr';
import {
  SectionLabel,
  DottedDivider,
  Kbd,
  ActionBar,
  MinimalGameCard,
  MinimalBettingModal,
} from '@/components/experimental';
import ErrorBoundary from '@components/ErrorBoundary';
import { GameCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { useUserContext } from '@/app/contexts/UserContext';

// SWR fetcher function
const fetcher = (url) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
});

export default function GamesPage() {
  const { user: userData, refreshUser, updateBiscuits } = useUserContext();
  const [sport, setSport] = useState('all');
  const [syncing, setSyncing] = useState(false);
  const [showPastGames, setShowPastGames] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  // Betting modal state - combined to prevent race condition
  const [bettingModal, setBettingModal] = useState({
    isOpen: false,
    game: null
  });

  // Build API endpoint based on filters
  const apiEndpoint = showPastGames
    ? `/api/games/completed?sport=${sport}&limit=50&sort=${sortBy}`
    : `/api/games/upcoming?sport=${sport}&limit=20&includeCompleted=false`;

  // Use SWR for data fetching with caching
  const { data, error, isLoading, mutate } = useSWR(apiEndpoint, fetcher, {
    refreshInterval: 60000, // Refresh every 60 seconds
    dedupingInterval: 15000, // Dedupe requests within 15 seconds
    revalidateOnFocus: false, // Don't refetch on window focus (can enable if desired)
  });

  const games = data?.games || [];
  const loading = isLoading;
  const hasAutoSwitchedRef = useRef(false);
  const hasAutoSyncedRef = useRef(false);

  // Auto-sync games on mount if not synced recently (5 min cache)
  useEffect(() => {
    const SYNC_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const lastSync = localStorage.getItem('lastGameSync');
    const now = Date.now();

    if (!hasAutoSyncedRef.current && (!lastSync || now - parseInt(lastSync) > SYNC_CACHE_DURATION)) {
      hasAutoSyncedRef.current = true;
      // Silent background sync - no loading state shown
      Promise.all([
        fetch('/api/games/sync-from-espn?sport=football', { method: 'POST' }).catch(() => {}),
        fetch('/api/games/sync-from-espn?sport=basketball', { method: 'POST' }).catch(() => {}),
      ]).then(() => {
        localStorage.setItem('lastGameSync', now.toString());
        mutate(); // Refresh the game list
      });
    }
  }, [mutate]);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedShowPastGames = localStorage.getItem('showPastGames');
    const savedSport = localStorage.getItem('sportFilter');
    const savedSortBy = localStorage.getItem('sortBy');

    if (savedShowPastGames !== null) setShowPastGames(savedShowPastGames === 'true');
    if (savedSport) setSport(savedSport);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('showPastGames', showPastGames.toString());
    localStorage.setItem('sportFilter', sport);
    localStorage.setItem('sortBy', sortBy);
  }, [showPastGames, sport, sortBy]);

  // Auto-switch to past games if no upcoming games found
  useEffect(() => {
    if (!hasAutoSwitchedRef.current && !showPastGames && !loading && !error && games.length === 0) {
      console.log('No upcoming games found, switching to past games view');
      setShowPastGames(true);
      hasAutoSwitchedRef.current = true;
    }
  }, [showPastGames, loading, error, games.length]);

  const handleSync = useCallback(async () => {
    try {
      setSyncing(true);

      // Sync both football and basketball simultaneously
      const [footballResponse, basketballResponse] = await Promise.all([
        fetch('/api/games/sync?sport=football', { method: 'POST' }),
        fetch('/api/games/sync?sport=basketball', { method: 'POST' })
      ]);

      // Check if both succeeded
      if (!footballResponse.ok || !basketballResponse.ok) {
        const fbError = !footballResponse.ok ? await footballResponse.json().catch(() => ({ error: 'Unknown error' })) : null;
        const bbError = !basketballResponse.ok ? await basketballResponse.json().catch(() => ({ error: 'Unknown error' })) : null;

        const errors = [];
        if (fbError) errors.push(`Football: ${fbError.error}`);
        if (bbError) errors.push(`Basketball: ${bbError.error}`);

        throw new Error(errors.join(', '));
      }

      // Both synced successfully - update cache timestamp and revalidate
      localStorage.setItem('lastGameSync', Date.now().toString());
      await mutate();
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  }, [mutate]);

  const handlePlaceBet = useCallback((game) => {
    if (!userData) {
      // Could redirect to login
      return;
    }
    // Atomic state update - eliminates race condition
    setBettingModal({
      isOpen: true,
      game: game
    });
  }, [userData]);

  const handleBetPlaced = useCallback((data) => {
    if (data.user) {
      updateBiscuits(data.user.biscuits);
      refreshUser();
    }
    // Revalidate games cache to show updated odds
    mutate();
  }, [updateBiscuits, refreshUser, mutate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case 'f':
          setSport('football');
          break;
        case 'b':
          setSport('basketball');
          break;
        case 'a':
          setSport('all');
          break;
        case 'p':
          setShowPastGames(prev => !prev);
          break;
        case 's':
          // Trigger sync
          if (!syncing) {
            handleSync();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [syncing, handleSync]);

  const sportFilters = [
    { id: 'all', label: 'All', key: 'A' },
    { id: 'football', label: 'Football', key: 'F' },
    { id: 'basketball', label: 'Basketball', key: 'B' },
  ];

  return (
    <div className="py-8 space-y-6 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SectionLabel>Games</SectionLabel>
          <p className="text-zinc-600 text-xs mt-1">
            {showPastGames ? 'Past results' : 'Upcoming matchups'}
          </p>
        </div>
        
        {/* Sync button */}
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-1.5 text-xs border border-dotted border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 disabled:opacity-50 transition-colors"
        >
          <Kbd size="xs">S</Kbd>
          {syncing ? 'Syncing...' : 'Sync All'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {sportFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSport(f.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs border border-dotted transition-colors ${
              sport === f.id
                ? 'border-zinc-600 text-zinc-300 bg-zinc-900/50'
                : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-500'
            }`}
          >
            <Kbd size="xs">{f.key}</Kbd>
            {f.label}
          </button>
        ))}
        
        <div className="w-px bg-zinc-800 mx-2" />
        
        <button
          onClick={() => setShowPastGames(!showPastGames)}
          className={`flex items-center gap-2 px-3 py-2 text-xs border border-dotted transition-colors ${
            showPastGames
              ? 'border-zinc-600 text-zinc-300 bg-zinc-900/50'
              : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-500'
          }`}
        >
          <Kbd size="xs">P</Kbd>
          Past
        </button>

        {showPastGames && (
          <button
            onClick={() => setSortBy(sortBy === 'recent' ? 'oldest' : 'recent')}
            className="flex items-center gap-2 px-3 py-2 text-xs border border-dotted border-zinc-800 text-zinc-600 hover:text-zinc-500 transition-colors"
          >
            <Kbd size="xs">S</Kbd>
            {sortBy === 'recent' ? 'Recent First' : 'Oldest First'}
          </button>
        )}
      </div>

      <DottedDivider />

      {/* Error state */}
      {error && (
        <div className="py-4 text-center border border-dotted border-zinc-800">
          <p className="text-zinc-500 text-sm">{error.message || 'Failed to load games'}</p>
          <button
            onClick={() => mutate()}
            className="text-zinc-600 text-xs hover:text-zinc-400 underline mt-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && !loading && games.length === 0 && (
        <div className="py-12 text-center border border-dotted border-zinc-800">
          <p className="text-zinc-600 text-sm">No games found</p>
          <p className="text-zinc-700 text-xs mt-2">Try syncing games from ESPN</p>
        </div>
      )}

      {/* Games Grid */}
      {loading && games.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : !loading && games.length > 0 ? (
        <div className="max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {games.map((game) => (
              <ErrorBoundary key={game._id}>
                <MinimalGameCard
                  game={game}
                  onPlaceBet={() => handlePlaceBet(game)}
                />
              </ErrorBoundary>
            ))}
          </div>
        </div>
      ) : null}

      <DottedDivider />

      <ActionBar
        actions={[
          { key: 'D', label: 'Dashboard' },
          { key: 'H', label: 'History' },
          { key: 'L', label: 'Leaderboard' },
        ]}
      />

      {/* Betting Modal */}
      {bettingModal.game && (
        <ErrorBoundary>
          <MinimalBettingModal
            game={bettingModal.game}
            isOpen={bettingModal.isOpen}
            onClose={() => {
              setBettingModal({ isOpen: false, game: null });
            }}
            onBetPlaced={handleBetPlaced}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
