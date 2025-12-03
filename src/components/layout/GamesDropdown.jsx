/**
 * Games Dropdown Component
 * Shows upcoming UW games with team logos in a dropdown menu
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Dropdown from '../ui/Dropdown';
import { Calendar, Clock, MapPin, Trophy, Loader } from 'lucide-react';
import { formatDate, formatTime, getDaysUntil } from '@shared/utils/date-utils';

export default function GamesDropdown({ className = '' }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingGames();
  }, []);

  const fetchUpcomingGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/games/upcoming?sport=all&limit=5');

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const data = await response.json();
      setGames(data.games || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger button
  const trigger = (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent text-uw-purple-600 hover:bg-uw-purple-100 hover:text-uw-purple-700 transition-all duration-200 font-medium">
      <Calendar className="w-5 h-5" />
      <span className="hidden lg:inline">Games</span>
    </div>
  );

  return (
    <Dropdown trigger={trigger} className={className} closeOnClick={false} align="left">
      <div className="py-2">
        {/* Header */}
        <Dropdown.Header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-base font-bold text-uw-purple-900">Upcoming Games</span>
          <Link
            href="/games"
            className="text-xs text-uw-purple-600 hover:text-uw-purple-700 font-medium hover:underline"
          >
            View All
          </Link>
        </Dropdown.Header>

        {/* Loading State */}
        {loading && (
          <div className="px-4 py-8 text-center">
            <Loader className="w-6 h-6 text-uw-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading games...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-red-600">Failed to load games</p>
            <button
              onClick={fetchUpcomingGames}
              className="text-xs text-uw-purple-600 hover:underline mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Games List */}
        {!loading && !error && games.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto">
            {games.map((game, index) => (
              <Link
                key={game._id || index}
                href="/games"
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    {/* Team Logos */}
                    <div className="flex items-center gap-1">
                      {/* UW Logo */}
                      {game.uwLogo && (
                        <div className="relative w-8 h-8 flex-shrink-0">
                          <Image
                            src={game.uwLogo}
                            alt="UW Logo"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}

                      {/* VS Text */}
                      <span className="text-xs font-bold text-gray-400 mx-1">vs</span>

                      {/* Opponent Logo */}
                      {game.opponentLogo ? (
                        <div className="relative w-8 h-8 flex-shrink-0">
                          <Image
                            src={game.opponentLogo}
                            alt={`${game.opponent} Logo`}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Game Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          vs {game.opponent}
                        </h4>
                        <span className="text-xs font-medium text-uw-purple-600 bg-uw-purple-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {getDaysUntil(game.gameDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(game.gameDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(game.gameDate)}</span>
                        </div>
                      </div>

                      {game.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{game.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && games.length === 0 && (
          <div className="px-4 py-8 text-center">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-medium mb-1">No upcoming games</p>
            <p className="text-xs text-gray-500">Check back later for new games</p>
          </div>
        )}
      </div>
    </Dropdown>
  );
}
