'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.replace('/dashboard');
      } else {
        router.replace('/sign-up');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading message while auth state is being determined
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-500 font-mono text-sm">
        {isLoaded ? (isSignedIn ? 'Loading dashboard...' : 'Redirecting...') : 'Loading...'}
      </p>
    </div>
  );
}
