'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Combined: Ultra Minimal + Notion - text with keyboard hints
const navItems = [
  { key: 'H', label: 'Home', href: '/experiments' },
  { key: 'G', label: 'Games', href: '/experiments/games' },
  { key: 'N', label: 'Bet', href: '/experiments/new-bet', isMain: true },
  { key: 'L', label: 'Rank', href: '/experiments/leaderboard' },
  { key: 'B', label: 'Bets', href: '/experiments/history' },
];

export default function ExperimentalNavbar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-dotted border-zinc-800 font-mono">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.isMain) {
              return (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 border border-dotted border-zinc-600 hover:border-zinc-400 transition-colors"
                >
                  <kbd className="text-[9px] text-zinc-500">{item.key}</kbd>
                  <span className="text-xs text-zinc-300">+ Bet</span>
                </Link>
              );
            }
            
            return (
              <Link 
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1.5 py-1"
              >
                <kbd className={`w-5 h-5 flex items-center justify-center text-[9px] border transition-colors ${
                  isActive 
                    ? 'border-zinc-500 text-zinc-300' 
                    : 'border-zinc-800 text-zinc-700'
                }`}>
                  {item.key}
                </kbd>
                <span className={`text-[9px] uppercase tracking-wider transition-colors ${
                  isActive ? 'text-zinc-400' : 'text-zinc-700'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="h-safe-area-inset-bottom" />
      </div>
    </nav>
  );
}
