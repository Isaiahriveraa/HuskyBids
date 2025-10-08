'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { BiscuitProvider } from '../context/BiscuitContext';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function Providers({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProvider client={convex}>
        <BiscuitProvider>
          {children}
        </BiscuitProvider>
      </ConvexProvider>
    </ClerkProvider>
  );
}
