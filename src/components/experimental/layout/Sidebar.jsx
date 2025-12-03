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
import { sidebarConfig } from '../config/navigation';
import NavLink from '../ui/NavLink';

export default function Sidebar({ 
  items = sidebarConfig,
  title = 'HuskyBids',
  userName = 'user',
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-52 lg:border-r lg:border-dotted lg:border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="p-6 border-b border-dotted border-zinc-800">
        <Link href="/">
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

      {/* User - minimal */}
      <div className="p-6 border-t border-dotted border-zinc-800">
        <p className="text-[10px] text-zinc-700 uppercase tracking-wider">Signed in</p>
        <p className="text-sm text-zinc-400 mt-1">{userName}</p>
      </div>
    </aside>
  );
}
