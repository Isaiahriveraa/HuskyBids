'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

/**
 * SSO Callback Page for Sign Up
 * Handles OAuth redirects from Clerk authentication during sign-up
 */
export default function SignUpSSOCallback() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  return (
    <AuthenticateWithRedirectCallback
      afterSignInUrl={redirectUrl}
      afterSignUpUrl={redirectUrl}
    />
  );
}
