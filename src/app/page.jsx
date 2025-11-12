'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2, Trophy, TrendingUp } from 'lucide-react';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is signed in, redirect to dashboard
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uw-purple-50 via-gray-50 to-uw-gold-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uw-purple-600 dark:border-uw-purple-400"></div>
      </div>
    );
  }

  // If signed in, show loading (will redirect)
  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uw-purple-50 via-gray-50 to-uw-gold-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uw-purple-600 dark:border-uw-purple-400"></div>
      </div>
    );
  }

  // Landing page for logged-out users
  return (
    <div className="min-h-screen bg-gradient-to-br from-uw-purple-50 via-gray-50 to-uw-gold-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="UW Huskies Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-6xl md:text-7xl font-extrabold text-uw-purple-900 dark:text-uw-purple-300 mb-6">
            HuskyBids
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-semibold mb-4">
            Bet on UW Huskies Games
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Place virtual bets, compete with friends, and climb the leaderboard.
            Join the ultimate UW sports prediction platform!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-uw-purple-600 dark:bg-uw-purple-500 text-white text-lg font-bold rounded-lg hover:bg-uw-purple-700 dark:hover:bg-uw-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started - Free!
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-uw-purple-600 dark:border-uw-purple-400 text-uw-purple-600 dark:text-uw-purple-300 text-lg font-bold rounded-lg hover:bg-uw-purple-50 dark:hover:bg-uw-purple-900/20 transition-all"
            >
              Log In
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md dark:shadow-slate-900/50 hover:shadow-lg dark:hover:shadow-slate-900/70 transition-all duration-300">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-uw-purple-600 dark:text-uw-purple-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Virtual Betting</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start with 1000 free biscuits. No real money, just fun!
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md dark:shadow-slate-900/50 hover:shadow-lg dark:hover:shadow-slate-900/70 transition-all duration-300">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-uw-gold-500 dark:text-uw-gold-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Leaderboards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Compete with other UW students to become the top predictor
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md dark:shadow-slate-900/50 hover:shadow-lg dark:hover:shadow-slate-900/70 transition-all duration-300">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-uw-purple-600 dark:text-uw-purple-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Track Stats</h3>
              <p className="text-gray-600 dark:text-gray-300">
                View your betting history, win rate, and ROI
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-uw-purple-900 dark:text-uw-purple-300 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-uw-purple-100 dark:bg-uw-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-uw-purple-600 dark:text-uw-purple-300">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Sign Up</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create your free account</p>
              </div>

              <div className="text-center">
                <div className="bg-uw-purple-100 dark:bg-uw-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-uw-purple-600 dark:text-uw-purple-300">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Get Biscuits</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive 1000 free biscuits</p>
              </div>

              <div className="text-center">
                <div className="bg-uw-purple-100 dark:bg-uw-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-uw-purple-600 dark:text-uw-purple-300">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Place Bets</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bet on UW games</p>
              </div>

              <div className="text-center">
                <div className="bg-uw-purple-100 dark:bg-uw-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-uw-purple-600 dark:text-uw-purple-300">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Climb Leaderboard</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Win big and compete!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2025 HuskyBids - University of Washington Student Project
          </p>
        </div>
      </div>
    </div>
  );
}
