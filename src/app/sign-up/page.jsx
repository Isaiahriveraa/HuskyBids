'use client';

import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import { Gift, Check } from 'lucide-react';

/**
 * Sign Up Page
 * Uses Clerk's pre-built SignUp component for user registration
 * 
 * Note: Middleware handles redirects for authenticated users
 * This page only renders when user is NOT authenticated
 */
export default function SignUpPage() {
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
            Join the Game!
          </p>
          <p className="text-sm text-gray-600">
            Create your account and get 1000 free biscuits
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="mt-8">
          <SignUp
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
            path="/sign-up"
            afterSignUpUrl="/dashboard"
            signInUrl="/login"
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-6">
          <p>
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-uw-purple-600 hover:text-uw-purple-700">
              Sign in here
            </a>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-center">
            <Gift className="w-5 h-5 text-uw-gold-500 inline-block mr-2" />
            Welcome Bonus
          </h3>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 flex-shrink-0" /> Get 1000 free biscuits to start</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 flex-shrink-0" /> Daily login rewards</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 flex-shrink-0" /> Compete on the leaderboard</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 flex-shrink-0" /> Track your betting stats</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
