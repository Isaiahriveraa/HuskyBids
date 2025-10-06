'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simple layout component that includes everything
export default function SimpleLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [biscuits, setBiscuits] = useState(1000); // Simple state instead of context
  const pathname = usePathname();

  // Don't show sidebar on login pages
  const hideSidebarPages = ['/login', '/login-testing'];
  const showSidebar = !hideSidebarPages.includes(pathname);

  if (!showSidebar) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-purple-900 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">HuskyBids</h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-yellow-400 text-purple-900 p-6 z-40 transform transition-transform ${
        mobileMenuOpen ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full'
      }`}>
        {/* Logo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">HuskyBids</h2>
        </div>

        {/* Biscuit Counter */}
        <div className="mb-6 bg-white text-purple-900 p-3 rounded-lg">
          <div className="font-semibold">Your Biscuits</div>
          <div className="text-2xl font-bold text-yellow-600">{biscuits}</div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" 
                className={`block p-3 rounded ${pathname === '/dashboard' ? 'bg-purple-700 text-white' : 'hover:bg-purple-100'}`}>
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link href="/leaderboard" 
                className={`block p-3 rounded ${pathname === '/leaderboard' ? 'bg-purple-700 text-white' : 'hover:bg-purple-100'}`}>
                🏆 Leaderboard
              </Link>
            </li>
            <li>
              <Link href="/betting-history" 
                className={`block p-3 rounded ${pathname === '/betting-history' ? 'bg-purple-700 text-white' : 'hover:bg-purple-100'}`}>
                📈 Betting History
              </Link>
            </li>
            <li>
              <Link href="/settings" 
                className={`block p-3 rounded ${pathname === '/settings' ? 'bg-purple-700 text-white' : 'hover:bg-purple-100'}`}>
                ⚙️ Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
