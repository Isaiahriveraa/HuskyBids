'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { UserProvider } from './contexts/UserContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import MinimalLayout from './MinimalLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>HuskyBids</title>
        <meta name="description" content="Bet on University of Washington sports games using biscuits!" />
      </head>
      <body suppressHydrationWarning>
        <ClerkProvider>
          <DarkModeProvider>
            <AccessibilityProvider>
              <LoadingProvider>
                <UserProvider>
                  <MinimalLayout>
                    {children}
                  </MinimalLayout>
                </UserProvider>
              </LoadingProvider>
            </AccessibilityProvider>
          </DarkModeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}