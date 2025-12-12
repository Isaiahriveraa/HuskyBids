'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { LoadingScreen } from '@/components/experimental';

/**
 * AuthPageWrapper - Wraps authentication pages with loading state
 * Prevents flash of auth forms when user is already authenticated
 * Shows "Loading HuskyBids dashboard..." during redirect
 *
 * @param {React.ReactNode} children - The Clerk SignIn/SignUp component
 * @param {string} redirectUrl - Where to redirect authenticated users
 */
export default function AuthPageWrapper({ children, redirectUrl = '/dashboard' }) {
  const { isSignedIn, isLoaded } = useUser();

  // Redirect authenticated users
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Use window.location.href instead of router.push to force a full page load
      // This ensures cookies are properly sent to the server, preventing redirect loops
      window.location.href = redirectUrl;
    }
  }, [isLoaded, isSignedIn, redirectUrl]);

  // Show loading screen ONLY while auth state is being checked
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingScreen message="Loading" />
      </div>
    );
  }

  // If user is signed in, return null and let the redirect happen
  // The useEffect above will handle navigation to dashboard
  if (isSignedIn) {
    return null;
  }

  // User is not signed in - show the auth form
  return children;
}
