'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useUserContext } from '../contexts/UserContext';
import {
  SectionLabel,
  DottedDivider,
  BalanceDisplay,
  MinimalGameCard,
  ActionBar,
} from '@/components/experimental';
import ErrorBoundary from '@components/ErrorBoundary';

export default function NewBidPage() {
  const { user, loading: userLoading, refreshUser, updateBiscuits } = useUserContext();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [prediction, setPrediction] = useState('home');

  // Fetch upcoming games
  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/games/upcoming?sport=all&limit=20&includeCompleted=false');

        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }

        const data = await response.json();

        if (data.success && data.games) {
          // Filter only games that are open for betting
          const bettableGames = data.games.filter(game =>
            game.status === 'scheduled' && new Date(game.gameDate) > new Date()
          );
          setGames(bettableGames);
        } else {
          throw new Error(data.error || 'Failed to load games');
        }
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const calculatePotentialWinnings = useCallback(() => {
    if (!selectedGame || !bidAmount) return 0;
    const odds = prediction === 'home' ? selectedGame.homeOdds : selectedGame.awayOdds;
    return Math.round(Number(bidAmount) * odds);
  }, [selectedGame, bidAmount, prediction]);

  const handlePlaceBid = useCallback(async () => {
    if (!selectedGame || !bidAmount) {
      alert('Please select a game and enter bid amount');
      return;
    }

    if (!user) {
      alert('Please log in to place a bet');
      return;
    }

    const betAmountNum = Number(bidAmount);

    if (betAmountNum < 10) {
      alert('Minimum bet is 10 biscuits');
      return;
    }

    if (betAmountNum > user.biscuits) {
      alert(`Insufficient biscuits. You have ${user.biscuits} biscuits.`);
      return;
    }

    if (betAmountNum > 10000) {
      alert('Maximum bet is 10,000 biscuits');
      return;
    }

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
        updateBiscuits(data.user.biscuits);

        const winnings = calculatePotentialWinnings();
        alert(`Bet placed successfully!
Game: ${selectedGame.homeTeam} vs ${selectedGame.awayTeam}
Bet Amount: ${bidAmount} Biscuits
Your Prediction: ${prediction === 'home' ? selectedGame.homeTeam : selectedGame.awayTeam} wins
Potential Winnings: ${winnings} Biscuits`);

        // Reset form
        setSelectedGame(null);
        setBidAmount('');
        setPrediction('home');

        await refreshUser();
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      updateBiscuits(originalBiscuits);
      await refreshUser();
      alert(`Failed to place bet: ${error.message}`);
    }
  }, [selectedGame, bidAmount, user, prediction, calculatePotentialWinnings, updateBiscuits, refreshUser]);

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="py-8 space-y-4 font-mono animate-pulse">
        <div className="h-4 bg-zinc-900 rounded w-32" />
        <div className="border-t border-dotted border-zinc-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-900/50 border border-dotted border-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 font-mono">
        <SectionLabel>Error</SectionLabel>
        <div className="mt-4 py-4 text-center border border-dotted border-zinc-800">
          <p className="text-zinc-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-zinc-600 text-xs hover:text-zinc-400 underline mt-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6 font-mono">
      {/* Header */}
      <div>
        <SectionLabel>Place Bet</SectionLabel>
        <p className="text-zinc-600 text-xs mt-1">Select a game and make your prediction</p>
      </div>

      <DottedDivider />

      {/* Balance */}
      {user && <BalanceDisplay balance={user.biscuits} />}

      <DottedDivider />

      {/* Game Selection */}
      <div>
        <SectionLabel className="mb-4">Select Game</SectionLabel>
        {games.length === 0 ? (
          <div className="py-8 text-center border border-dotted border-zinc-800">
            <p className="text-zinc-600 text-sm">No upcoming games available</p>
            <p className="text-zinc-700 text-xs mt-2">Check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {games.map((game) => (
              <ErrorBoundary key={game._id}>
                <div
                  onClick={() => setSelectedGame(game)}
                  className="cursor-pointer"
                >
                  <MinimalGameCard
                    game={game}
                    selected={selectedGame?._id === game._id}
                  />
                </div>
              </ErrorBoundary>
            ))}
          </div>
        )}
      </div>

      {/* Bid Details */}
      {selectedGame && (
        <>
          <DottedDivider />

          <div className="space-y-6">
            <SectionLabel>Bet Details</SectionLabel>

            {/* Team Selection */}
            <div className="grid grid-cols-2 gap-3">
              {/* Home Team */}
              <button
                onClick={() => setPrediction('home')}
                className={`p-4 border border-dotted transition-all ${
                  prediction === 'home'
                    ? 'border-zinc-600 bg-zinc-900/50'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {selectedGame.homeTeamLogo && (
                    <div className="relative w-12 h-12">
                      <Image
                        src={selectedGame.homeTeamLogo}
                        alt={selectedGame.homeTeam}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="text-xs text-zinc-400 text-center">
                    {selectedGame.homeTeam}
                  </div>
                  <div className="text-xs text-zinc-600">HOME</div>
                  <div className="text-sm text-zinc-300 font-bold">
                    {selectedGame.homeOdds.toFixed(2)}x
                  </div>
                </div>
              </button>

              {/* Away Team */}
              <button
                onClick={() => setPrediction('away')}
                className={`p-4 border border-dotted transition-all ${
                  prediction === 'away'
                    ? 'border-zinc-600 bg-zinc-900/50'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {selectedGame.awayTeamLogo && (
                    <div className="relative w-12 h-12">
                      <Image
                        src={selectedGame.awayTeamLogo}
                        alt={selectedGame.awayTeam}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="text-xs text-zinc-400 text-center">
                    {selectedGame.awayTeam}
                  </div>
                  <div className="text-xs text-zinc-600">AWAY</div>
                  <div className="text-sm text-zinc-300 font-bold">
                    {selectedGame.awayOdds.toFixed(2)}x
                  </div>
                </div>
              </button>
            </div>

            {/* Bid Amount Input */}
            <div>
              <label className="block text-xs text-zinc-600 mb-2">
                Bet Amount (min: 10, max: 10,000)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-dotted border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-zinc-600 font-mono"
                placeholder="Enter amount"
                min="10"
                max="10000"
              />
            </div>

            {/* Potential Winnings */}
            {bidAmount && (
              <div className="p-4 border border-dotted border-zinc-800 bg-zinc-900/30">
                <div className="text-xs text-zinc-600">Potential Winnings</div>
                <div className="text-xl text-zinc-300 font-bold mt-1">
                  {calculatePotentialWinnings()} Biscuits
                </div>
              </div>
            )}

            {/* Place Bet Button */}
            <button
              onClick={handlePlaceBid}
              className="w-full py-3 border border-dotted border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-sm"
            >
              Place Bet
            </button>

            {/* Game Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="p-3 border border-dotted border-zinc-800">
                <div className="text-xs text-zinc-600">Home Bets</div>
                <div className="text-lg text-zinc-300 font-bold mt-1">
                  {selectedGame.homeBets || 0}
                </div>
              </div>
              <div className="p-3 border border-dotted border-zinc-800">
                <div className="text-xs text-zinc-600">Away Bets</div>
                <div className="text-lg text-zinc-300 font-bold mt-1">
                  {selectedGame.awayBets || 0}
                </div>
              </div>
              <div className="p-3 border border-dotted border-zinc-800">
                <div className="text-xs text-zinc-600">Total Wagered</div>
                <div className="text-lg text-zinc-300 font-bold mt-1">
                  {(selectedGame.homeBiscuits + selectedGame.awayBiscuits).toLocaleString()}
                </div>
              </div>
              <div className="p-3 border border-dotted border-zinc-800">
                <div className="text-xs text-zinc-600">Location</div>
                <div className="text-xs text-zinc-400 mt-1">
                  {selectedGame.location || 'TBD'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <DottedDivider />

      {/* Actions */}
      <ActionBar
        actions={[
          { key: 'D', label: 'Dashboard' },
          { key: 'G', label: 'Games' },
          { key: 'B', label: 'All bets' },
        ]}
      />
    </div>
  );
}
