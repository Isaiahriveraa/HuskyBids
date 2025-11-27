'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  SectionLabel,
  DottedDivider,
  Kbd,
  ActionBar,
  MinimalGameCard,
} from '@/components/experimental';
import ErrorBoundary from '@components/ErrorBoundary';
import BettingModal from '@components/BettingModal';
import { useUserContext } from '../contexts/UserContext';

export default function GamesPage() {
  const { user: userData, refreshUser, updateBiscuits } = useUserContext();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sport, setSport] = useState('all');
  const [syncing, setSyncing] = useState(false);
  const [showPastGames, setShowPastGames] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  // Betting modal state
  const [selectedGame, setSelectedGame] = useState(null);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const apiEndpoint = showPastGames
        ? `/api/games/completed?sport=${sport}&limit=50&sort=${sortBy}`
        : `/api/games/upcoming?sport=${sport}&limit=20&includeCompleted=false`;

      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error('Failed to fetch games');

      const data = await response.json();
      setGames(data.games);
      setError(null);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sport, showPastGames, sortBy]);

  useEffect(() => {
    const savedShowPastGames = localStorage.getItem('showPastGames');
    const savedSport = localStorage.getItem('sportFilter');
    const savedSortBy = localStorage.getItem('sortBy');

    if (savedShowPastGames !== null) setShowPastGames(savedShowPastGames === 'true');
    if (savedSport) setSport(savedSport);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  useEffect(() => {
    localStorage.setItem('showPastGames', showPastGames.toString());
    localStorage.setItem('sportFilter', sport);
    localStorage.setItem('sortBy', sortBy);
  }, [showPastGames, sport, sortBy]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleSync = useCallback(async (sportType) => {
    try {
      setSyncing(true);
      setError(null);

      const response = await fetch(`/api/games/sync?sport=${sportType}`, { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to sync games`);
      }

      const data = await response.json();
      await fetchGames();
      // Silent success - no alert
    } catch (err) {
      setError(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  }, [fetchGames]);

  const handlePlaceBet = useCallback((game) => {
    if (!userData) {
      // Could redirect to login
      return;
    }
    setSelectedGame(game);
    setIsBettingModalOpen(true);
  }, [userData]);

  const handleBetPlaced = useCallback((data) => {
    if (data.user) {
      updateBiscuits(data.user.biscuits);
      refreshUser();
    }
    fetchGames();
  }, [updateBiscuits, refreshUser, fetchGames]);

  // Loading state
  if (loading) {
    return (
      <div className="py-8 space-y-4 font-mono animate-pulse">
        <div className="h-4 bg-zinc-900 rounded w-16" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 bg-zinc-900 border border-dotted border-zinc-800" />
          ))}
        </div>
        <div className="border-t border-dotted border-zinc-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-900/50 border border-dotted border-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

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
        
        {/* Sync buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSync('football')}
            disabled={syncing}
            className="px-3 py-1.5 text-xs border border-dotted border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 disabled:opacity-50 transition-colors"
          >
            {syncing ? '...' : 'Sync FB'}
          </button>
          <button
            onClick={() => handleSync('basketball')}
            disabled={syncing}
            className="px-3 py-1.5 text-xs border border-dotted border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 disabled:opacity-50 transition-colors"
          >
            {syncing ? '...' : 'Sync BB'}
          </button>
        </div>
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
          <p className="text-zinc-500 text-sm">{error}</p>
          <button 
            onClick={fetchGames}
            className="text-zinc-600 text-xs hover:text-zinc-400 underline mt-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && games.length === 0 && (
        <div className="py-12 text-center border border-dotted border-zinc-800">
          <p className="text-zinc-600 text-sm">No games found</p>
          <p className="text-zinc-700 text-xs mt-2">Try syncing games from ESPN</p>
        </div>
      )}

      {/* Games Grid */}
      {games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {games.map((game) => (
            <ErrorBoundary key={game._id}>
              <MinimalGameCard
                game={game}
                onPlaceBet={() => game.canBet && handlePlaceBet(game)}
              />
            </ErrorBoundary>
          ))}
        </div>
      )}

      <DottedDivider />

      <ActionBar
        actions={[
          { key: 'D', label: 'Dashboard' },
          { key: 'H', label: 'History' },
          { key: 'L', label: 'Leaderboard' },
        ]}
      />

      {/* Betting Modal */}
      {selectedGame && (
        <ErrorBoundary>
          <BettingModal
            game={selectedGame}
            isOpen={isBettingModalOpen}
            onClose={() => {
              setIsBettingModalOpen(false);
              setSelectedGame(null);
            }}
            onBetPlaced={handleBetPlaced}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
