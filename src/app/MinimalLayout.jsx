'use client';

import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useUserContext } from './contexts/UserContext';
import { AppShell } from '@/components/experimental';
import HuskyBidsLoader from '@/components/experimental/ui/HuskyBidsLoader';
import RoutePreloader from '@components/RoutePreloader';
import PageTransition from '@components/layout/PageTransition';
import { Alert } from '@components/ui';

/**
 * MinimalLayout - Clean layout using only the experimental minimal design system
 * Replaces SimpleLayout with no legacy fallback code
 *
 * ARCHITECTURE:
 * - Uses AppShell for authenticated pages (dashboard, games, leaderboard, etc.)
 * - Shows plain background for unauthenticated pages (login, sign-up)
 * - Displays notifications for settlements and daily bonuses
 */
export default function MinimalLayout({ children }) {
  const pathname = usePathname();
  const { isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { user, dailyBonusMessage, settlementMessage } = useUserContext();

  // Pages that should not show the AppShell navigation
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/sign-up') || pathname === '/';
  const showShell = !isAuthRoute;

  // Note: Auth redirects are handled by middleware.ts - no client-side redirect needed

  // Extract user data for AppShell
  const biscuits = user?.biscuits ?? 0;
  const userName = user?.username || user?.firstName || 'user';

  // Unauthenticated pages (login, sign-up) get plain background
  if (!showShell) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-mono">
        {children}
      </div>
    );
  }

  // Clerk still loading - show minimal loading state
  if (!clerkLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500 font-mono text-sm">Loading...</p>
      </div>
    );
  }

  // User not authenticated but on protected page - middleware will redirect
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <HuskyBidsLoader size="lg" centered />
      </div>
    );
  }

  // Authenticated pages get full AppShell with navigation
  return (
    <>
      <RoutePreloader />

      {/* Settlement notification */}
      {settlementMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <Alert
            variant={settlementMessage.includes('+') ? 'success' : settlementMessage.includes('-') ? 'error' : 'info'}
            className="shadow-lg font-mono"
          >
            {settlementMessage}
          </Alert>
        </div>
      )}

      {/* Daily bonus notification */}
      {dailyBonusMessage && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <Alert variant="success" className="shadow-lg font-mono">
            {dailyBonusMessage}
          </Alert>
        </div>
      )}

      <AppShell
        title="HuskyBids"
        balance={biscuits}
        userName={userName}
      >
        <PageTransition>{children}</PageTransition>
      </AppShell>
    </>
  );
}
