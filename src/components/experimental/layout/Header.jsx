/**
 * Header - Top header bar
 * Supports both mobile and desktop variants
 * 
 * @example
 * <Header balance={24500} />
 */
'use client';

import Kbd from '../ui/Kbd';

export default function Header({ 
  title = 'HuskyBids',
  balance = 0,
  showSearch = true,
}) {
  const formattedBalance = balance.toLocaleString();

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-dotted border-zinc-800 lg:hidden">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xs tracking-[0.3em] uppercase text-zinc-400">{title}</h1>
          <div className="text-xs text-zinc-600">{formattedBalance}</div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-dotted border-zinc-800">
        <div className="max-w-2xl mx-auto px-8 py-4 flex items-center justify-between">
          {showSearch && (
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <span>
                <Kbd size="xs" className="inline-flex mr-1">/</Kbd>
                Search
              </span>
            </div>
          )}
          <div className="flex items-center gap-6 text-xs">
            <span className="text-zinc-600">{formattedBalance} pts</span>
            <span className="text-zinc-700">
              <Kbd size="xs" className="inline-flex mr-1">?</Kbd>
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
