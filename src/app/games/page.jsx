'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge, LoadingSpinner } from '../Components/ui';
import BiscuitIcon from '../Components/BiscuitIcon';
import ErrorState from '../Components/ErrorState';
import BettingModal from '../Components/BettingModal';
import CardStyleC from '../Components/CardStyleC';
import ErrorBoundary from '../Components/ErrorBoundary';
import UWRecord from '../Components/UWRecord';
import { Calendar, MapPin, Trophy, Clock, TrendingUp } from 'lucide-react';
import { useUserContext } from '../contexts/UserContext';

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export default function GamesPage() {
  // Use centralized UserContext instead of duplicate fetching
  const { user: userData, loading: userLoading, refreshUser, updateBiscuits } = useUserContext();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sport, setSport] = useState('all');
  const [syncing, setSyncing] = useState(false);

  // New filter states for Phase 1
  const [showPastGames, setShowPastGames] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'oldest'

  // Separate state for completed games (for UW Record display)
  const [completedGamesForRecord, setCompletedGamesForRecord] = useState([]);

  // Betting modal state
  const [selectedGame, setSelectedGame] = useState(null);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);

  // Fetch completed games for UW Record (always in background)
  const fetchCompletedGamesForRecord = useCallback(async () => {
    try {
      const response = await fetch(`/api/games/completed?sport=${sport}&limit=100&sort=recent`);
      if (response.ok) {
        const data = await response.json();
        setCompletedGamesForRecord(data.games);
      }
    } catch (err) {
      console.error('Error fetching completed games for record:', err);
    }
  }, [sport]);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);

      // Determine which API to call based on showPastGames
      const apiEndpoint = showPastGames
        ? `/api/games/completed?sport=${sport}&limit=50&sort=${sortBy}`
        : `/api/games/upcoming?sport=${sport}&limit=20&includeCompleted=false`;

      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

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

  // Load filter preferences from localStorage on mount
  useEffect(() => {
    const savedShowPastGames = localStorage.getItem('showPastGames');
    const savedSport = localStorage.getItem('sportFilter');
    const savedSortBy = localStorage.getItem('sortBy');

    if (savedShowPastGames !== null) {
      setShowPastGames(savedShowPastGames === 'true');
    }
    if (savedSport) {
      setSport(savedSport);
    }
    if (savedSortBy) {
      setSortBy(savedSortBy);
    }
  }, []);

  // Save filter preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('showPastGames', showPastGames.toString());
    localStorage.setItem('sportFilter', sport);
    localStorage.setItem('sortBy', sortBy);
  }, [showPastGames, sport, sortBy]);

  // Fetch games from database
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Fetch completed games for record (always, regardless of showPastGames)
  useEffect(() => {
    fetchCompletedGamesForRecord();
  }, [fetchCompletedGamesForRecord]);

  const handleSync = useCallback(async (sportType) => {
    try {
      console.log(`🔄 Starting sync for ${sportType}...`);
      setSyncing(true);
      setError(null);

      const response = await fetch(`/api/games/sync?sport=${sportType}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to sync games (${response.status})`);
      }

      const data = await response.json();
      console.log('✅ Sync results:', data);

      // Refresh games list and completed games for record
      await fetchGames();
      await fetchCompletedGamesForRecord();

      alert(`✅ Sync completed!\nCreated: ${data.results.created}\nUpdated: ${data.results.updated}\nSkipped: ${data.results.skipped}${data.results.errors.length > 0 ? `\nErrors: ${data.results.errors.length}` : ''}`);
    } catch (err) {
      console.error('❌ Sync error:', err);
      setError(`Sync failed: ${err.message}`);
      alert(`❌ Sync failed: ${err.message}`);
    } finally {
      // ALWAYS reset syncing state, even if there's an error
      setSyncing(false);
      console.log('🏁 Sync complete, button re-enabled');
    }
  }, [fetchGames, fetchCompletedGamesForRecord]);

  const getStatusBadge = useCallback((status) => {
    const variants = {
      scheduled: 'info',
      live: 'success',
      completed: 'secondary',
      cancelled: 'danger',
      postponed: 'warning',
    };
    return variants[status] || 'secondary';
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  const getDaysUntil = useCallback((gameDate) => {
    const days = Math.ceil((new Date(gameDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Past';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  }, []);

  const handlePlaceBet = useCallback((game) => {
    if (!userData) {
      alert('Please sign in to place bets');
      return;
    }
    setSelectedGame(game);
    setIsBettingModalOpen(true);
  }, [userData]);

  const handleBetPlaced = useCallback((data) => {
    // Update user data using context methods
    if (data.user) {
      // Optimistically update biscuits immediately
      updateBiscuits(data.user.biscuits);

      // Then refresh full user data from server
      refreshUser();
    }

    // Refresh games to show updated odds
    fetchGames();
    fetchCompletedGamesForRecord();

    // Show success message
    alert('✅ Bet placed successfully!');
  }, [updateBiscuits, refreshUser, fetchGames, fetchCompletedGamesForRecord]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-uw-purple-900">UW Games</h1>
          <p className="text-gray-600 mt-1">Place your bets on upcoming Husky games</p>
          {userData && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">Your Balance:</span>
              <Badge variant="gold" size="lg">
                <BiscuitIcon size={16} className="inline mr-1" />
                {userData.biscuits.toLocaleString()}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => handleSync('football')}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : 'Sync Football'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSync('basketball')}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : 'Sync Basketball'}
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        {/* Checkbox Filters */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Show Past Games Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPastGames}
              onChange={(e) => setShowPastGames(e.target.checked)}
              className="w-4 h-4 text-uw-purple-600 border-gray-300 rounded focus:ring-uw-purple-500"
            />
            <span className="text-sm font-semibold text-gray-700">Show Past Games</span>
          </label>

          {/* Sport Filters */}
          <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-200">
            <span className="text-sm font-semibold text-gray-600">Sport:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sport"
                checked={sport === 'all'}
                onChange={() => setSport('all')}
                className="w-4 h-4 text-uw-purple-600 border-gray-300 focus:ring-uw-purple-500"
              />
              <span className="text-sm text-gray-700">All Sports</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sport"
                checked={sport === 'football'}
                onChange={() => setSport('football')}
                className="w-4 h-4 text-uw-purple-600 border-gray-300 focus:ring-uw-purple-500"
              />
              <span className="text-sm text-gray-700">Football</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sport"
                checked={sport === 'basketball'}
                onChange={() => setSport('basketball')}
                className="w-4 h-4 text-uw-purple-600 border-gray-300 focus:ring-uw-purple-500"
              />
              <span className="text-sm text-gray-700">Basketball</span>
            </label>
          </div>

          {/* Sort Dropdown - Only show when viewing past games */}
          {showPastGames && (
            <div className="flex items-center gap-2 pl-4 border-l-2 border-gray-200">
              <span className="text-sm font-semibold text-gray-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-uw-purple-500 focus:border-uw-purple-500"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* UW Record - Always show current season record */}
      {!loading && completedGamesForRecord.length > 0 && (
        <UWRecord games={completedGamesForRecord} sport={sport} />
      )}

      {/* Error State */}
      {error && (
        <ErrorState
          error={error}
          onRetry={fetchGames}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" variant="uw" />
        </div>
      )}

      {/* Empty State */}
      {!loading && games.length === 0 && (
        <Card variant="outline" className="text-center py-12">
          <Card.Body>
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No games found</h3>
            <p className="text-gray-600 mb-4">
              Sync games from ESPN to see upcoming UW matches
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => handleSync('football')}>Sync Football</Button>
              <Button onClick={() => handleSync('basketball')}>Sync Basketball</Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Games Grid */}
      {!loading && games.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game, index) => (
            <motion.div key={`motion-${game._id}`} variants={itemVariants} className="h-full flex">
              <ErrorBoundary key={`error-${game._id}`}>
                <CardStyleC
                  key={game._id}
                  game={game}
                  onClick={() => game.canBet && handlePlaceBet(game)}
                  className="h-full w-full"
                />
              </ErrorBoundary>
            </motion.div>
          ))}
        </motion.div>
      )}

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
