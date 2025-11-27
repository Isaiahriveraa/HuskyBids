/**
 * LeaderboardRow - Minimal leaderboard entry
 * Simple numbered row with username, balance, and optional stats
 * 
 * @example
 * <LeaderboardRow rank={1} username="player1" balance={50000} />
 * <LeaderboardRow rank={2} username="player2" balance={42000} winRate={72} isCurrentUser />
 */
'use client';

import { cn } from '@/shared/utils';
import Kbd from './Kbd';

export default function LeaderboardRow({ 
  rank,
  username,
  balance,
  winRate,
  isCurrentUser = false,
  showShortcut = false,
  onClick,
  className = '',
}) {
  const formattedBalance = typeof balance === 'number' 
    ? balance.toLocaleString() 
    : balance;

  // Top 3 get subtle distinction
  const isTopThree = rank <= 3;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full py-4 px-4 flex items-center justify-between font-mono transition-colors',
        'hover:bg-zinc-900/50',
        isCurrentUser && 'bg-zinc-900/30 border-l-2 border-zinc-600',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        {showShortcut ? (
          <Kbd size="md" active={isTopThree}>{rank}</Kbd>
        ) : (
          <span className={cn(
            'w-8 text-left text-sm',
            isTopThree ? 'text-zinc-300' : 'text-zinc-600'
          )}>
            {rank}
          </span>
        )}
        
        {/* Username */}
        <span className={cn(
          'text-sm',
          isCurrentUser ? 'text-zinc-200' : 'text-zinc-400'
        )}>
          {username}
          {isCurrentUser && <span className="text-zinc-600 ml-2">(you)</span>}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Win Rate (optional) */}
        {winRate !== undefined && (
          <span className="text-xs text-zinc-600">
            {winRate}%
          </span>
        )}
        
        {/* Balance */}
        <span className={cn(
          'text-sm tabular-nums',
          isTopThree ? 'text-zinc-200' : 'text-zinc-400'
        )}>
          {formattedBalance}
        </span>
      </div>
    </button>
  );
}
