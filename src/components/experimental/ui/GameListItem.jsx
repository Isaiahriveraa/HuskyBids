/**
 * GameListItem - Game display component
 * Minimal game item with keyboard shortcut, teams, and scores
 * 
 * @example
 * <GameListItem 
 *   shortcut="G" 
 *   team1="Washington" 
 *   team2="Oregon" 
 *   score1={24} 
 *   score2={21} 
 *   live={true} 
 * />
 */
'use client';

import { ArrowRight, Circle } from '@phosphor-icons/react';
import Kbd from '../ui/Kbd';

export default function GameListItem({ 
  shortcut,
  team1,
  team2,
  score1,
  score2,
  time,
  live = false,
  onClick,
  className = '',
}) {
  return (
    <button 
      className={`w-full py-5 flex items-center justify-between group ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {shortcut && (
          <Kbd 
            size="md" 
            className="group-hover:border-zinc-600 group-hover:text-zinc-400"
          >
            {shortcut}
          </Kbd>
        )}
        {live && (
          <Circle size={6} weight="fill" className="text-red-500 animate-pulse" />
        )}
        <div className="text-left">
          <p className="text-sm">
            <span className="text-zinc-300">{team1}</span>
            <span className="text-zinc-700 mx-2">v</span>
            <span className="text-zinc-300">{team2}</span>
          </p>
          {live ? (
            <p className="text-xs text-zinc-600 mt-0.5">
              {score1} — {score2}
            </p>
          ) : (
            time && <p className="text-xs text-zinc-700 mt-0.5">{time}</p>
          )}
        </div>
      </div>
      <ArrowRight 
        size={14} 
        className="text-zinc-800 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all" 
      />
    </button>
  );
}
