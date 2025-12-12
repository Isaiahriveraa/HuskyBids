'use client';

import { SectionLabel, DottedDivider } from '@/components/experimental';
import { StatCardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="py-8 space-y-8 font-mono">
      {/* Header */}
      <div>
        <SectionLabel>Betting History</SectionLabel>
        <div className="h-4 w-48 bg-zinc-900 rounded animate-pulse mt-2"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <DottedDivider />

      {/* Filters Skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 bg-zinc-900 rounded animate-pulse border border-dotted border-zinc-800"></div>
        ))}
      </div>

      <DottedDivider />

      {/* List Skeleton */}
      <div className="space-y-2 border border-dotted border-zinc-800 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="h-4 w-1/3 bg-zinc-900 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-zinc-900 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
