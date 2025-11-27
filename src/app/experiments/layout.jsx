'use client';

import Link from 'next/link';
import ExperimentalNavbar from './ExperimentalNavbar';
import { usePathname } from 'next/navigation';

// Combined: Ultra Minimal + Notion style
const sidebarItems = [
  { key: 'H', label: 'Home', href: '/experiments' },
  { key: 'G', label: 'Games', href: '/experiments/games' },
  { key: 'L', label: 'Leaderboard', href: '/experiments/leaderboard' },
  { key: 'B', label: 'My Bets', href: '/experiments/history' },
];

export default function ExperimentalLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-52 lg:border-r lg:border-dotted lg:border-zinc-800">
        {/* Logo */}
        <div className="p-6 border-b border-dotted border-zinc-800">
          <h1 className="text-xs tracking-[0.3em] uppercase text-zinc-400">HuskyBids</h1>
        </div>
        
        {/* Navigation with keyboard hints */}
        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 py-3 px-6 transition-colors ${
                  isActive 
                    ? 'text-white bg-zinc-900/50' 
                    : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/30'
                }`}
              >
                <kbd className={`w-5 h-5 flex items-center justify-center text-[9px] border ${
                  isActive ? 'border-zinc-600 text-zinc-400' : 'border-zinc-800 text-zinc-700'
                }`}>
                  {item.key}
                </kbd>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* New Bet shortcut */}
        <div className="p-4 border-t border-dotted border-zinc-800">
          <Link 
            href="/experiments/new-bet"
            className="flex items-center justify-center gap-2 w-full py-3 border border-dotted border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50 transition-all text-sm text-zinc-400 hover:text-white"
          >
            <kbd className="px-1.5 py-0.5 text-[9px] border border-zinc-700">N</kbd>
            <span>New bet</span>
          </Link>
        </div>

        {/* User - minimal */}
        <div className="p-6 border-t border-dotted border-zinc-800">
          <p className="text-[10px] text-zinc-700 uppercase tracking-wider">Signed in</p>
          <p className="text-sm text-zinc-400 mt-1">user</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-52">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-dotted border-zinc-800 lg:hidden">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xs tracking-[0.3em] uppercase text-zinc-400">HuskyBids</h1>
            <div className="text-xs text-zinc-600">24,500</div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-dotted border-zinc-800">
          <div className="max-w-2xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <span><kbd className="px-1 py-0.5 border border-zinc-800 mr-1">/</kbd>Search</span>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <span className="text-zinc-600">24,500 pts</span>
              <span className="text-zinc-700"><kbd className="px-1 py-0.5 border border-zinc-800 mr-1">?</kbd></span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg lg:max-w-2xl mx-auto px-6 lg:px-8 pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <ExperimentalNavbar />
    </div>
  );
}
