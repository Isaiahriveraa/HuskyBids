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
        {/* Inline script to prevent dark mode flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
            `,
          }}
        />
        <title>HuskyBids</title>
        <meta name="description" content="Bet on University of Washington sports games using points!" />
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