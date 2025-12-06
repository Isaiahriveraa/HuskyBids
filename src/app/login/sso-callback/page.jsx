'use client';

import { LoadingScreen } from '@/components/experimental';

/**
 * SSO Callback Page
 * Handles OAuth redirects from social login providers (Google, etc.)
 * Shows loading screen during authentication process
 */
export default function SSOCallback() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <LoadingScreen message="HuskyBids dashboard" />
    </div>
  );
}
