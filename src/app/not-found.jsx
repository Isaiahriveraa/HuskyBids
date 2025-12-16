'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Global 404 Not Found Handler
 *
 * Provides intelligent redirects based on authentication state:
 * - Authenticated users → Redirect to /dashboard
 * - Unauthenticated users → Redirect to /login
 *
 * This prevents users from hitting dead-end 404 pages and provides
 * a better user experience by guiding them to the appropriate location.
 */
export default function NotFound() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Authenticated users go to dashboard
        router.push('/dashboard');
      } else {
        // Unauthenticated users go to login
        router.push('/login');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono text-text">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-text-muted">Page not found</p>
        <p className="text-xs text-text-subtle">Redirecting...</p>
      </div>
    </div>
  );
}
