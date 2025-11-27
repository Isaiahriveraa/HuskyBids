'use client';

import { ArrowRight, Circle } from '@phosphor-icons/react';

// COMBINED: Ultra Minimal + Notion
// Dotted borders, monospace, keyboard shortcuts, extreme whitespace

export default function ExperimentsPage() {
  const balance = 24500;

  const games = [
    { id: 1, key: 'G', team1: 'Washington', team2: 'Oregon', score1: 24, score2: 21, live: true },
    { id: 2, key: 'H', team1: 'Kraken', team2: 'Knights', score1: 2, score2: 2, live: true },
    { id: 3, key: 'J', team1: 'Seahawks', team2: '49ers', time: '7:00 PM', live: false },
  ];

  const quickBets = [
    { id: 1, key: '1', label: 'UW ML', odds: '+145' },
    { id: 2, key: '2', label: 'SEA -3.5', odds: '+110' },
    { id: 3, key: '3', label: 'Over 47.5', odds: '-110' },
  ];

  return (
    <div className="py-8 space-y-10 font-mono">
      {/* Balance */}
      <div>
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] mb-2">Balance</p>
        <p className="text-4xl font-light tracking-tight">{balance.toLocaleString()}</p>
      </div>

      {/* Dotted divider */}
      <div className="border-t border-dotted border-zinc-800" />

      {/* Quick bets with keyboard shortcuts */}
      <div>
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] mb-4">Quick bets</p>
        <div className="space-y-2">
          {quickBets.map((bet) => (
            <button
              key={bet.id}
              className="w-full flex items-center justify-between py-3 px-4 border border-dotted border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <kbd className="w-6 h-6 flex items-center justify-center text-[10px] border border-zinc-700 text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-300">
                  {bet.key}
                </kbd>
                <span className="text-sm text-zinc-400 group-hover:text-white">{bet.label}</span>
              </div>
              <span className="text-sm text-zinc-300">{bet.odds}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dotted divider */}
      <div className="border-t border-dotted border-zinc-800" />

      {/* Games list with keyboard hints */}
      <div>
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] mb-4">Games</p>
        <div className="space-y-0">
          {games.map((game, i) => (
            <div key={game.id}>
              <button className="w-full py-5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <kbd className="w-6 h-6 flex items-center justify-center text-[10px] border border-zinc-800 text-zinc-600 group-hover:border-zinc-600 group-hover:text-zinc-400">
                    {game.key}
                  </kbd>
                  {game.live && (
                    <Circle size={6} weight="fill" className="text-red-500 animate-pulse" />
                  )}
                  <div className="text-left">
                    <p className="text-sm">
                      <span className="text-zinc-300">{game.team1}</span>
                      <span className="text-zinc-700 mx-2">v</span>
                      <span className="text-zinc-300">{game.team2}</span>
                    </p>
                    {game.live ? (
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {game.score1} — {game.score2}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-700 mt-0.5">{game.time}</p>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-800 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all" />
              </button>
              {i < games.length - 1 && (
                <div className="border-t border-dotted border-zinc-900" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dotted divider */}
      <div className="border-t border-dotted border-zinc-800" />

      {/* Minimal actions */}
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center gap-6">
          <span><kbd className="px-1.5 py-0.5 border border-zinc-800 mr-2">A</kbd>All games</span>
          <span><kbd className="px-1.5 py-0.5 border border-zinc-800 mr-2">N</kbd>New bet</span>
        </div>
        <span className="text-zinc-700"><kbd className="px-1.5 py-0.5 border border-zinc-800 mr-2">?</kbd>Help</span>
      </div>
    </div>
  );
}



