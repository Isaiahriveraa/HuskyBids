/**
 * MinimalGameCard - Full game card with betting support
 * Accepts either individual props OR a game object from the API
 * 
 * @example
 * // With game object (from API)
 * <MinimalGameCard game={gameObj} onPlaceBet={() => handleBet(gameObj)} />
 * 
 * // With individual props
 * <MinimalGameCard 
 *   team1="Washington" 
 *   team2="Oregon" 
 *   homeOdds={2.1}
 *   awayOdds={1.8}
 *   status="live"
 *   score1={24}
 *   score2={21}
 *   onBet={(team) => handleBet(team)}
 * />
 */
'use client';

import { cn } from '@/shared/utils';
import { formatDate, formatTime } from '@shared/utils/date-utils';
import { Basketball, Football, MapPin } from '@phosphor-icons/react';
import Kbd from './Kbd';

const statusLabels = {
  scheduled: '',
  live: 'LIVE',
  completed: 'FINAL',
  cancelled: 'CANCELLED',
  postponed: 'POSTPONED',
};

export default function MinimalGameCard({
  // Game object from API
  game,
  onPlaceBet,
  // Individual props (alternative to game object)
  team1,
  team2,
  score1,
  score2,
  homeOdds,
  awayOdds,
  status = 'scheduled',
  time,
  date,
  shortcut,
  winner, // 'home' | 'away' | null
  onBet,
  onClick,
  selected = false,
  className = '',
}) {
  // Extract data from game object if provided
  const displayTeam1 = team1 || game?.homeTeam || 'Home Team';
  const displayTeam2 = team2 || game?.awayTeam || game?.opponent || 'Away Team';
  const displayScore1 = score1 ?? game?.homeScore ?? null;
  const displayScore2 = score2 ?? game?.awayScore ?? null;
  const displayHomeOdds = homeOdds ?? game?.homeOdds;
  const displayAwayOdds = awayOdds ?? game?.awayOdds;
  const displayStatus = status || game?.status || 'scheduled';
  const displayWinner = winner || (game?.winner === 'home' ? 'home' : game?.winner === 'away' ? 'away' : null);
  
  // Format date/time from game object
  const displayDate = date || (game?.gameDate ? formatDate(game.gameDate, { includeWeekday: true }) : null);
  const displayTime = time || (game?.gameDate ? formatTime(game.gameDate) : null);
  
  const isLive = displayStatus === 'live';
  const isCompleted = displayStatus === 'completed';
  const canBet = game?.canBet ?? (displayStatus === 'scheduled' || displayStatus === 'live');

  // Handle betting click
  const handleBetClick = (team) => {
    if (onPlaceBet) {
      onPlaceBet(game);
    } else if (onBet) {
      onBet(team);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'py-5 px-4 border border-dotted font-mono',
        'hover:border-zinc-700 transition-colors',
        selected ? 'border-zinc-600 bg-zinc-900/50' : 'border-zinc-800',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Header: Status + Date/Time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {shortcut && <Kbd size="sm">{shortcut}</Kbd>}
          {isLive && (
            <span className="text-[10px] text-red-500 uppercase tracking-wider animate-pulse">
              {statusLabels.live}
            </span>
          )}
          {isCompleted && (
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
              {statusLabels.completed}
            </span>
          )}
          {game?.sport && (
            <span>
              {game.sport === 'football' ? (
                <Football size={14} weight="fill" className="text-amber-800" />
              ) : (
                <Basketball size={14} weight="fill" className="text-orange-500" />
              )}
            </span>
          )}
        </div>
        {(displayDate || displayTime) && (
          <span className="text-[10px] text-zinc-700">
            {displayDate && <span>{displayDate}</span>}
            {displayDate && displayTime && <span className="mx-1">·</span>}
            {displayTime && <span>{displayTime}</span>}
          </span>
        )}
      </div>

      {/* Teams & Scores */}
      <div className="space-y-2 mb-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-sm',
            displayWinner === 'home' ? 'text-zinc-200' : 'text-zinc-400',
            displayTeam1.includes('Washington') && 'text-purple-400'
          )}>
            {displayTeam1}
          </span>
          {(isLive || isCompleted) && displayScore1 !== null && (
            <span className={cn(
              'text-lg tabular-nums font-bold',
              displayWinner === 'home' ? 'text-zinc-200' : 'text-zinc-500'
            )}>
              {displayScore1}
            </span>
          )}
        </div>
        
        {/* Away Team */}
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-sm',
            displayWinner === 'away' ? 'text-zinc-200' : 'text-zinc-400',
            displayTeam2.includes('Washington') && 'text-purple-400'
          )}>
            {displayTeam2}
          </span>
          {(isLive || isCompleted) && displayScore2 !== null && (
            <span className={cn(
              'text-lg tabular-nums font-bold',
              displayWinner === 'away' ? 'text-zinc-200' : 'text-zinc-500'
            )}>
              {displayScore2}
            </span>
          )}
        </div>
      </div>

      {/* Location */}
      {game?.location && (
        <div className="text-[10px] text-zinc-700 mb-3 truncate flex items-center gap-1">
          <MapPin size={12} weight="bold" />
          {game.location}
        </div>
      )}

      {/* Odds & Bet Buttons - only show if not in selection mode */}
      {canBet && displayHomeOdds && displayAwayOdds && !onClick && (
        <div className="flex gap-2 pt-3 border-t border-dotted border-zinc-900">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBetClick('home');
            }}
            className="flex-1 py-2 text-xs text-zinc-500 border border-dotted border-zinc-800 hover:border-zinc-600 hover:text-white transition-colors"
          >
            {displayTeam1.split(' ').pop()} <span className="text-zinc-600 ml-1">{displayHomeOdds.toFixed(2)}x</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBetClick('away');
            }}
            className="flex-1 py-2 text-xs text-zinc-500 border border-dotted border-zinc-800 hover:border-zinc-600 hover:text-white transition-colors"
          >
            {displayTeam2.split(' ').pop()} <span className="text-zinc-600 ml-1">{displayAwayOdds.toFixed(2)}x</span>
          </button>
        </div>
      )}

      {/* Odds display in selection mode */}
      {canBet && displayHomeOdds && displayAwayOdds && onClick && (
        <div className="flex gap-2 pt-3 border-t border-dotted border-zinc-900 justify-between text-xs text-zinc-600">
          <span>{displayTeam1.split(' ').pop()} {displayHomeOdds.toFixed(2)}x</span>
          <span>{displayTeam2.split(' ').pop()} {displayAwayOdds.toFixed(2)}x</span>
        </div>
      )}

      {/* Completed game - no bet buttons, show final result */}
      {isCompleted && (
        <div className="pt-3 border-t border-dotted border-zinc-900 text-center">
          <span className={cn(
            'text-[10px] uppercase tracking-wider',
            displayWinner === 'home' && displayTeam1.includes('Washington') && 'text-green-500',
            displayWinner === 'away' && displayTeam2.includes('Washington') && 'text-green-500',
            displayWinner === 'home' && !displayTeam1.includes('Washington') && 'text-red-500',
            displayWinner === 'away' && !displayTeam2.includes('Washington') && 'text-red-500',
            !displayWinner && 'text-zinc-600'
          )}>
            {displayWinner === 'home' && displayTeam1.includes('Washington') && '🎉 UW WIN'}
            {displayWinner === 'away' && displayTeam2.includes('Washington') && '🎉 UW WIN'}
            {displayWinner === 'home' && !displayTeam1.includes('Washington') && '💔 UW LOSS'}
            {displayWinner === 'away' && !displayTeam2.includes('Washington') && '💔 UW LOSS'}
            {!displayWinner && 'FINAL'}
          </span>
        </div>
      )}

      {/* Betting stats */}
      {game?.totalBetsPlaced > 0 && (
        <div className="mt-3 pt-3 border-t border-dotted border-zinc-900 flex justify-between text-[10px] text-zinc-700">
          <span>{game.totalBetsPlaced} bets</span>
          <span>{(game.totalBiscuitsWagered || 0).toLocaleString()} pts wagered</span>
        </div>
      )}
    </div>
  );
}
