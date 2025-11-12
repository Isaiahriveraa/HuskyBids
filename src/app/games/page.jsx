'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Badge, LoadingSpinner } from '../Components/ui';
import BiscuitIcon from '../Components/BiscuitIcon';
import ErrorState from '../Components/ErrorState';
import BettingModal from '../Components/BettingModal';
import EnhancedGameCard from '../Components/EnhancedGameCard';
import ErrorBoundary from '../Components/ErrorBoundary';
import { Calendar, MapPin, Trophy, Clock, TrendingUp } from 'lucide-react';
import { useUserContext } from '../contexts/UserContext';

export default function GamesPage() {
  // Use centralized UserContext instead of duplicate fetching
  const { user: userData, loading: userLoading, refreshUser, updateBiscuits } = useUserContext();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sport, setSport] = useState('all');
  const [syncing, setSyncing] = useState(false);

  // Betting modal state
  const [selectedGame, setSelectedGame] = useState(null);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/games/upcoming?sport=${sport}&limit=20&includeCompleted=true`);

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
  }, [sport]);

  // Fetch games from database
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

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

      // Refresh games list
      await fetchGames();

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
  }, [fetchGames]);

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

    // Show success message
    alert('✅ Bet placed successfully!');
  }, [updateBiscuits, refreshUser, fetchGames]);

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

      {/* Sport Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={sport === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setSport('all')}
        >
          All Sports
        </Button>
        <Button
          variant={sport === 'football' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setSport('football')}
        >
          Football
        </Button>
        <Button
          variant={sport === 'basketball' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setSport('basketball')}
        >
          Basketball
        </Button>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <ErrorBoundary key={`error-${game._id}`}>
              <EnhancedGameCard
                key={game._id}
                game={game}
                onPlaceBet={handlePlaceBet}
              />
            </ErrorBoundary>
          ))}
        </div>
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
