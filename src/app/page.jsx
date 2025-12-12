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
        router.push('/dashboard');
      } else {
        router.push('/sign-up');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Global loading.jsx handles the loading state during redirect
  // This page component does not render anything because it only handles authentication redirects.
  // The global loading.jsx handles the loading state during redirect.
  return null;
}
