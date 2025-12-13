'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono text-zinc-300">
      <main className="flex flex-col items-center space-y-8 max-w-2xl px-4 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            HuskyBids
          </h1>
          <p className="text-lg md:text-xl text-zinc-400">
            The premier betting platform for University of Washington sports.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          {isLoaded && (
            isSignedIn ? (
              <Link 
                href="/dashboard"
                className="flex-1 bg-zinc-100 hover:bg-white text-zinc-950 px-8 py-3 font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/sign-up"
                  className="flex-1 bg-zinc-100 hover:bg-white text-zinc-950 px-8 py-3 font-semibold transition-colors"
                >
                  Sign Up
                </Link>
                <Link 
                  href="/login"
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-8 py-3 font-semibold transition-colors"
                >
                  Log In
                </Link>
              </>
            )
          )}
        </div>
      </main>

      <footer className="absolute bottom-8 text-zinc-600 text-sm">
        <p>&copy; {new Date().getFullYear()} HuskyBids. Go Dawgs!</p>
      </footer>
    </div>
  );
}