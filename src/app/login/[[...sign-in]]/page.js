'use client';

import { SignIn, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { HuskyBidsLoader } from '@/components/experimental';
import { minimalClerkAppearance } from '@/shared/utils/clerk-appearance';

  function LoginContent() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/dashboard';

    return (
      <div className="w-full max-w-md space-y-8">
        <ClerkLoading>
          <HuskyBidsLoader
            centered
            subtitle="Loading your account..."
          />
        </ClerkLoading>

        <ClerkLoaded>
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-sm tracking-[0.3em] uppercase text-zinc-400 mb-2">
              HuskyBids
            </h1>
            <p className="text-xs text-zinc-600">
              Log in to your account
            </p>
          </header>

          {/* Clerk SignIn Component */}
          <div>
            <SignIn
              appearance={minimalClerkAppearance}
              path="/login"
              afterSignInUrl={redirectUrl}
              signUpUrl="/sign-up"
            />
          </div>

          {/* Footer link */}
          <p className="text-center text-xs text-zinc-600 font-mono mt-6">
            No account?{' '}
            <Link href="/sign-up" className="text-zinc-500 hover:text-zinc-400 underline">
              Sign up
            </Link>
          </p>

        </ClerkLoaded>
      </div>
    );
  }

  export default function LoginPage() {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 font-mono">
        <Suspense fallback={<div className="text-zinc-500 text-sm">Loading...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    );
  }