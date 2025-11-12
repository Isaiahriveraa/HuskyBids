'use client';

import { usePathname } from 'next/navigation';
import { useUserContext } from './contexts/UserContext';
import Navbar from './Components/layout/Navbar';
import RoutePreloader from './Components/RoutePreloader';
import PageTransition from './Components/layout/PageTransition';
import { Alert } from './Components/ui';

// Clean layout component with top navigation
export default function SimpleLayout({ children }) {
  const pathname = usePathname();

  // Get real user data from context
  const { user, loading: userLoading, dailyBonusMessage } = useUserContext();

  // Don't show navbar on login/signup pages
  const hideNavbarPages = ['/login', '/sign-up'];
  const showNavbar = !hideNavbarPages.includes(pathname);

  if (!showNavbar) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <PageTransition>{children}</PageTransition>
      </div>
    );
  }

  // Get real user data or use defaults for loading state
  const biscuits = user?.biscuits ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Preload frequently visited routes */}
      <RoutePreloader />

      {/* Top Navigation Bar */}
      <Navbar biscuits={biscuits} loading={userLoading} />

      {/* Daily Bonus Toast Notification */}
      {dailyBonusMessage && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <Alert variant="success" className="shadow-lg">
            {dailyBonusMessage}
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 min-h-screen pb-6">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
