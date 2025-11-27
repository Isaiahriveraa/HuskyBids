'use client';

import Link from 'next/link';
import ExperimentalNavbar from './ExperimentalNavbar';
import { usePathname } from 'next/navigation';

// Option 5: Minimal/Linear-inspired layout
const sidebarItems = [
  { label: 'Home', href: '/experiments', key: 'H' },
  { label: 'Games', href: '/experiments/games', key: 'G' },
  { label: 'Leaderboard', href: '/experiments/leaderboard', key: 'R' },
  { label: 'History', href: '/experiments/history', key: 'Y' },
  { label: 'Settings', href: '/experiments/settings', key: 'S' },
];

export default function ExperimentalLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      {/* Desktop Sidebar - minimal */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-56 lg:border-r lg:border-white/10">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-sm uppercase tracking-widest text-white/50">HuskyBids</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between py-2 px-2 text-sm transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span>{item.label}</span>
                <kbd className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded">{item.key}</kbd>
              </Link>
            );
          })}
        </nav>

        {/* New Bet */}
        <div className="p-4">
          <Link 
            href="/experiments/new-bet"
            className="flex items-center justify-center w-full border border-white/20 text-sm py-2.5 rounded hover:bg-white/5 transition-colors"
          >
            + New Bet
          </Link>
        </div>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/60">@username</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-56">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-zinc-950 border-b border-white/10 lg:hidden">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-sm uppercase tracking-widest text-white/50">HuskyBids</h1>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <button className="hover:text-white transition-colors">⌘K</button>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-40 bg-zinc-950 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-8 py-3 flex items-center justify-between">
            {/* Search */}
            <div className="flex items-center gap-2 text-sm text-white/30">
              <span>⌘</span>
              <span>K to search</span>
            </div>
            
            {/* Status */}
            <div className="text-xs text-white/30">
              2 live · 5 upcoming
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg lg:max-w-2xl mx-auto px-4 lg:px-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <ExperimentalNavbar />
    </div>
  );
}
