'use client';

import { useState } from 'react';

// OPTION 5: "Minimal List" - Linear/Notion-inspired
// Ultra clean, text-focused, keyboard shortcuts, power-user feel

export default function ExperimentsPage() {
  const [filter, setFilter] = useState('all');
  const balance = 24500;

  const items = [
    { id: 1, type: 'live', teams: 'UW vs Oregon', score: '24-21', time: 'Q3 12:45', odds: '+145', tag: 'CFB' },
    { id: 2, type: 'live', teams: 'Kraken vs Knights', score: '2-2', time: 'OT', odds: '-110', tag: 'NHL' },
    { id: 3, type: 'upcoming', teams: 'Seahawks vs 49ers', score: null, time: 'Tomorrow 1:25p', odds: '+110', tag: 'NFL' },
    { id: 4, type: 'upcoming', teams: 'Lakers vs Celtics', score: null, time: 'Wed 5:00p', odds: '-105', tag: 'NBA' },
    { id: 5, type: 'bet', teams: 'UW Moneyline', result: 'won', amount: '+760', time: '12m ago', tag: null },
    { id: 6, type: 'bet', teams: 'Kraken Over 4.5', result: 'pending', amount: '200', time: 'active', tag: null },
    { id: 7, type: 'bet', teams: 'Lakers +4.5', result: 'lost', amount: '-320', time: '3h ago', tag: null },
  ];

  const filters = [
    { id: 'all', label: 'All', key: 'A' },
    { id: 'live', label: 'Live', key: 'L' },
    { id: 'upcoming', label: 'Upcoming', key: 'U' },
    { id: 'bet', label: 'My Bets', key: 'B' },
  ];

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  return (
    <div className="py-6 font-mono">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="text-sm text-white/40 uppercase tracking-widest">Balance</h1>
          <p className="text-3xl font-light tabular-nums">{balance.toLocaleString()}</p>
        </div>
        <button className="text-xs border border-white/20 px-3 py-1.5 rounded hover:bg-white/5 transition-colors">
          + New Bet
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-6 text-xs">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-2 ${
              filter === f.id 
                ? 'bg-white/10 text-white' 
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {f.label}
            <kbd className="text-[10px] bg-white/5 px-1 rounded">{f.key}</kbd>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="border-t border-white/10">
        {filtered.map((item, i) => (
          <div 
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer group"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Index */}
              <span className="text-xs text-white/20 w-4">{i + 1}</span>
              
              {/* Status indicator */}
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                item.type === 'live' ? 'bg-red-400' :
                item.type === 'upcoming' ? 'bg-white/20' :
                item.result === 'won' ? 'bg-green-400' :
                item.result === 'lost' ? 'bg-red-400' :
                'bg-amber-400'
              }`} />
              
              {/* Main content */}
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.teams}</p>
              </div>

              {/* Tag */}
              {item.tag && (
                <span className="text-[10px] text-white/30 uppercase">{item.tag}</span>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm">
              {/* Score or Amount */}
              {item.score ? (
                <span className="tabular-nums text-white/60">{item.score}</span>
              ) : item.amount ? (
                <span className={`tabular-nums ${
                  item.result === 'won' ? 'text-green-400' :
                  item.result === 'lost' ? 'text-red-400' :
                  'text-white/60'
                }`}>{item.amount}</span>
              ) : null}

              {/* Time */}
              <span className={`text-xs tabular-nums w-20 text-right ${
                item.type === 'live' ? 'text-red-400' : 'text-white/30'
              }`}>
                {item.time}
              </span>

              {/* Odds (for games) */}
              {item.odds && (
                <span className="text-xs text-green-400 w-12 text-right tabular-nums">
                  {item.odds}
                </span>
              )}

              {/* Action hint */}
              <span className="text-white/0 group-hover:text-white/20 transition-colors text-xs">
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="mt-8 text-xs text-white/20 flex items-center gap-4">
        <span><kbd className="bg-white/5 px-1 rounded">↑↓</kbd> navigate</span>
        <span><kbd className="bg-white/5 px-1 rounded">enter</kbd> select</span>
        <span><kbd className="bg-white/5 px-1 rounded">n</kbd> new bet</span>
      </div>
    </div>
  );
}
