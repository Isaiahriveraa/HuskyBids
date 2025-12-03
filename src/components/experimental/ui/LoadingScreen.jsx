/**
 * LoadingScreen - Standardized full-page loading state
 * Wraps HuskyBidsLoader with consistent layout/styling
 *
 * @param {string} message - Optional loading message (e.g., "games", "stats")
 * @example
 * <LoadingScreen message="games" />
 * <LoadingScreen message="leaderboard" />
 */
'use client';

import HuskyBidsLoader from './HuskyBidsLoader';

export default function LoadingScreen({ message = "" }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <HuskyBidsLoader size="lg" centered />
      {message && (
        <p className="text-zinc-600 font-mono text-xs">
          Loading {message}...
        </p>
      )}
    </div>
  );
}
