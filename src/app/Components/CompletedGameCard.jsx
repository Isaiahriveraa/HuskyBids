'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Trophy, Users, TrendingUp } from 'lucide-react';
import { getTeamPositions, determineWinner } from '../../../lib/utils/game-utils';

const CompletedGameCard = memo(({ game, onClick }) => {
  // Get team positions
  const { isUWHome, uwTeam } = getTeamPositions(game);

  // Determine if UW won, lost, or tied
  const isUWWinner = game.winner === uwTeam;
  const isUWLoser = game.winner !== 'tie' && game.winner !== uwTeam;

  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer
        border-2 ${isUWWinner ? 'border-green-400 hover:border-green-500' : isUWLoser ? 'border-red-400 hover:border-red-500' : 'border-gray-200 hover:border-purple-400'}
        overflow-hidden
        flex flex-col
      `}
    >
      {/* Header with result badge */}
      <div className={`
        p-3 text-white text-center font-bold text-sm flex-shrink-0
        ${isUWWinner ? 'bg-gradient-to-r from-green-500 to-green-600' : isUWLoser ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}
      `}>
        {game.winner === 'tie' ? '🤝 TIE GAME' : isUWWinner ? '🎉 UW WIN' : isUWLoser ? '💔 UW LOSS' : '✅ FINAL'}
      </div>

      {/* Teams and Scores */}
      <div className="p-4 bg-white flex-1 rounded-b-lg">
        {/* Home Team */}
        <div className={`flex items-center justify-between mb-3 pb-3 border-b-2 ${game.homeScore > game.awayScore ? 'border-green-200' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 flex-1">
            {game.homeTeamLogo && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={game.homeTeamLogo}
                  alt={game.homeTeam}
                  fill
                  className="object-contain"
                  quality={85}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                />
              </div>
            )}
            <div className="flex-1">
              <div className={`font-bold ${game.homeScore > game.awayScore ? 'text-green-700 text-lg' : 'text-gray-700'}`}>
                {game.homeTeam}
              </div>
              <div className="text-xs text-gray-500">HOME</div>
            </div>
          </div>
          <div className={`text-3xl font-bold ${game.homeScore > game.awayScore ? 'text-green-600' : 'text-gray-600'}`}>
            {game.homeScore}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {game.awayTeamLogo && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={game.awayTeamLogo}
                  alt={game.awayTeam}
                  fill
                  className="object-contain"
                  quality={85}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                />
              </div>
            )}
            <div className="flex-1">
              <div className={`font-bold ${game.awayScore > game.homeScore ? 'text-green-700 text-lg' : 'text-gray-700'}`}>
                {game.awayTeam}
              </div>
              <div className="text-xs text-gray-500">AWAY</div>
            </div>
          </div>
          <div className={`text-3xl font-bold ${game.awayScore > game.homeScore ? 'text-green-600' : 'text-gray-600'}`}>
            {game.awayScore}
          </div>
        </div>

        {/* Top Players Section */}
        {(game.uwTopPlayer || game.opponentTopPlayer) && (
          <div className="mt-4 pt-4 border-t-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-semibold text-gray-600">TOP PERFORMERS</span>
            </div>

            <div className="space-y-2">
              {/* UW Top Player */}
              {game.uwTopPlayer && (
                <div className="bg-purple-50 rounded p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        UW
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-purple-900">{game.uwTopPlayer.name}</div>
                        <div className="text-xs text-purple-600">{game.uwTopPlayer.position}</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-purple-700">{game.uwTopPlayer.stats}</div>
                  </div>
                </div>
              )}

              {/* Opponent Top Player */}
              {game.opponentTopPlayer && (
                <div className="bg-gray-50 rounded p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {game.opponent?.substring(0, 3).toUpperCase() || 'OPP'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{game.opponentTopPlayer.name}</div>
                        <div className="text-xs text-gray-600">{game.opponentTopPlayer.position}</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-700">{game.opponentTopPlayer.stats}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Betting Stats */}
        <div className="mt-4 pt-4 border-t-2 border-gray-100 grid grid-cols-2 gap-3 text-center">
          <div className="bg-purple-50 rounded p-2">
            <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
            <div className="text-xs text-purple-600 font-medium">Total Bets</div>
            <div className="text-lg font-bold text-purple-900">{game.totalBetsPlaced || 0}</div>
          </div>
          <div className="bg-gold-50 rounded p-2">
            <TrendingUp className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
            <div className="text-xs text-yellow-600 font-medium">Total Wagered</div>
            <div className="text-lg font-bold text-yellow-900">{(game.totalBiscuitsWagered || 0).toLocaleString()}</div>
          </div>
        </div>

        {/* Game Date and Location */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-center text-xs text-gray-500">
          <div className="font-medium">{game.formattedDate}</div>
          {game.location && <div className="mt-1">{game.location}</div>}
        </div>
      </div>
    </div>
  );
});

CompletedGameCard.displayName = 'CompletedGameCard';

export default CompletedGameCard;
