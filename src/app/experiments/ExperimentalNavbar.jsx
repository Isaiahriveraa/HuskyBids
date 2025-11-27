'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Minimal text-based nav to match Option 5
const navItems = [
  { label: 'Home', href: '/experiments', key: 'H' },
  { label: 'Games', href: '/experiments/games', key: 'G' },
  { label: 'Bet', href: '/experiments/new-bet', key: 'N', isMain: true },
  { label: 'Ranks', href: '/experiments/leaderboard', key: 'R' },
  { label: 'History', href: '/experiments/history', key: 'Y' },
];

export default function ExperimentalNavbar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-white/10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around py-3 font-mono text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.isMain) {
              return (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 border border-white/30 rounded hover:bg-white/5 transition-colors"
                >
                  + New
                </Link>
              );
            }
            
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1.5 py-2 px-2 transition-colors ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <span>{item.label}</span>
                <kbd className="text-[9px] bg-white/5 px-1 rounded">{item.key}</kbd>
              </Link>
            );
          })}
        </div>
        <div className="h-safe-area-inset-bottom" />
      </div>
    </nav>
  );
}
