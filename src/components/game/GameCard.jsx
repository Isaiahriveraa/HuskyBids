'use client';

import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Badge } from '../ui';
import { Calendar, MapPin, Clock, Trophy, TrendingUp, Info, Users, Zap, Radio } from 'lucide-react';
import { getTeamPositions, getStatusBadgeVariant } from '@shared/utils/game-utils';
import { formatDate, formatTime, getDaysUntil } from '@shared/utils/date-utils';
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
 * Supports three variants: 'upcoming', 'completed', and 'live'
 *
 * @param {Object} props
 * @param {Object} props.game - Game object containing all game data
 * @param {string} props.variant - Card variant ('upcoming', 'completed', 'live')
 * @param {Function} props.onPlaceBet - Callback when bet is placed
 * @param {Function} props.onClick - Callback when card is clicked
 * @param {boolean} props.selected - Whether card is selected
 * @param {boolean} props.showOdds - Whether to show odds
 * @param {boolean} props.showStats - Whether to show betting stats
 * @param {boolean} props.isLoading - Whether the card is in loading state
 */
const GameCard = memo(({
  game,
  variant = 'upcoming',
  onPlaceBet,
  onClick,
  selected = false,
  showOdds = true,
  showStats = true,
  isLoading = false,
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);

  // Loading skeleton state
  if (isLoading) {
    return <GameCardSkeleton />;
  }

  // Guard against missing game data
  if (!game) {
    return null;
  }

  const { isUWHome, uwTeam, opponentTeam } = getTeamPositions(game);

  const uwScore = isUWHome ? game.homeScore : game.awayScore;
  const opponentScore = isUWHome ? game.awayScore : game.homeScore;
  const uwOdds = isUWHome ? game.homeOdds : game.awayOdds;
  const opponentOdds = isUWHome ? game.awayOdds : game.homeOdds;

  // Determine winner for completed games
  const isUWWinner = variant === 'completed' && game.winner === uwTeam;
  const isUWLoser = variant === 'completed' && game.winner !== 'tie' && game.winner !== uwTeam;

  // Handle live game variant
  if (variant === 'live') {
    return (
      <LiveGameCard
        game={game}
        onClick={onClick}
        selected={selected}
        showOdds={showOdds}
        showStats={showStats}
        onPlaceBet={onPlaceBet}
        uwScore={uwScore}
        opponentScore={opponentScore}
        uwOdds={uwOdds}
        opponentOdds={opponentOdds}
        isUWHome={isUWHome}
      />
    );
  }

  // For completed games, use simple layout
  if (variant === 'completed') {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`Completed game: ${game.homeTeam} ${game.homeScore} - ${game.awayTeam} ${game.awayScore}. ${
          isUWWinner ? 'UW won' : isUWLoser ? 'UW lost' : 'Game tied'
        }`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
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

            {(game.uwTopPlayer?.name || game.opponentTopPlayer?.name) ? (
              <div className="grid grid-cols-2 gap-2">
                {/* UW Top Player or Placeholder */}
                {game.uwTopPlayer?.name ? (
                  <PlayerStatCard player={game.uwTopPlayer} isUW={true} />
                ) : (
                  <PlaceholderCard isUW={true} team="UW" />
                )}

                {/* Opponent Top Player or Placeholder */}
                {game.opponentTopPlayer?.name ? (
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

// PropTypes for type checking
GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    homeTeam: PropTypes.string,
    awayTeam: PropTypes.string,
    homeScore: PropTypes.number,
    awayScore: PropTypes.number,
    homeOdds: PropTypes.number,
    awayOdds: PropTypes.number,
    homeTeamLogo: PropTypes.string,
    awayTeamLogo: PropTypes.string,
    status: PropTypes.oneOf(['scheduled', 'live', 'completed', 'cancelled', 'postponed']),
    gameDate: PropTypes.string,
    location: PropTypes.string,
    sport: PropTypes.oneOf(['football', 'basketball']),
    canBet: PropTypes.bool,
    winner: PropTypes.string,
    week: PropTypes.number,
    totalBetsPlaced: PropTypes.number,
    totalBiscuitsWagered: PropTypes.number,
    uwTopPlayer: PropTypes.object,
    opponentTopPlayer: PropTypes.object,
    espnOdds: PropTypes.object,
  }),
  variant: PropTypes.oneOf(['upcoming', 'completed', 'live']),
  onPlaceBet: PropTypes.func,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  showOdds: PropTypes.bool,
  showStats: PropTypes.bool,
  isLoading: PropTypes.bool,
};

/**
 * Skeleton loading state for GameCard
 */
const GameCardSkeleton = () => (
  <div
    className="rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse"
    role="status"
    aria-label="Loading game card"
  >
    {/* Header skeleton */}
    <div className="p-3 bg-gray-200 dark:bg-gray-700">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto" />
    </div>

    {/* Body skeleton */}
    <div className="p-4 bg-white dark:bg-gray-800 space-y-4">
      {/* Team 1 */}
      <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-1/2" />
        </div>
      </div>

      {/* VS text */}
      <div className="text-center">
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-8 mx-auto" />
      </div>

      {/* Team 2 */}
      <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-1/2" />
        </div>
      </div>

      {/* Game info skeleton */}
      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
      </div>

      {/* Button skeleton */}
      <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-lg" />
    </div>
  </div>
);

/**
 * Live Game Card Component
 * Specialized layout for games currently in progress
 */
const LiveGameCard = memo(({
  game,
  onClick,
  selected,
  showOdds,
  showStats,
  onPlaceBet,
  uwScore,
  opponentScore,
  uwOdds,
  opponentOdds,
  isUWHome,
}) => {
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Live game: ${game.homeTeam} vs ${game.awayTeam}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
        border-2 border-red-400 hover:border-red-500
        overflow-hidden flex flex-col
        dark:bg-gray-800 dark:border-red-500
        ${selected ? 'ring-2 ring-red-500 shadow-xl' : ''}
      `}
    >
      {/* Live Header with pulsing indicator */}
      <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <Zap className="w-4 h-4" />
        <span className="font-bold text-sm uppercase tracking-wider">Live Now</span>
        {game.period && (
          <Badge variant="outline" size="sm" className="text-white border-white/50 ml-2">
            {game.period}
          </Badge>
        )}
      </div>

      {/* Score Display */}
      <div className="p-4 bg-white dark:bg-gray-800 flex-1">
        {/* UW Team with Score */}
        <div className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
          isUWHome ? 'bg-uw-purple-50 dark:bg-uw-purple-900/20' : 'bg-gray-50 dark:bg-gray-700'
        }`}>
          <TeamDisplay
            teamName={game.homeTeam}
            teamLogo={game.homeTeamLogo}
            isUW={isUWHome}
            variant="compact"
            showScore={false}
          />
          <div className={`text-4xl font-black ${
            game.homeScore > game.awayScore
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {game.homeScore ?? 0}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center my-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
          <Radio className="w-4 h-4 mx-2 text-red-500" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        </div>

        {/* Opponent Team with Score */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          !isUWHome ? 'bg-uw-purple-50 dark:bg-uw-purple-900/20' : 'bg-gray-50 dark:bg-gray-700'
        }`}>
          <TeamDisplay
            teamName={game.awayTeam}
            teamLogo={game.awayTeamLogo}
            isUW={!isUWHome}
            variant="compact"
            showScore={false}
          />
          <div className={`text-4xl font-black ${
            game.awayScore > game.homeScore
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {game.awayScore ?? 0}
          </div>
        </div>

        {/* Game Clock / Quarter Info */}
        {(game.clock || game.quarter) && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-full">
              <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-bold text-red-700 dark:text-red-300">
                {game.quarter && `Q${game.quarter}`}
                {game.quarter && game.clock && ' • '}
                {game.clock}
              </span>
            </div>
          </div>
        )}

        {/* Live Betting Stats */}
        {showStats && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-3 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
              <Users className="w-4 h-4 text-red-600 dark:text-red-400 mx-auto mb-1" />
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">Active Bets</div>
              <div className="text-lg font-bold text-red-900 dark:text-red-100">{game.totalBetsPlaced || 0}</div>
            </div>
            <div className="bg-gold-50 dark:bg-yellow-900/20 rounded p-2">
              <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
              <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Wagered</div>
              <div className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                {(game.totalBiscuitsWagered || 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Live Odds Display */}
        {showOdds && game.canBet && (uwOdds || opponentOdds) && (
          <OddsDisplay
            uwOdds={uwOdds}
            opponentOdds={opponentOdds}
            opponentName={game.opponent || game.awayTeam}
            totalBets={game.totalBetsPlaced}
            totalWagered={game.totalBiscuitsWagered}
            showStats={false}
          />
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {game.canBet ? (
            <>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBettingModalOpen(true);
                }}
              >
                <Zap className="w-4 h-4 mr-1" />
                Live Bet
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
            <Button variant="ghost" size="sm" className="flex-1" disabled>
              Betting Closed
            </Button>
          )}
        </div>

        {/* Location */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" />
            {game.location || 'Location TBA'}
          </div>
        </div>
      </div>

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
    </div>
  );
});

LiveGameCard.displayName = 'LiveGameCard';

export default GameCard;
