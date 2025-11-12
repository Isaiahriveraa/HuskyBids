'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  TrendingUp,
  CheckSquare,
  Settings,
  Menu,
  X,
  History
} from 'lucide-react';
import BiscuitIcon from '../BiscuitIcon';
import DarkModeToggle from './DarkModeToggle';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Place Bet', href: '/new-bid', icon: Calendar },
  { name: 'Past Games', href: '/past-games', icon: History },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'My Bets', href: '/betting-history', icon: TrendingUp },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navbar({ biscuits = 0, loading = false }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 fixed w-full top-0 z-50 shadow-sm dark:shadow-lg dark:shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2 md:gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group flex-shrink-0">
            <span className="text-xl md:text-2xl font-bold text-uw-purple dark:text-uw-purple-300 group-hover:text-purple-700 dark:group-hover:text-uw-purple-200 transition-colors whitespace-nowrap">
              HuskyBids
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-wrap">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg
                    transition-all duration-200 font-medium text-sm
                    ${isActive
                      ? 'bg-uw-purple-500 dark:bg-uw-purple-600 text-white shadow-lg dark:shadow-lg dark:shadow-uw-purple-900/50 hover:bg-uw-purple-400 dark:hover:bg-uw-purple-500 hover:shadow-xl transform hover:scale-105'
                      : 'bg-transparent text-uw-purple-600 dark:text-uw-purple-300 hover:bg-uw-purple-100 dark:hover:bg-slate-800 hover:text-uw-purple-700 dark:hover:text-uw-purple-200 hover:shadow-md'
                    }
                  `}
                  title={item.name}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden xl:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section: Biscuits & User */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {user ? (
              <>
                {/* Biscuits Display - Only for logged in users */}
                <div className="bg-gradient-to-r from-uw-gold to-yellow-400 rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-md flex items-center gap-1.5 md:gap-2">
                  <BiscuitIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-bold text-uw-purple text-sm md:text-base whitespace-nowrap">
                    {loading ? '...' : biscuits.toLocaleString()}
                  </span>
                </div>

                {/* User Button (Clerk) - Desktop */}
                <div className="hidden md:block flex-shrink-0">
                  <UserButton
                    afterSignOutUrl="/login"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 ring-2 ring-uw-purple-400 hover:ring-uw-purple-300 transition-all",
                        userButtonPopoverCard: "shadow-xl",
                        userButtonPopoverActionButton: "hover:bg-uw-purple-50"
                      }
                    }}
                  />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons - For logged out users */}
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-uw-purple-600 dark:text-uw-purple-300 font-medium hover:text-uw-purple-700 dark:hover:text-uw-purple-200 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-uw-purple-600 dark:bg-uw-purple-700 text-white font-medium rounded-lg hover:bg-uw-purple-700 dark:hover:bg-uw-purple-600 transition-colors shadow-md hover:shadow-lg dark:shadow-lg dark:shadow-uw-purple-900/50"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Mobile Menu Button for logged out */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="px-4 py-4 space-y-1">
            {user ? (
              <>
                {/* Navigation for logged-in users */}
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200 font-medium
                        ${isActive
                          ? 'bg-uw-purple-500 dark:bg-uw-purple-600 text-white shadow-lg hover:bg-uw-purple-400 dark:hover:bg-uw-purple-500'
                          : 'bg-transparent text-uw-purple-600 dark:text-uw-purple-300 hover:bg-uw-purple-100 dark:hover:bg-slate-800 hover:text-uw-purple-700 dark:hover:text-uw-purple-200 hover:shadow-md'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* User Profile in Mobile Menu */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <UserButton
                      afterSignOutUrl="/login"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 ring-2 ring-uw-purple-400 flex-shrink-0",
                          userButtonPopoverCard: "shadow-xl",
                          userButtonPopoverActionButton: "hover:bg-uw-purple-50 dark:hover:bg-slate-800"
                        }
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-50 truncate">
                        {user?.firstName || user?.username || 'User'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Login/Signup for logged-out users */}
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-lg border-2 border-uw-purple-600 dark:border-uw-purple-400 text-uw-purple-600 dark:text-uw-purple-300 font-medium hover:bg-uw-purple-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-lg bg-uw-purple-600 dark:bg-uw-purple-700 text-white font-medium hover:bg-uw-purple-700 dark:hover:bg-uw-purple-600 transition-colors shadow-md dark:shadow-lg dark:shadow-uw-purple-900/50"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
