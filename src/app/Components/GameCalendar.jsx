'use client';

import React, { useState, useEffect, memo } from 'react';
import { GameCardSkeleton } from './ui/LoadingSkeleton';
import { formatDate, formatTime } from '@/lib/date-utils';

/**
 * GameCalendar Component
 * Displays upcoming UW Huskies games from ESPN API via MongoDB
 */

const GameCalendar = memo(({ sport = 'football' }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedGame, setSelectedGame] = useState(null);

  // Fetch games from API
  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/games/upcoming?sport=${sport}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.games) {
          setGames(data.games);

          // Set current week to the first game's week if available
          if (data.games.length > 0 && data.games[0].week) {
            setCurrentWeek(data.games[0].week);
          }
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

    fetchGames();
  }, [sport]);

  // Get games for current week
  const getGamesForWeek = (week) => {
    return games.filter(game => game.week === week);
  };

  // Function to handle week navigation
  const changeWeek = (increment) => {
    const newWeek = currentWeek + increment;
    // Check if there are games in the new week
    const gamesInWeek = games.filter(g => g.week === newWeek);
    if (gamesInWeek.length > 0) {
      setCurrentWeek(newWeek);
    }
  };

  // Get min and max weeks
  const weeks = games.map(g => g.week).filter(w => w);
  const minWeek = weeks.length > 0 ? Math.min(...weeks) : 1;
  const maxWeek = weeks.length > 0 ? Math.max(...weeks) : 12;

  const currentGames = getGamesForWeek(currentWeek);

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No games state
  if (games.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No upcoming games found.</p>
          <p className="text-sm">Games will appear here once they are scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeWeek(-1)}
          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentWeek <= minWeek}
        >
          Previous Week
        </button>
        <h2 className="text-xl font-bold text-purple-900">
          Week {currentWeek}
        </h2>
        <button
          onClick={() => changeWeek(1)}
          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentWeek >= maxWeek}
        >
          Next Week
        </button>
      </div>

      <div className="space-y-2">
        {currentGames.length > 0 ? (
          currentGames.map(game => (
            <div
              key={game._id || game.id}
              onClick={() => setSelectedGame(game)}
              className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-purple-900">
                  <div className="font-semibold">
                    {game.homeTeam === 'Washington Huskies' ? game.awayTeam : game.homeTeam}
                  </div>
                  <div className="text-sm text-purple-700">
                    {formatDate(game.gameDate, { includeWeekday: true, includeYear: true, format: 'long' })} at {formatTime(game.gameDate)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-purple-700">
                  {game.homeTeam === 'Washington Huskies' ? 'Home' : 'Away'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {game.status === 'scheduled' ? 'Upcoming' : game.status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No games scheduled for Week {currentWeek}
          </div>
        )}
      </div>

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
            <h3 className="text-xl font-bold mb-4">Game Details</h3>
            <p className="mb-2">
              <span className="font-semibold">Teams:</span> {selectedGame.homeTeam} vs {selectedGame.awayTeam}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Date:</span> {formatDate(selectedGame.gameDate, { includeWeekday: true, includeYear: true, format: 'long' })}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Time:</span> {formatTime(selectedGame.gameDate)}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Location:</span> {selectedGame.location}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span> {selectedGame.status}
            </p>
            {selectedGame.status === 'completed' && (
              <p className="mb-4">
                <span className="font-semibold">Score:</span> {selectedGame.homeTeam} {selectedGame.homeScore} - {selectedGame.awayScore} {selectedGame.awayTeam}
              </p>
            )}
            <button
              onClick={() => setSelectedGame(null)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

GameCalendar.displayName = 'GameCalendar';

export default GameCalendar;
