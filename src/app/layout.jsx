'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { UserProvider } from './contexts/UserContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import SimpleLayout from './SimpleLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>HuskyBids</title>
        <meta name="description" content="Bet on University of Washington sports games using biscuits!" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('darkMode');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = saved !== null ? saved === 'true' : prefersDark;
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ClerkProvider>
          <DarkModeProvider>
            <AccessibilityProvider>
              <UserProvider>
                <SimpleLayout>
                  {children}
                </SimpleLayout>
              </UserProvider>
            </AccessibilityProvider>
          </DarkModeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}