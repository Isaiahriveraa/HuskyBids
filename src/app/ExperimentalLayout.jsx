'use client';

import { usePathname } from 'next/navigation';
import { useUserContext } from './contexts/UserContext';
import { AppShell } from '@/components/experimental';

/**
 * ExperimentalLayout - New minimal layout using the experimental design system
 * Replaces SimpleLayout with the ultra-minimal Notion-inspired design
 */
export default function ExperimentalLayout({ children }) {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUserContext();

  // Don't show shell on login/signup pages
  const hideShellPages = ['/login', '/sign-up'];
  const showShell = !hideShellPages.includes(pathname);

  // Get user data
  const balance = user?.biscuits ?? 0;
  const userName = user?.username || user?.firstName || 'user';

  if (!showShell) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-mono">
        {children}
      </div>
    );
  }

  return (
    <AppShell
      title="HuskyBids"
      balance={balance}
      userName={userName}
    >
      {children}
    </AppShell>
  );
}
