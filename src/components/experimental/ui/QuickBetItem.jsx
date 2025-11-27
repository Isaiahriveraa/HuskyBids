/**
 * QuickBetItem - Quick bet action button
 * Clickable bet option with keyboard shortcut and odds
 * 
 * @example
 * <QuickBetItem shortcut="1" label="UW ML" odds="+145" onClick={handleBet} />
 */
'use client';

import Kbd from '../ui/Kbd';

export default function QuickBetItem({ 
  shortcut,
  label,
  odds,
  onClick,
  className = '',
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between py-3 px-4 border border-dotted border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50 transition-all group ${className}`}
    >
      <div className="flex items-center gap-4">
        <Kbd 
          size="md" 
          className="group-hover:border-zinc-500 group-hover:text-zinc-300"
        >
          {shortcut}
        </Kbd>
        <span className="text-sm text-zinc-400 group-hover:text-white">
          {label}
        </span>
      </div>
      <span className="text-sm text-zinc-300">{odds}</span>
    </button>
  );
}
