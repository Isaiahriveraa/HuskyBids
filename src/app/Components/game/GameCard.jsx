'use client';

import React, { useState, memo } from 'react';
import { Card, Button, Badge } from '../ui';
import { Calendar, MapPin, Clock, Trophy, TrendingUp, Info, Users } from 'lucide-react';
import { getTeamPositions, getStatusBadgeVariant } from '../../../../lib/utils/game-utils';
import { formatDate, formatTime, getDaysUntil } from '@/lib/date-utils';
import TeamDisplay from './TeamDisplay';
import OddsDisplay from './OddsDisplay';
import PlayerStat from './PlayerStat';
import BettingModal from '../BettingModal';
import GameDetailsModal from '../GameDetailsModal';
import BiscuitIcon from '../BiscuitIcon';
import PlayerStatCard from './PlayerStatCard';
import PlaceholderCard from './PlaceholderCard';
import EmptyStateMessage from './EmptyStateMessage';

/**
 * Unified Game Card Component
 * @param {Object} props
 * @param {Object} props.game - Game object
 * @param {string} props.variant - Card variant ('upcoming', 'completed', 'live')
 * @param {Function} props.onPlaceBet - Callback when bet is placed
 * @param {Function} props.onClick - Callback when card is clicked
 * @param {boolean} props.selected - Whether card is selected
 * @param {boolean} props.showOdds - Whether to show odds
 * @param {boolean} props.showStats - Whether to show betting stats
 */
const GameCard = memo(({
  game,
  variant = 'upcoming',
  onPlaceBet,
  onClick,
  selected = false,
  showOdds = true,
  showStats = true,
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);

  const { isUWHome, uwTeam, opponentTeam } = getTeamPositions(game);

  const uwScore = isUWHome ? game.homeScore : game.awayScore;
  const opponentScore = isUWHome ? game.awayScore : game.homeScore;
  const uwOdds = isUWHome ? game.homeOdds : game.awayOdds;
  const opponentOdds = isUWHome ? game.awayOdds : game.homeOdds;

  // Determine winner for completed games
  const isUWWinner = variant === 'completed' && game.winner === uwTeam;
  const isUWLoser = variant === 'completed' && game.winner !== 'tie' && game.winner !== uwTeam;

  // For completed games, use simple layout
  if (variant === 'completed') {
    return (
      <div
        onClick={onClick}
        className={`
          rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer
          border-2 ${isUWWinner ? 'border-green-400 hover:border-green-500' : isUWLoser ? 'border-red-400 hover:border-red-500' : 'border-gray-200 hover:border-purple-400'}
          overflow-hidden flex flex-col
          dark:bg-gray-800 dark:border-gray-700
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
        <div className="p-4 bg-white dark:bg-gray-800 flex-1 rounded-b-lg">
          <TeamDisplay
            teamName={game.homeTeam}
            teamLogo={game.homeTeamLogo}
            score={game.homeScore}
            isUW={isUWHome}
            isWinner={game.homeScore > game.awayScore}
            variant="compact"
            showScore={true}
          />

          <div className="my-2" />

          <TeamDisplay
            teamName={game.awayTeam}
            teamLogo={game.awayTeamLogo}
            score={game.awayScore}
            isUW={!isUWHome}
            isWinner={game.awayScore > game.homeScore}
            variant="compact"
            showScore={true}
          />

          {/* Top Players Section - Always show for consistent card heights */}
          <div className="mt-4 pt-4 border-t-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">TOP PERFORMERS</span>
            </div>

            {(game.uwTopPlayer || game.opponentTopPlayer) ? (
              <div className="grid grid-cols-2 gap-2">
                {/* UW Top Player or Placeholder */}
                {game.uwTopPlayer ? (
                  <PlayerStatCard player={game.uwTopPlayer} isUW={true} />
                ) : (
                  <PlaceholderCard isUW={true} team="UW" />
                )}

                {/* Opponent Top Player or Placeholder */}
                {game.opponentTopPlayer ? (
                  <PlayerStatCard
                    player={game.opponentTopPlayer}
                    isUW={false}
                    opponentAbbrev={game.opponent?.substring(0, 3).toUpperCase() || 'OPP'}
                  />
                ) : (
                  <PlaceholderCard isUW={false} team="Opponent" />
                )}
              </div>
            ) : (
              <EmptyStateMessage message="Player stats unavailable for this game" />
            )}
          </div>

          {/* Betting Stats */}
          {showStats && (
            <div className="mt-4 pt-4 border-t-2 border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3 text-center">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Bets</div>
                <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{game.totalBetsPlaced || 0}</div>
              </div>
              <div className="bg-gold-50 dark:bg-yellow-900/20 rounded p-2">
                <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
                <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Total Wagered</div>
                <div className="text-lg font-bold text-yellow-900 dark:text-yellow-100">{(game.totalBiscuitsWagered || 0).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Game Date and Location */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
            <div className="font-medium">{game.formattedDate}</div>
            {game.location && <div className="mt-1">{game.location}</div>}
          </div>
        </div>
      </div>
    );
  }

  // For upcoming/live games, use enhanced layout with Card component
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
        {/* Team Matchup */}
        <div className="mb-4">
          <TeamDisplay
            teamName="Washington Huskies"
            teamLogo={game.uwLogo}
            topPlayer={game.uwTopPlayer}
            isUW={true}
            variant="full"
          />

          <div className="text-center text-sm text-gray-400 dark:text-gray-500 font-semibold my-2">VS</div>

          <TeamDisplay
            teamName={game.opponent}
            teamLogo={game.opponentLogo}
            topPlayer={game.opponentTopPlayer}
            isUW={false}
            variant="full"
          />
        </div>

        {/* Game Details */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-uw-purple-500 dark:text-uw-purple-400" />
            <span>{formatDate(game.gameDate, { includeWeekday: true, capitalize: true })}</span>
            <Badge variant="gold" size="sm">
              {getDaysUntil(game.gameDate)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-uw-purple-500 dark:text-uw-purple-400" />
            <span>{formatTime(game.gameDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-uw-purple-500 dark:text-uw-purple-400" />
            <span className="truncate">{game.location}</span>
          </div>
        </div>

        {/* Betting Odds */}
        {showOdds && game.canBet && (uwOdds || opponentOdds) && (
          <OddsDisplay
            uwOdds={uwOdds}
            opponentOdds={opponentOdds}
            opponentName={game.opponent}
            totalBets={game.totalBetsPlaced}
            totalWagered={game.totalBiscuitsWagered}
            showStats={showStats}
          />
        )}

        {/* ESPN Real Odds */}
        {game.espnOdds && (game.espnOdds.spread || game.espnOdds.overUnder) && (
          <div className="mt-3 pt-3 border-t bg-blue-50 dark:bg-blue-900/20 -mx-4 -mb-4 p-4 rounded-b-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <div className="text-xs font-semibold text-blue-900 dark:text-blue-100">ESPN Real Odds</div>
              {game.espnOdds.provider && (
                <Badge variant="outline" size="sm" className="text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                  {game.espnOdds.provider}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {game.espnOdds.spread && (
                <div className="bg-white dark:bg-gray-800 p-2 rounded">
                  <div className="text-gray-600 dark:text-gray-400">Spread</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{game.espnOdds.spread}</div>
                </div>
              )}
              {game.espnOdds.overUnder && (
                <div className="bg-white dark:bg-gray-800 p-2 rounded">
                  <div className="text-gray-600 dark:text-gray-400">O/U</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{game.espnOdds.overUnder}</div>
                </div>
              )}
              {game.espnOdds.homeMoneyLine && (
                <div className="bg-white dark:bg-gray-800 p-2 rounded">
                  <div className="text-gray-600 dark:text-gray-400">Home ML</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {game.espnOdds.homeMoneyLine > 0 ? '+' : ''}{game.espnOdds.homeMoneyLine}
                  </div>
                </div>
              )}
              {game.espnOdds.awayMoneyLine && (
                <div className="bg-white dark:bg-gray-800 p-2 rounded">
                  <div className="text-gray-600 dark:text-gray-400">Away ML</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {game.espnOdds.awayMoneyLine > 0 ? '+' : ''}{game.espnOdds.awayMoneyLine}
                  </div>
                </div>
              )}
            </div>
            {game.espnOdds.details && (
              <div className="text-xs text-blue-700 dark:text-blue-300 mt-2 italic">{game.espnOdds.details}</div>
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

GameCard.displayName = 'GameCard';

export default GameCard;
