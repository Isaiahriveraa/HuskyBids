'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Gamepad2 } from 'lucide-react';

/**
 * Login Page
 * Uses Clerk's pre-built SignIn component for authentication
 * 
 * Note: Middleware handles redirects for authenticated users
 * This page only renders when user is NOT authenticated
 */
export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uw-purple-50 via-gray-50 to-uw-gold-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="UW Huskies Logo"
            width={64}
            height={64}
            className="mx-auto mb-3"
          />
          <h1 className="text-4xl font-extrabold text-uw-purple-900 mb-2">
            HuskyBids
          </h1>
          <p className="text-lg text-gray-700 font-semibold mb-1">
            Welcome Back!
          </p>
          <p className="text-sm text-gray-600">
            Sign in to start betting on UW games
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="mt-8">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-2xl rounded-xl border border-gray-200",
                headerTitle: "text-uw-purple-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                formButtonPrimary: "bg-uw-purple-600 hover:bg-uw-purple-700",
                footerActionLink: "text-uw-purple-600 hover:text-uw-purple-700",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "iconButton",
              }
            }}
            routing="hash"
            path="/login"
            afterSignInUrl={redirectUrl}
            signUpUrl="/sign-up"
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-6">
          <p>
            Don't have an account?{' '}
            <a href="/sign-up" className="font-semibold text-uw-purple-600 hover:text-uw-purple-700">
              Sign up here
            </a>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-uw-purple-600 inline-block mr-2" />
            What is HuskyBids?
          </h3>
          <ul className="text-xs text-gray-600 space-y-2">
            <li>• Bet virtual biscuits on UW sports games</li>
            <li>• Compete on the leaderboard</li>
            <li>• Track your betting history</li>
            <li>• Win daily rewards and bonuses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
