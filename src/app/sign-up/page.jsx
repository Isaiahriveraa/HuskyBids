'use client';

import { SignUp } from '@clerk/nextjs';
import AuthPageWrapper from '@/components/auth/AuthPageWrapper';

/**
 * Sign Up Page
 * Uses Clerk's pre-built SignUp component for user registration
 * Wrapped with AuthPageWrapper to prevent flash during redirect
 */
export default function SignUpPage() {
  return (
    <AuthPageWrapper>
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 font-mono">
      <div className="w-full max-w-md space-y-8">
        {/* Minimal header */}
        <header className="text-center mb-8">
          <h1 className="text-sm tracking-[0.3em] uppercase text-zinc-400 mb-2">
            HuskyBids
          </h1>
          <p className="text-xs text-zinc-600">
            Create your account
          </p>
        </header>

        {/* Clerk SignUp Component with minimal styling */}
        <div>
          <SignUp
            appearance={{
              variables: {
                colorPrimary: '#71717a',
                colorText: '#d4d4d8',
                colorTextSecondary: '#71717a',
                colorBackground: '#18181b',
                colorInputBackground: '#27272a',
                colorInputText: '#d4d4d8',
                fontFamily: 'ui-monospace, monospace',
                fontSize: '14px',
                borderRadius: '0px',
              },
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-zinc-900 border border-dotted border-zinc-800 shadow-none',
                headerTitle: 'text-zinc-300 text-sm font-mono',
                headerSubtitle: 'text-zinc-600 text-xs font-mono',
                formFieldInput: 'bg-zinc-800 border border-dotted border-zinc-700 text-zinc-300 font-mono text-sm focus:border-zinc-500 rounded-none',
                formFieldLabel: 'text-zinc-500 text-xs font-mono uppercase tracking-wider',
                formButtonPrimary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-dotted border-zinc-700 font-mono text-sm shadow-none rounded-none',
                footerActionLink: 'text-zinc-500 hover:text-zinc-400 font-mono text-xs',
                socialButtonsBlockButton: 'border border-dotted border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-mono text-sm rounded-none shadow-none',
                dividerLine: 'bg-zinc-800',
                dividerText: 'text-zinc-600 font-mono text-xs',
              },
              layout: {
                socialButtonsPlacement: 'bottom',
                socialButtonsVariant: 'iconButton',
              }
            }}
            routing="hash"
            path="/sign-up"
            afterSignUpUrl="/dashboard"
          />
        </div>
      </div>
    </div>
    </AuthPageWrapper>
  );
}
