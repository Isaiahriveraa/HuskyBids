'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingScreen } from '@/components/experimental';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.push('/dashboard');
      } else {
        router.push('/sign-up');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <LoadingScreen message="HuskyBids" />
    </div>
  );
}
