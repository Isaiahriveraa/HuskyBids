'use client';

import { useState } from 'react';
import { useUserContext } from '@/app/contexts/UserContext';
import { useLeaderboard } from '@/app/hooks/useAPI';
import {
  SectionLabel,
  DottedDivider,
  LeaderboardRow,
  Kbd,
} from '@/components/experimental';
import { LeaderboardSkeleton } from '@/components/ui/LoadingSkeleton';

const LeaderboardPage = () => {
  const { user } = useUserContext();
  const [period, setPeriod] = useState('all-time');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const {
    leaderboard,
    isLoading: loading,
    error,
    totalPages,
    hasNextPage,
    hasPrevPage,
    currentPage
  } = useLeaderboard(itemsPerPage, period, page);

  // Loading state
  if (loading) {
    return <LeaderboardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 font-mono">
        <SectionLabel>Error</SectionLabel>
        <p className="text-zinc-500 text-sm mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-xs text-zinc-600 hover:text-zinc-400 underline"
        >
          Reload page
        </button>
      </div>
    );
  }

  // No users state
  if (leaderboard.length === 0) {
    return (
      <div className="py-8 font-mono">
        <SectionLabel>Leaderboard</SectionLabel>
        <div className="py-12 text-center border border-dotted border-zinc-800 mt-4">
          <p className="text-zinc-600 text-sm">No users found yet</p>
          <p className="text-zinc-700 text-xs mt-2">Be the first to start betting</p>
        </div>
      </div>
    );
  }

  // Handle period change - reset to page 1
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    setPage(1);
  };

  const periods = [
    { id: 'all-time', label: 'All Time', key: 'A' },
    { id: 'monthly', label: 'Month', key: 'M' },
    { id: 'weekly', label: 'Week', key: 'W' },
  ];

  return (
    <div className="py-8 space-y-8 font-mono">
      {/* Header */}
      <div>
        <SectionLabel>Leaderboard</SectionLabel>
        <p className="text-zinc-600 text-xs mt-2">Top biscuit holders</p>
      </div>

      {/* Time Period Filter */}
      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePeriodChange(p.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs border border-dotted transition-colors ${
              period === p.id
                ? 'border-zinc-600 text-zinc-300 bg-zinc-900/50'
                : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-500'
            }`}
          >
            <Kbd size="xs">{p.key}</Kbd>
            {p.label}
          </button>
        ))}
      </div>

      <DottedDivider />

      {/* Rankings List */}
      <div className="border border-dotted border-zinc-800">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-dotted border-zinc-800 text-[10px] text-zinc-600 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8">Rank</span>
            <span>User</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Win %</span>
            <span className="w-20 text-right">Balance</span>
          </div>
        </div>

        {/* Leaderboard rows */}
        {leaderboard.map((userData, index) => {
          const isCurrentUser = user && userData._id?.toString() === user._id?.toString();
          const rank = (page - 1) * itemsPerPage + index + 1;

          return (
            <LeaderboardRow
              key={userData._id || index}
              rank={rank}
              username={userData.username}
              balance={userData.biscuits}
              winRate={userData.winRate}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!hasPrevPage || loading}
              className="flex items-center gap-1 px-3 py-2 border border-dotted border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Kbd size="xs">←</Kbd>
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!hasNextPage || loading}
              className="flex items-center gap-1 px-3 py-2 border border-dotted border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <Kbd size="xs">→</Kbd>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
