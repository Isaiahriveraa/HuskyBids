'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';

// Feature data
const features = [
  {
    title: 'Live Game Tracking',
    description: 'Follow UW Huskies football and basketball in real-time with live scores from ESPN.',
    icon: '○',
  },
  {
    title: 'Dynamic Odds',
    description: 'Odds update based on betting activity. Popular picks pay less, underdogs pay more.',
    icon: '◇',
  },
  {
    title: 'Compete & Climb',
    description: 'See how you rank against other Huskies fans. Top bettors earn bragging rights.',
    icon: '△',
  },
];

// How it works steps
const steps = [
  {
    number: '01',
    title: 'Sign Up',
    description: 'Create your account and receive 1,000 biscuits to start betting.',
  },
  {
    number: '02',
    title: 'Pick Games',
    description: 'Browse upcoming Washington Huskies games and check the odds.',
  },
  {
    number: '03',
    title: 'Place Bets',
    description: 'Bet on your favorite team and watch your biscuits grow.',
  },
];

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, isLoaded]);

  return (
    <div className="min-h-screen bg-zinc-950 font-mono text-zinc-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-dotted border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-xs tracking-[0.3em] uppercase text-text-muted-light hover:text-text">
            HUSKYBIDS
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-[16px] uppercase tracking-[0.2em] text-zinc-600">
            University of Washington
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            HUSKYBIDS
          </h1>
          <p className="text-lg md:text-xl text-text-subtle max-w-xl mx-auto">
            The premier virtual betting platform for UW Huskies sports.
            Bet with pts, not money.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isLoaded && !isSignedIn && (
              <>
              <Link
                href="/sign-up"
                className="bg-zinc-100 hover:bg-white text-zinc-950 px-8 py-3 font-semibold 
                transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="border border-dotted border-zinc-700 hover:border-zinc-500 text-zinc-300 
                hover:text-white px-8 py-3 font-semibold transition-colors"
              >
                Log In
              </Link>
              </> 
            )}
          </div>
        </div>
      </section>

      {/* Dotted Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-dotted border-zinc-800" />
      </div>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-8">
            Features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-dotted border-zinc-800 p-6 space-y-4 hover:border-zinc-700 transition-colors"
              >
                <span className="text-2xl text-zinc-500">{feature.icon}</span>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dotted Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-dotted border-zinc-800" />
      </div>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-8">
            How It Works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="space-y-3">
                <span className="text-xs text-zinc-600">{step.number}</span>
                <h3 className="text-white font-semibold">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Dotted Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-dotted border-zinc-800" />
      </div>
      {/* Footer */}
      <footer className="border-t border-dotted border-zinc-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <p>&copy; {new Date().getFullYear()} HuskyBids. Go Dawgs!</p>
          <p className="text-xs text-zinc-700">
            Virtual currency only. Not real gambling.
          </p>
        </div>
      </footer>
    </div>
  );
}
