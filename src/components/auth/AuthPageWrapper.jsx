'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/experimental';

/**
 * AuthPageWrapper - Wraps authentication pages with loading state
 * Prevents flash of auth forms when user is already authenticated
 * Uses window.location.replace for clean redirects without history pollution
 *
 * @param {React.ReactNode} children - The Clerk SignIn/SignUp component
 * @param {string} redirectUrl - Where to redirect authenticated users
 */
export default function AuthPageWrapper({ children, redirectUrl = '/dashboard' }) {
  const { isSignedIn, isLoaded } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect authenticated users using window.location for clean redirect
  useEffect(() => {
    if (isLoaded && isSignedIn && !isRedirecting) {
      setIsRedirecting(true);
      // Use replace to avoid adding to history stack (prevents back button loop)
      window.location.replace(redirectUrl);
    }
  }, [isLoaded, isSignedIn, redirectUrl]);

  // Show loading screen while auth state is being checked OR while redirecting
  if (!isLoaded || isRedirecting) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingScreen message={isRedirecting ? "Redirecting" : "Loading"} />
      </div>
    );
  }

  // User is not signed in - show the auth form
  return children;
}
