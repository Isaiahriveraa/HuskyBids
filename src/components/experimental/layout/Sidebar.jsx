/**
 * Sidebar - Desktop sidebar navigation
 * Notion-inspired sidebar with keyboard hints
 *
 * @example
 * <Sidebar items={sidebarConfig} />
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { sidebarConfig } from '../config/navigation';
import NavLink from '../ui/NavLink';

export default function Sidebar({ 
  items = sidebarConfig,
  title = 'HuskyBids',
  userName = 'user',
}) {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-52 lg:border-r lg:border-dotted lg:border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="p-6 border-b border-dotted border-zinc-800">
        <Link href="/dashboard">
          <h1 className="text-xs tracking-[0.3em] uppercase text-zinc-400 hover:text-zinc-300 transition-colors">
            {title}
          </h1>
        </Link>
      </div>
      
      {/* Navigation with keyboard hints */}
      <nav className="flex-1 py-4">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavLink
              key={item.label}
              href={item.href}
              shortcut={item.key}
              active={isActive}
              variant="sidebar"
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User - minimal - Only show when signed in */}
      {isSignedIn && (
        <div className="p-6 border-t border-dotted border-zinc-800 space-y-3">
          <div>
            <p className="text-[10px] text-zinc-700 uppercase tracking-wider">Signed in</p>
            <p className="text-sm text-zinc-400 mt-1">{userName}</p>
          </div>

          {/* Sign Out Button */}
          <SignOutButton redirectUrl="/login">
            <button className="w-full px-3 py-2 text-xs text-zinc-500 hover:text-zinc-400 hover:bg-zinc-900 transition-colors border border-dotted border-zinc-800 hover:border-zinc-700 text-left">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      )}
    </aside>
  );
}
