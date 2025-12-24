'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { UserProvider } from './contexts/UserContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import MinimalLayout from './MinimalLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>HuskyBids</title>
        <meta name="description" content="Bet on University of Washington sports games using points!" />
      </head>
      <body suppressHydrationWarning>
        <ClerkProvider>
          <AccessibilityProvider>
            <LoadingProvider>
              <UserProvider>
                <MinimalLayout>
                  {children}
                </MinimalLayout>
              </UserProvider>
            </LoadingProvider>
          </AccessibilityProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}