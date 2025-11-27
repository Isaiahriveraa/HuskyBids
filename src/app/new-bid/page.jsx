"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useUserContext } from '../contexts/UserContext';
import BiscuitIcon from '@components/BiscuitIcon';
import ErrorBoundary from '@components/ErrorBoundary';
import { AlertCircle } from 'lucide-react';
import { SkeletonCard } from '@components/ui/LoadingSkeleton';

// Lazy load EnhancedGameCard
const EnhancedGameCard = dynamic(() => import('@components/EnhancedGameCard'), {
  loading: () => <SkeletonCard />,
});

const NewBidPage = () => {
  const { user, loading: userLoading, refreshUser, updateBiscuits } = useUserContext();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [prediction, setPrediction] = useState("home"); // 'home' or 'away'
  const [syncing, setSyncing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const MAX_RETRIES = 3;
  const BASE_DELAY = 1000; // 1 second

  // Sync games from ESPN
  const handleSync = useCallback(async (sport) => {
    try {
      console.log(`Starting sync for ${sport}...`);
      setSyncing(true);
      setError(null);

      const response = await fetch(`/api/games/sync?sport=${sport}&force=true`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to sync games (${response.status})`);
      }

      const data = await response.json();
      console.log('Sync results:', data);

      alert(`Sync completed!\nCreated: ${data.results.created}\nUpdated: ${data.results.updated}\nSkipped: ${data.results.skipped}${data.results.errors.length > 0 ? `\nErrors: ${data.results.errors.length}` : ''}`);

      // Refresh games list after sync
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Sync error:', err);
      setError(`Sync failed: ${err.message}`);
      alert(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
      console.log('🏁 Sync complete, button re-enabled');
    }
  }, []);

  // Fetch upcoming games with retry logic and rate limiting
  useEffect(() => {
    let timeoutId;
    let mounted = true;

    async function fetchGames() {
      // Prevent concurrent fetches
      if (isFetching) {
        console.log('[FETCH] Already fetching, skipping...');
        return;
      }

      try {
        setIsFetching(true);
        setLoading(true);
        setError(null);

        console.log(`[FETCH] Attempt ${retryCount + 1}/${MAX_RETRIES + 1}`);

        const response = await fetch('/api/games/upcoming?sport=football');

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const data = await response.json();

        if (!mounted) return;

        if (data.success && data.games) {
          // Filter only games that are open for betting
          const bettableGames = data.games.filter(game =>
            game.status === 'scheduled' && new Date(game.gameDate) > new Date()
          );
          setGames(bettableGames);
          setRetryCount(0); // Reset retry count on success
        } else {
          throw new Error(data.error || 'Failed to load games');
        }
      } catch (err) {
        console.error('[FETCH ERROR]', err);

        if (!mounted) return;

        // Implement exponential backoff retry
        if (retryCount < MAX_RETRIES) {
          const delay = BASE_DELAY * Math.pow(2, retryCount); // Exponential backoff
          console.log(`[FETCH] Retrying in ${delay}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);

          timeoutId = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            setRefreshTrigger(prev => prev + 1);
          }, delay);
        } else {
          console.log('[FETCH] Max retries reached');
          setError(`${err.message}. Please try again later.`);
          setRetryCount(0); // Reset for next manual retry
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsFetching(false);
        }
      }
    }

    // Debounce rapid triggers (wait 300ms before fetching)
    timeoutId = setTimeout(() => {
      fetchGames();
    }, 300);

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [refreshTrigger, retryCount]);

  const calculatePotentialWinnings = useCallback(() => {
    if (!selectedGame || !bidAmount) return 0;
    // Use the current odds from the game
    const odds = prediction === 'home' ? selectedGame.homeOdds : selectedGame.awayOdds;
    return Math.round(Number(bidAmount) * odds);
  }, [selectedGame, bidAmount, prediction]);

  const handlePlaceBid = useCallback(async () => {
    if (!selectedGame || !bidAmount) {
      alert("Please select a game and enter bid amount");
      return;
    }

    if (!user) {
      alert("Please log in to place a bet");
      return;
    }

    const betAmountNum = Number(bidAmount);

    // Validate bet amount
    if (betAmountNum < 10) {
      alert("Minimum bet is 10 biscuits");
      return;
    }

    if (betAmountNum > user.biscuits) {
      alert(`Insufficient biscuits. You have ${user.biscuits} biscuits.`);
      return;
    }

    if (betAmountNum > 10000) {
      alert("Maximum bet is 10,000 biscuits");
      return;
    }

    // Store original biscuit count for potential rollback
    const originalBiscuits = user.biscuits;

    try {
      const response = await fetch('/api/bets/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: selectedGame._id,
          betAmount: betAmountNum,
          predictedWinner: prediction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bet');
      }

      if (data.success) {
        // PHASE 1: Optimistic UI update using API response
        console.log('[BET] Optimistically updating biscuits from', originalBiscuits, 'to', data.user.biscuits);
        updateBiscuits(data.user.biscuits);

        // Show success message
        const winnings = calculatePotentialWinnings();
        alert(`Bet placed successfully!
Game: ${selectedGame.homeTeam} vs ${selectedGame.awayTeam}
Bet Amount: ${bidAmount} Biscuits
Your Prediction: ${prediction === 'home' ? selectedGame.homeTeam : selectedGame.awayTeam} wins
Potential Winnings: ${winnings} Biscuits`);

        // Reset form
        setSelectedGame(null);
        setBidAmount("");
        setPrediction("home");

        // Refresh games to show updated odds
        setRefreshTrigger(prev => prev + 1);

        // PHASE 1: Refresh user data from server to ensure sync
        console.log('[BET] Refreshing user data from server...');
        await refreshUser();
        console.log('[BET] User data refreshed successfully');
      }
    } catch (error) {
      console.error('Error placing bet:', error);

      // PHASE 3: Error handling - Rollback optimistic update
      console.log('[BET ERROR] Rolling back biscuits to', originalBiscuits);
      updateBiscuits(originalBiscuits);

      // PHASE 3: Force refresh from server to get real state
      console.log('[BET ERROR] Force refreshing from server...');
      await refreshUser();

      alert(`Failed to place bet: ${error.message}`);
    }
  }, [selectedGame, bidAmount, user, prediction, calculatePotentialWinnings, updateBiscuits, refreshUser]);

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-purple-900 mb-8">
          Place a New Bid
        </h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-4 text-purple-900">Loading games...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-purple-900 mb-8">
          Place a New Bid
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setRefreshTrigger(prev => prev + 1);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header with Sync Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-purple-900">
          Place a New Bid
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleSync('football')}
            disabled={syncing}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {syncing ? 'Syncing...' : 'Sync Football'}
          </button>
          <button
            onClick={() => handleSync('basketball')}
            disabled={syncing}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {syncing ? 'Syncing...' : 'Sync Basketball'}
          </button>
        </div>
      </div>

      {/* User Balance - Only show when user data is loaded */}
      {user && (
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Balance</p>
              <div className="flex items-center gap-2 mt-1">
                <BiscuitIcon className="w-8 h-8" />
                <p className="text-3xl font-bold">{user.biscuits.toLocaleString()}</p>
                <span className="text-lg opacity-90">Biscuits</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Min Bet: 10</p>
              <p className="text-sm opacity-90">Max Bet: 10,000</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Game</h2>

        {games.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No upcoming games available for betting.</p>
            <p className="text-sm">Check back later!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <ErrorBoundary key={`error-${game._id}`}>
                <EnhancedGameCard
                  key={game._id}
                  game={game}
                  selected={selectedGame?._id === game._id}
                  onClick={() => setSelectedGame(game)}
                  onPlaceBet={(data) => {
                    // Refresh games list to show updated odds
                    setRefreshTrigger(prev => prev + 1);
                  }}
                />
              </ErrorBoundary>
            ))}
          </div>
        )}
      </div>

      {/* Bid Details */}
      {selectedGame && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Bid Details</h2>

          {/* Prediction Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who will win?
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Home Team Button */}
              <button
                onClick={() => setPrediction("home")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  prediction === "home"
                    ? "border-purple-600 bg-purple-600 text-white shadow-lg"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  {/* Team Logo */}
                  {selectedGame.homeTeamLogo && (
                    <div className="relative w-16 h-16 mb-2">
                      <Image
                        src={selectedGame.homeTeamLogo}
                        alt={selectedGame.homeTeam}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  {/* Team Name */}
                  <div className="font-semibold text-lg text-center">
                    {selectedGame.homeTeam}
                  </div>
                  {/* Home Badge */}
                  <div className="text-xs mt-1 opacity-75">HOME</div>
                  {/* Odds */}
                  <div className="text-sm mt-1 opacity-90 font-bold">
                    {selectedGame.homeOdds.toFixed(2)}x
                  </div>
                </div>
              </button>

              {/* Away Team Button */}
              <button
                onClick={() => setPrediction("away")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  prediction === "away"
                    ? "border-purple-600 bg-purple-600 text-white shadow-lg"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  {/* Team Logo */}
                  {selectedGame.awayTeamLogo && (
                    <div className="relative w-16 h-16 mb-2">
                      <Image
                        src={selectedGame.awayTeamLogo}
                        alt={selectedGame.awayTeam}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  {/* Team Name */}
                  <div className="font-semibold text-lg text-center">
                    {selectedGame.awayTeam}
                  </div>
                  {/* Away Badge */}
                  <div className="text-xs mt-1 opacity-75">AWAY</div>
                  {/* Odds */}
                  <div className="text-sm mt-1 opacity-90 font-bold">
                    {selectedGame.awayOdds.toFixed(2)}x
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Bid Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bid Amount (Biscuits)
            </label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter amount"
              min="1"
            />
          </div>

          {/* Potential Winnings */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-700">Potential Winnings</div>
            <div className="text-2xl font-bold text-purple-900">
              {calculatePotentialWinnings()} Biscuits
            </div>
          </div>

          <button
            onClick={handlePlaceBid}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Place Bid
          </button>
        </div>
      )}

      {/* Game Information */}
      {selectedGame && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Game Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-700">Home Bets</div>
              <div className="text-2xl font-bold text-purple-900">
                {selectedGame.homeBets || 0}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-700">Away Bets</div>
              <div className="text-2xl font-bold text-purple-900">
                {selectedGame.awayBets || 0}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-700">Total Wagered</div>
              <div className="text-2xl font-bold text-purple-900">
                {(selectedGame.homeBiscuits + selectedGame.awayBiscuits).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-700">Location</div>
              <div className="text-sm font-semibold text-purple-900 mt-2">
                {selectedGame.location || 'TBD'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBidPage;
