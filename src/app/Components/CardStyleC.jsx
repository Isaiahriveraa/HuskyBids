'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Flame, Award } from 'lucide-react';

/**
 * Style C: Bold & Visual-Heavy
 * Handles both upcoming and completed games with bold colors and visual impact
 */
export default function CardStyleC({ game, onClick }) {
  // Check if UW is home team (handle variations: "Washington", "Washington Huskies", etc.)
  const isUWHome = game.homeTeam?.toLowerCase().includes('washington') &&
                   !game.homeTeam?.toLowerCase().includes('state');

  const uwScore = isUWHome ? game.homeScore : game.awayScore;
  const opponentScore = isUWHome ? game.awayScore : game.homeScore;

  // Fix: Check if UW won based on home/away status and winner field
  const isUWWinner = (isUWHome && game.winner === 'home') || (!isUWHome && game.winner === 'away');

  const isCompleted = game.status === 'completed';
  const isUpcoming = game.status === 'scheduled';

  // Determine header background
  const getHeaderBackground = () => {
    if (isCompleted) {
      return isUWWinner
        ? 'linear-gradient(to bottom right, #4B2E83, #3D2569)' // UW Purple
        : 'linear-gradient(to bottom right, #6B7280, #4B5563)'; // Gray
    }
    return 'linear-gradient(to bottom right, #4B2E83, #3D2569)'; // Default UW Purple for upcoming
  };

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
        style={{
          background: getHeaderBackground()
        }}
      >
        {/* Bold Header */}
        <div className="bg-black/20 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo and Status */}
            {isCompleted ? (
              <>
                {/* Show winning team logo for completed games */}
                {isUWWinner && game.uwLogo && (
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={game.uwLogo}
                      alt="UW Logo"
                      fill
                      className="object-contain"
                      quality={85}
                    />
                  </div>
                )}
                {!isUWWinner && game.opponentLogo && (
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={game.opponentLogo}
                      alt="Opponent Logo"
                      fill
                      className="object-contain"
                      quality={85}
                    />
                  </div>
                )}
                <span className="text-white font-bold text-base">
                  {isUWWinner ? 'HUSKIES VICTORY' : 'TOUGH LOSS'}
                </span>
              </>
            ) : (
              <>
                {/* Show UW logo for upcoming games */}
                {game.uwLogo && (
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={game.uwLogo}
                      alt="UW Logo"
                      fill
                      className="object-contain"
                      quality={85}
                    />
                  </div>
                )}
                <span className="text-white font-bold text-base">
                  {game.formattedDate || 'UPCOMING GAME'}
                </span>
              </>
            )}
          </div>
          <div className="text-white/90 text-xs font-semibold uppercase tracking-wider">
            {game.sport}
          </div>
        </div>

        {/* Main Content - White Background */}
        <div className="bg-white p-4">
          {/* Team Matchup - Vertical Stack */}
          <div className="mb-4">
            {/* Washington Team */}
            <div className="flex items-center justify-between mb-3 p-3 rounded-lg bg-gradient-to-r from-uw-purple-50 to-white">
              <div className="flex items-center gap-3">
                {game.uwLogo && (
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image
                      src={game.uwLogo}
                      alt="UW Logo"
                      fill
                      className="object-contain"
                      quality={90}
                      loading="lazy"
                    />
                  </div>
                )}
                <div>
                  <div className="font-black text-base text-uw-purple-900">WASHINGTON</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Huskies</div>
                  {!isCompleted && game.homeOdds && (
                    <div className="text-xs text-uw-purple-600 font-bold mt-0.5">
                      Odds: {isUWHome ? game.homeOdds : game.awayOdds}x
                    </div>
                  )}
                </div>
              </div>
              {isCompleted ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`text-4xl font-black ${isUWWinner ? 'text-uw-purple-600' : 'text-gray-600'}`}
                >
                  {uwScore}
                </motion.div>
              ) : (
                <div className="text-right">
                  {game.canBet && (
                    <div className="text-xs text-green-600 font-bold uppercase">Open</div>
                  )}
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="text-center text-sm text-gray-400 font-semibold my-2">VS</div>

            {/* Opponent Team */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                {game.opponentLogo && (
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image
                      src={game.opponentLogo}
                      alt="Opponent Logo"
                      fill
                      className="object-contain"
                      quality={90}
                      loading="lazy"
                    />
                  </div>
                )}
                <div>
                  <div className="font-black text-base text-gray-900">{game.opponent.toUpperCase()}</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Opponent</div>
                  {!isCompleted && game.awayOdds && (
                    <div className="text-xs text-gray-600 font-bold mt-0.5">
                      Odds: {isUWHome ? game.awayOdds : game.homeOdds}x
                    </div>
                  )}
                </div>
              </div>
              {isCompleted ? (
                <div className={`text-4xl font-black ${!isUWWinner ? 'text-gray-800' : 'text-gray-600'}`}>
                  {opponentScore}
                </div>
              ) : (
                <div className="text-right">
                  {game.formattedTime && (
                    <div className="text-xs text-gray-500 font-semibold">{game.formattedTime}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Top Performers - Compact (Only for completed games) */}
          {isCompleted && (game.uwTopPlayer || game.opponentTopPlayer) && (
            <div className="border-t-2 border-gray-200 pt-3 mb-3">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-black text-xs text-gray-700 uppercase tracking-wider">Top Performers</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* UW Top Player */}
                {game.uwTopPlayer && (
                  <div className="bg-gradient-to-br from-uw-purple-100 to-uw-purple-50 rounded-lg p-2">
                    <div className="font-bold text-uw-purple-900 text-xs">{game.uwTopPlayer.name}</div>
                    <div className="text-xs text-uw-purple-600 font-semibold">{game.uwTopPlayer.position}</div>
                    <div className="text-xs font-black text-uw-purple-900 mt-0.5">{game.uwTopPlayer.stats}</div>
                  </div>
                )}

                {/* Opponent Top Player */}
                {game.opponentTopPlayer && (
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg p-2">
                    <div className="font-bold text-gray-900 text-xs">{game.opponentTopPlayer.name}</div>
                    <div className="text-xs text-gray-600 font-semibold">{game.opponentTopPlayer.position}</div>
                    <div className="text-xs font-black text-gray-900 mt-0.5">{game.opponentTopPlayer.stats}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compact Stats Footer */}
          <div className="border-t-2 border-gray-200 pt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-black text-uw-purple-900">{game.totalBetsPlaced || 0}</div>
              <div className="text-xs font-bold text-gray-600 uppercase">Bets</div>
            </div>
            <div>
              <div className="text-lg font-black text-yellow-700">{(game.totalBiscuitsWagered || 0).toLocaleString()}</div>
              <div className="text-xs font-bold text-gray-600 uppercase">Wagered</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-700 mt-2">{game.formattedDate}</div>
              <div className="text-xs text-gray-500">{game.location?.split(',')[0]}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
