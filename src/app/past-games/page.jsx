"use client";

import React, { useState, useEffect } from "react";
import CompletedGameCard from '../Components/CompletedGameCard';
import { RefreshCw, Trophy, TrendingDown, Target, Star, AlertCircle, Football, Basketball, TrendingUp } from 'lucide-react';

const PastGamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSport, setSelectedSport] = useState('football');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedGame, setSelectedGame] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch completed games
  useEffect(() => {
    async function fetchCompletedGames() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/games/completed?sport=${selectedSport}&sortBy=${sortBy}&limit=50`);

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.games) {
          setGames(data.games);
        } else {
          throw new Error(data.error || 'Failed to load games');
        }
      } catch (err) {
        console.error('Failed to fetch games:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCompletedGames();
  }, [selectedSport, sortBy, refreshTrigger]);

  // Calculate stats
  const uwWins = games.filter(game =>
    (game.winner === 'home' && game.homeTeam.includes('Washington')) ||
    (game.winner === 'away' && game.awayTeam.includes('Washington'))
  ).length;

  const uwLosses = games.filter(game =>
    (game.winner === 'home' && game.awayTeam.includes('Washington')) ||
    (game.winner === 'away' && game.homeTeam.includes('Washington'))
  ).length;

  const winPercentage = uwWins + uwLosses > 0
    ? Math.round((uwWins / (uwWins + uwLosses)) * 100)
    : 0;

  // Loading state
  if (loading) {
    return (
  <div className="p-8 min-h-screen bg-slate-100">
        <h1 className="text-3xl font-bold text-uw-purple-900 mb-8">
          Past Games
        </h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-4 text-purple-900">Loading past games...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
  <div className="p-8 min-h-screen bg-slate-100">
        <h1 className="text-3xl font-bold text-uw-purple-900 mb-8">
          Past Games
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
  <div className="p-8 min-h-screen bg-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-uw-purple-900">
          Past Games
        </h1>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {/* Sport Filter */}
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-medium"
          >
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="all">All Sports</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-medium"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Season Stats */}
      {games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wins */}
          <div 
            className="rounded-xl p-6 text-white transform hover:scale-[1.02] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <Trophy className="w-10 h-10 mb-3 drop-shadow-lg" />
                <p className="text-base font-semibold mb-1">UW Wins</p>
                <p className="text-5xl font-bold drop-shadow-md">{uwWins}</p>
              </div>
              <Star className="w-16 h-16 opacity-30 drop-shadow-lg text-white" />
            </div>
          </div>

          {/* Losses */}
          <div 
            className="rounded-xl p-6 text-white transform hover:scale-[1.02] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <TrendingDown className="w-10 h-10 mb-3 drop-shadow-lg" />
                <p className="text-base font-semibold mb-1">UW Losses</p>
                <p className="text-5xl font-bold drop-shadow-md">{uwLosses}</p>
              </div>
              <AlertCircle className="w-16 h-16 opacity-30 drop-shadow-lg text-white" />
            </div>
          </div>

          {/* Win Percentage */}
          <div 
            className="rounded-xl p-6 text-white transform hover:scale-[1.02] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #581c87 100%)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <Target className="w-10 h-10 mb-3 drop-shadow-lg" />
                <p className="text-base font-semibold mb-1">Win Rate</p>
                <p className="text-5xl font-bold drop-shadow-md">{winPercentage}%</p>
              </div>
              <TrendingUp className="w-16 h-16 opacity-30 drop-shadow-lg text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No completed games found for {selectedSport}.</p>
          <p className="text-sm">Try selecting a different sport or check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <CompletedGameCard
              key={game._id}
              game={game}
              onClick={() => setSelectedGame(game)}
            />
          ))}
        </div>
      )}

      {/* Game Details Modal (optional - for future enhancement) */}
      {selectedGame && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Game Details</h2>
              <button
                onClick={() => setSelectedGame(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">{selectedGame.formattedDate}</div>
                <div className="text-sm text-gray-500">{selectedGame.location}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${selectedGame.homeScore > selectedGame.awayScore ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedGame.homeScore}
                  </div>
                  <div className="font-semibold mt-2">{selectedGame.homeTeam}</div>
                  <div className="text-xs text-gray-500">HOME</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${selectedGame.awayScore > selectedGame.homeScore ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedGame.awayScore}
                  </div>
                  <div className="font-semibold mt-2">{selectedGame.awayTeam}</div>
                  <div className="text-xs text-gray-500">AWAY</div>
                </div>
              </div>

              {selectedGame.espnOdds && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Pre-Game Odds</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedGame.espnOdds.spread && (
                      <div>
                        <span className="text-gray-600">Spread:</span> {selectedGame.espnOdds.spread}
                      </div>
                    )}
                    {selectedGame.espnOdds.overUnder && (
                      <div>
                        <span className="text-gray-600">O/U:</span> {selectedGame.espnOdds.overUnder}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-sm text-purple-600">Total Bets</div>
                  <div className="text-2xl font-bold text-purple-900">{selectedGame.totalBetsPlaced || 0}</div>
                </div>
                <div className="bg-gold-50 rounded-lg p-3">
                  <div className="text-sm text-yellow-600">Wagered</div>
                  <div className="text-2xl font-bold text-yellow-900">{(selectedGame.totalBiscuitsWagered || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastGamesPage;
