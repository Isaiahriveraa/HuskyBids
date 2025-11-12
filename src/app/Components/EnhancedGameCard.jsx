/**
 * Enhanced Game Card Component
 * Displays game information with team logos, top players, odds, and betting UI
 */

'use client';

import React, { useState, memo, useCallback } from 'react';
import Image from 'next/image';
import { Card, Button, Badge } from './ui';
import BiscuitIcon from './BiscuitIcon';
import GameDetailsModal from './GameDetailsModal';
import BettingModal from './BettingModal';
import { Calendar, MapPin, Clock, Trophy, User, TrendingUp, Info } from 'lucide-react';
import { formatDate, formatTime, getDaysUntil } from '@/lib/date-utils';
import { getTeamPositions, getStatusBadgeVariant } from '../../../lib/utils/game-utils';

const EnhancedGameCard = memo(({ game, onPlaceBet, selected = false, onClick }) => {
  // State for modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);

  // Get team positions using utility
  const { isUWHome, uwTeam, opponentTeam } = getTeamPositions(game);

  return (
    <Card
      variant="elevated"
      className={`hover:shadow-2xl transition-all cursor-pointer ${
        selected ? 'ring-2 ring-uw-purple-500 shadow-xl' : ''
      }`}
      onClick={onClick}
    >
      <Card.Header>
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            <Badge variant={getStatusBadgeVariant(game.status)} size="sm">
              {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
            </Badge>
            <Badge variant="outline" size="sm">
              {game.sport === 'football' ? 'Football' : 'Basketball'}
            </Badge>
            {game.week && (
              <Badge variant="gold" size="sm">
                Week {game.week}
              </Badge>
            )}
          </div>
          {game.canBet && (
            <Badge variant="success" size="sm">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Open
            </Badge>
          )}
        </div>
      </Card.Header>

      <Card.Body>
        {/* Team Matchup with Logos */}
        <div className="mb-4">
          {/* UW Team */}
          <div className="flex items-center justify-between mb-3 p-3 bg-uw-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              {game.uwLogo && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={game.uwLogo}
                    alt="UW Logo"
                    fill
                    className="object-contain"
                    quality={85}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                  />
                </div>
              )}
              <div>
                <div className="font-bold text-uw-purple-900">Washington Huskies</div>
                {game.uwTopPlayer && (
                  <div className="text-xs text-uw-purple-700 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="font-semibold">{game.uwTopPlayer.name}</span>
                    <span className="text-gray-600">• {game.uwTopPlayer.position}</span>
                  </div>
                )}
                {game.uwTopPlayer?.stats && (
                  <div className="text-xs text-gray-600 mt-0.5">{game.uwTopPlayer.stats}</div>
                )}
              </div>
            </div>
            {game.status === 'completed' && (
              <span className="text-2xl font-bold text-uw-purple-900">
                {isUWHome ? game.homeScore : game.awayScore}
              </span>
            )}
          </div>

          {/* VS Divider */}
          <div className="text-center text-sm text-gray-400 font-semibold my-2">VS</div>

          {/* Opponent Team */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {game.opponentLogo && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={game.opponentLogo}
                    alt="Opponent Logo"
                    fill
                    className="object-contain"
                    quality={85}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                  />
                </div>
              )}
              <div>
                <div className="font-bold text-gray-900">{game.opponent}</div>
                {game.opponentTopPlayer && (
                  <div className="text-xs text-gray-700 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="font-semibold">{game.opponentTopPlayer.name}</span>
                    <span className="text-gray-600">• {game.opponentTopPlayer.position}</span>
                  </div>
                )}
                {game.opponentTopPlayer?.stats && (
                  <div className="text-xs text-gray-600 mt-0.5">{game.opponentTopPlayer.stats}</div>
                )}
              </div>
            </div>
            {game.status === 'completed' && (
              <span className="text-2xl font-bold text-gray-700">
                {isUWHome ? game.awayScore : game.homeScore}
              </span>
            )}
          </div>
        </div>

        {/* Game Details */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-uw-purple-500" />
            <span>{formatDate(game.gameDate, { includeWeekday: true, capitalize: true })}</span>
            <Badge variant="gold" size="sm">
              {getDaysUntil(game.gameDate)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-uw-purple-500" />
            <span>{formatTime(game.gameDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-uw-purple-500" />
            <span className="truncate">{game.location}</span>
          </div>
        </div>

        {/* Betting Stats */}
        {game.totalBetsPlaced > 0 && (
          <div className="pt-3 border-t">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-600 text-xs">Total Bets</div>
                <div className="font-semibold text-uw-purple-900">{game.totalBetsPlaced}</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">Total Wagered</div>
                <div className="font-semibold text-uw-purple-900 flex items-center gap-1">
                  <BiscuitIcon size={14} />
                  {game.totalBiscuitsWagered?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Betting Odds */}
        {game.canBet && (game.homeOdds || game.awayOdds) && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-gray-600 mb-2">HuskyBids Odds (Payout Multiplier)</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-uw-purple-50 p-2 rounded text-center">
                <div className="text-xs text-uw-purple-700 font-semibold">Washington</div>
                <div className="font-bold text-uw-purple-900">
                  {isUWHome ? game.homeOdds?.toFixed(2) : game.awayOdds?.toFixed(2)}x
                </div>
              </div>
              <div className="bg-gray-100 p-2 rounded text-center">
                <div className="text-xs text-gray-700 font-semibold">{game.opponent?.split(' ')[0]}</div>
                <div className="font-bold text-gray-900">
                  {isUWHome ? game.awayOdds?.toFixed(2) : game.homeOdds?.toFixed(2)}x
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ESPN Real Odds */}
        {game.espnOdds && (game.espnOdds.spread || game.espnOdds.overUnder) && (
          <div className="mt-3 pt-3 border-t bg-blue-50 -mx-4 -mb-4 p-4 rounded-b-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-3 h-3 text-blue-600" />
              <div className="text-xs font-semibold text-blue-900">ESPN Real Odds</div>
              {game.espnOdds.provider && (
                <Badge variant="outline" size="sm" className="text-blue-700 border-blue-300">
                  {game.espnOdds.provider}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {game.espnOdds.spread && (
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-600">Spread</div>
                  <div className="font-bold text-gray-900">{game.espnOdds.spread}</div>
                </div>
              )}
              {game.espnOdds.overUnder && (
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-600">O/U</div>
                  <div className="font-bold text-gray-900">{game.espnOdds.overUnder}</div>
                </div>
              )}
              {game.espnOdds.homeMoneyLine && (
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-600">Home ML</div>
                  <div className="font-bold text-gray-900">{game.espnOdds.homeMoneyLine > 0 ? '+' : ''}{game.espnOdds.homeMoneyLine}</div>
                </div>
              )}
              {game.espnOdds.awayMoneyLine && (
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-600">Away ML</div>
                  <div className="font-bold text-gray-900">{game.espnOdds.awayMoneyLine > 0 ? '+' : ''}{game.espnOdds.awayMoneyLine}</div>
                </div>
              )}
            </div>
            {game.espnOdds.details && (
              <div className="text-xs text-blue-700 mt-2 italic">{game.espnOdds.details}</div>
            )}
          </div>
        )}
      </Card.Body>

      <Card.Footer>
        <div className="flex gap-2">
          {game.canBet ? (
            <>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBettingModalOpen(true);
                }}
              >
                Place Bet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailsModalOpen(true);
                }}
              >
                <Info className="w-4 h-4" />
              </Button>
            </>
          ) : game.status === 'completed' ? (
            <>
              <Button variant="secondary" size="sm" className="flex-1" disabled>
                <Trophy className="w-4 h-4 mr-2" />
                Game Completed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailsModalOpen(true);
                }}
              >
                <Info className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="flex-1" disabled>
                Betting Closed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailsModalOpen(true);
                }}
              >
                <Info className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </Card.Footer>

      {/* Betting Modal */}
      <BettingModal
        game={game}
        isOpen={isBettingModalOpen}
        onClose={() => setIsBettingModalOpen(false)}
        onBetPlaced={(data) => {
          setIsBettingModalOpen(false);
          // Notify parent component if callback provided
          if (onPlaceBet) {
            onPlaceBet(data);
          }
        }}
      />

      {/* Game Details Modal */}
      <GameDetailsModal
        game={game}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </Card>
  );
});

EnhancedGameCard.displayName = 'EnhancedGameCard';

export default EnhancedGameCard;
