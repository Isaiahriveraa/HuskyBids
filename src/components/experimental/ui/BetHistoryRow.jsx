/**
 * BetHistoryRow - Minimal bet history entry
 * Displays bet details with status indicator
 * 
 * @example
 * <BetHistoryRow 
 *   game="Washington vs Oregon" 
 *   prediction="Washington" 
 *   amount={100} 
 *   odds={2.5} 
 *   status="won" 
 *   payout={250}
 * />
 */
'use client';

import { cn } from '@/shared/utils';

const statusLabels = {
  pending: 'PENDING',
  won: 'WON',
  lost: 'LOST',
  cancelled: 'CANCELLED',
  refunded: 'REFUND',
};

const statusColors = {
  pending: 'text-zinc-500',
  won: 'text-zinc-300',
  lost: 'text-zinc-600',
  cancelled: 'text-zinc-700',
  refunded: 'text-zinc-500',
};

export default function BetHistoryRow({ 
  game,
  prediction,
  amount,
  odds,
  status = 'pending',
  payout,
  date,
  onClick,
  className = '',
}) {
  const formattedAmount = typeof amount === 'number' 
    ? amount.toLocaleString() 
    : amount;
  
  const formattedPayout = typeof payout === 'number' 
    ? payout.toLocaleString() 
    : payout;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full py-4 px-4 flex items-center justify-between font-mono transition-colors',
        'border-b border-dotted border-zinc-900',
        'hover:bg-zinc-900/30',
        className
      )}
    >
      <div className="flex-1 text-left">
        {/* Game */}
        <p className="text-sm text-zinc-300">{game}</p>
        
        {/* Prediction & odds */}
        <p className="text-xs text-zinc-600 mt-0.5">
          {prediction} @ {odds}x
        </p>
        
        {/* Date (optional) */}
        {date && (
          <p className="text-[10px] text-zinc-700 mt-1">{date}</p>
        )}
      </div>

      <div className="flex items-center gap-6 text-right">
        {/* Amount wagered */}
        <div>
          <p className="text-sm text-zinc-400 tabular-nums">{formattedAmount}</p>
          {status === 'won' && payout && (
            <p className="text-xs text-zinc-500 tabular-nums">+{formattedPayout}</p>
          )}
        </div>
        
        {/* Status */}
        <span className={cn(
          'text-[10px] uppercase tracking-wider w-16',
          statusColors[status]
        )}>
          {statusLabels[status]}
        </span>
      </div>
    </button>
  );
}
