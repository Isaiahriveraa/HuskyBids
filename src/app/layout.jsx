'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { UserProvider } from './contexts/UserContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import SimpleLayout from './SimpleLayout';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <DarkModeProvider>
        <AccessibilityProvider>
          <UserProvider>
            <html lang="en">
              <head>
                <title>HuskyBids</title>
                <meta name="description" content="Bet on University of Washington sports games using biscuits!" />
              </head>
              <body>
                <SimpleLayout>
                  {children}
                </SimpleLayout>
              </body>
            </html>
          </UserProvider>
        </AccessibilityProvider>
      </DarkModeProvider>
    </ClerkProvider>
  );
}