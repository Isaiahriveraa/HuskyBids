'use client';

import ExperimentalNavbar from './ExperimentalNavbar';
import { Bell, Search } from 'lucide-react';
import BiscuitIcon from '../../components/BiscuitIcon';

export default function ExperimentalLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4B2E83' }}>
              <span className="font-bold text-white text-lg">H</span>
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">HuskyBids</span>
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-uw-purple transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search games..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-uw-purple/50 focus:ring-1 focus:ring-uw-purple/50 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Balance Chip */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full pl-3 pr-4 py-1.5">
              <BiscuitIcon size={18} />
              <span className="text-sm font-bold text-white">24,500</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#E8D21D' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-28">
        {children}
      </main>

      {/* Bottom Navigation */}
      <ExperimentalNavbar />
    </div>
  );
}
