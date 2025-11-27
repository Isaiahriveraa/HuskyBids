'use client';

import { usePathname } from 'next/navigation';
import { useUserContext } from './contexts/UserContext';
import { AppShell } from '@/components/experimental';
import RoutePreloader from '@components/RoutePreloader';

// Feature flag - set to true to use the new experimental design
const USE_EXPERIMENTAL_DESIGN = true;

// Legacy imports for fallback
import Navbar from '@components/layout/Navbar';
import PageTransition from '@components/layout/PageTransition';
import { Alert } from '@components/ui';

/**
 * SimpleLayout - Main layout wrapper
 * Now uses the experimental design system by default
 */
export default function SimpleLayout({ children }) {
  const pathname = usePathname();
  const { user, loading: userLoading, dailyBonusMessage } = useUserContext();

  // Don't show navbar on login/signup pages
  const hideNavbarPages = ['/login', '/sign-up'];
  // Experiments page has its own layout
  const isExperimentPage = pathname?.startsWith('/experiments');
  const showNavbar = !hideNavbarPages.includes(pathname) && !isExperimentPage;

  // Get user data
  const biscuits = user?.biscuits ?? 0;
  const userName = user?.username || user?.firstName || 'user';

  // Use experimental design for all pages except experiments (which has its own layout)
  if (USE_EXPERIMENTAL_DESIGN && !isExperimentPage) {
    if (!showNavbar) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white font-mono">
          {children}
        </div>
      );
    }

    return (
      <>
        <RoutePreloader />
        <AppShell
          title="HuskyBids"
          balance={biscuits}
          userName={userName}
        >
          {children}
        </AppShell>
      </>
    );
  }

  // Legacy layout (fallback)
  if (!showNavbar) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        {isExperimentPage ? children : <PageTransition>{children}</PageTransition>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <RoutePreloader />
      <Navbar biscuits={biscuits} loading={userLoading} />

      {dailyBonusMessage && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <Alert variant="success" className="shadow-lg">
            {dailyBonusMessage}
          </Alert>
        </div>
      )}

      <main className="pt-20 min-h-screen pb-6">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
