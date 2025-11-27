'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Trophy, 
  Wallet, 
  History, 
  Gamepad2,
  Plus
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/experiments' },
  { icon: Gamepad2, label: 'Games', href: '/experiments/games' },
  { icon: Plus, label: 'Bet', href: '/experiments/new-bet', isMain: true },
  { icon: Trophy, label: 'Ranks', href: '/experiments/leaderboard' },
  { icon: Wallet, label: 'Bets', href: '/experiments/bets' },
];

export default function ExperimentalNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl px-2 py-2 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              if (item.isMain) {
                return (
                  <Link 
                    key={item.label}
                    href={item.href}
                    className="-mt-8 relative"
                  >
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-uw-purple/40 hover:scale-110 active:scale-95 transition-transform"
                      style={{ background: 'linear-gradient(to bottom right, #4B2E83, #7c3aed)' }}
                    >
                      <Icon size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                  </Link>
                );
              }
              
              return (
                <Link 
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Icon size={22} style={isActive ? { color: '#4B2E83' } : {}} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 w-1 h-1 rounded-full" style={{ backgroundColor: '#4B2E83' }}></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
