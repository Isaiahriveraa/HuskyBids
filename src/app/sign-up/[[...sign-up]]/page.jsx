'use client';

import { SignUp, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { HuskyBidsLoader } from '@/components/experimental';
import { minimalClerkAppearance } from '@/shared/utils/clerk-appearance';

/**
 * Sign Up Page Content
 * Extracted to allow Suspense wrapping
 */
function SignUpContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Loading state while Clerk initializes */}
      <ClerkLoading>
        <HuskyBidsLoader
          centered
          subtitle="Creating your account..."
        />
      </ClerkLoading>

      {/* Content shown when Clerk is ready */}
      <ClerkLoaded>
        {/* Minimal header */}
        <header className="text-center mb-8">
          <h1 className="text-sm tracking-[0.3em] uppercase text-zinc-400 mb-2">
            HuskyBids
          </h1>
          <p className="text-xs text-zinc-600">
            Create your account
          </p>
        </header>

        {/* Clerk SignUp Component with minimal styling */}
        <div>
          <SignUp
            appearance={minimalClerkAppearance}
            path="/sign-up"
            signInUrl="/login"
            afterSignUpUrl={redirectUrl}
          />
        </div>
      </ClerkLoaded>
    </div>
  );
}

/**
 * Sign Up Page
 * Uses Clerk's pre-built SignUp component for user registration
 * Clerk handles redirects natively via afterSignUpUrl
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 font-mono">
      <Suspense fallback={<div className="text-zinc-500 text-sm">Loading...</div>}>
        <SignUpContent />
      </Suspense>
    </div>
  );
}
