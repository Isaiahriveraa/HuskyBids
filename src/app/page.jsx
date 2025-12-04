'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LoadingScreen,
  ActionButton,
  DottedDivider,
  SectionLabel
} from '@/components/experimental';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [clerkTimeout, setClerkTimeout] = useState(false);

  // Timeout if Clerk doesn't load within 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        console.warn('Clerk SDK taking longer than expected to load');
        setClerkTimeout(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while checking auth or redirecting
  // BUT if timeout occurs, show landing page anyway
  if ((!isLoaded && !clerkTimeout) || isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <LoadingScreen message="authentication" />
      </div>
    );
  }

  // Landing page for logged-out users
  return (
    <div className="min-h-screen bg-zinc-950 font-mono">
      {clerkTimeout && (
        <div className="bg-amber-900/20 border border-amber-800 p-3 text-center text-xs text-amber-400 font-mono">
          ⚠ Clerk authentication slow to load. If issues persist, check your connection.
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-24">
        {/* Ultra-minimal header */}
        <header className="mb-24">
          <h1 className="text-4xl text-zinc-100 mb-4 font-mono font-light">
            HuskyBids
          </h1>

          <p className="text-base text-zinc-500 mb-12 font-mono">
            Virtual sports betting for UW students
          </p>

          {/* CTAs */}
          <div className="flex gap-3">
            <ActionButton href="/sign-up" variant="primary" shortcut="S">
              Sign Up
            </ActionButton>

            <ActionButton href="/login" variant="default" shortcut="L">
              Log In
            </ActionButton>
          </div>
        </header>

        <DottedDivider />

        {/* Welcome Bonus */}
        <section className="mb-16">
          <SectionLabel>Welcome Bonus</SectionLabel>
          <div className="space-y-2 text-sm text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">→</span>
              <span>Get 1000 free biscuits to start</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">→</span>
              <span>Daily login rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">→</span>
              <span>Compete on the leaderboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">→</span>
              <span>Track your betting stats</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-sm text-zinc-600 font-mono">
          <p>
            Have an account?{' '}
            <a href="/login" className="text-zinc-400 hover:text-zinc-300 underline">
              Log in
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
