'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * RoutePreloader Component
 * Preloads frequently visited pages in the background for instant navigation
 */
export default function RoutePreloader() {
  const router = useRouter();

  useEffect(() => {
    // Preload routes after a short delay (when the user is idle)
    const preloadTimer = setTimeout(() => {
      // Frequently visited pages
      const routesToPreload = [
        '/dashboard',
        '/new-bid',
        '/leaderboard',
        '/betting-history',
        '/tasks',
        '/settings',
      ];

      routesToPreload.forEach((route) => {
        router.prefetch(route);
      });
    }, 1000); // Wait 1 second after mount

    return () => clearTimeout(preloadTimer);
  }, [router]);

  return null; // This component doesn't render anything
}
