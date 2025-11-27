/**
 * MobileNav - Bottom navigation for mobile
 * Ultra-minimal bottom navigation with keyboard hints
 * 
 * @example
 * <MobileNav items={navConfig} />
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navConfig } from '../config/navigation';
import Kbd from '../ui/Kbd';

export default function MobileNav({ items = navConfig }) {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-dotted border-zinc-800 font-mono">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around py-3">
          {items.map((item) => {
            const isActive = pathname === item.href;
            
            // Main CTA button (e.g., "Bet")
            if (item.isMain) {
              return (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 border border-dotted border-zinc-600 hover:border-zinc-400 transition-colors"
                >
                  <Kbd size="xs">{item.key}</Kbd>
                  <span className="text-xs text-zinc-300">+ {item.label}</span>
                </Link>
              );
            }
            
            // Regular nav item
            return (
              <Link 
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1.5 py-1"
              >
                <Kbd active={isActive}>{item.key}</Kbd>
                <span className={`text-[9px] uppercase tracking-wider transition-colors ${
                  isActive ? 'text-zinc-400' : 'text-zinc-700'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Safe area for iOS home indicator */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </nav>
  );
}
