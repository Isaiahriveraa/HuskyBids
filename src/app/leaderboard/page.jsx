'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUserContext } from '../contexts/UserContext';
import { useLeaderboard } from '../hooks/useAPI';
import BiscuitIcon from '../Components/BiscuitIcon';
import ErrorState from '../Components/ErrorState';
import { LeaderboardSkeleton, SkeletonCard } from '../Components/ui/LoadingSkeleton';
import { Button, Tabs } from '../Components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Lazy load Podium component
const Podium = dynamic(() => import('../Components/leaderboard/Podium'), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

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

  // Memoize podium positions to avoid recalculation on every render
  const podiumPositions = useMemo(() => {
    if (!leaderboard || leaderboard.length < 3) {
      return { first: null, second: null, third: null, rest: [] };
    }
    const [first, second, third, ...rest] = leaderboard;
    return { first, second, third, rest };
  }, [leaderboard]);

  // Memoize current user position check - only show if not on current page
  const userPositionInfo = useMemo(() => {
    if (!user || !leaderboard) {
      return { showCustomPosition: false };
    }
    const isOnCurrentPage = leaderboard.find(u => u._id?.toString() === user._id?.toString());
    return { showCustomPosition: !isOnCurrentPage };
  }, [user, leaderboard]);

  // Loading state
  if (loading) {
    return <LeaderboardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-8">Leaderboard</h1>
        <ErrorState
          error={error}
          showReload={true}
        />
      </div>
    );
  }

  // No users state
  if (leaderboard.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-8">Leaderboard</h1>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="mb-4">No users found on the leaderboard yet.</p>
          <p className="text-sm">Be the first to start betting!</p>
        </div>
      </div>
    );
  }

  const { first, second, third } = podiumPositions;

  // Handle period change - reset to page 1
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    setPage(1);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-2">Leaderboard</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">Top biscuit holders across all HuskyBids users</p>

      {/* Time Period Filter */}
      <div className="mb-6">
        <Tabs variant="pills" activeTab={period} onChange={handlePeriodChange}>
          <Tabs.Tab id="all-time">All Time</Tabs.Tab>
          <Tabs.Tab id="monthly">Monthly</Tabs.Tab>
          <Tabs.Tab id="weekly">Weekly</Tabs.Tab>
        </Tabs>
      </div>

      {/* Podium Section - Only show on page 1 */}
      {page === 1 && leaderboard.length >= 3 && (
        <Podium topThree={[first, second, third]} />
      )}

      {/* Rankings Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 overflow-hidden transition-all duration-300">
        <table className="w-full">
          <thead className="bg-purple-900 dark:bg-purple-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Rank</th>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-right">Biscuits</th>
              <th className="px-6 py-3 text-right">Win Rate</th>
              <th className="px-6 py-3 text-right">ROI</th>
              <th className="px-6 py-3 text-right">Total Bets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {leaderboard.map((userData, index) => {
              const isCurrentUser = user && userData._id?.toString() === user._id?.toString();
              const isTopThree = page === 1 && index < 3;

              return (
                <tr
                  key={userData._id || index}
                  className={`${
                    isCurrentUser
                      ? 'bg-purple-100 dark:bg-purple-900/30 font-semibold'
                      : isTopThree
                      ? 'bg-purple-50 dark:bg-purple-900/10'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                  } text-gray-900 dark:text-gray-100 transition-colors`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {userData.rank}
                      {isTopThree && (
                        <span className="ml-2">
                          {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      {isCurrentUser && <span className="ml-2 text-purple-600 dark:text-purple-400 font-bold">(You)</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{userData.username}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <BiscuitIcon size={16} />
                      <span>{userData.biscuits.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={
                        userData.winRate >= 60
                          ? 'text-green-600 dark:text-green-400 font-semibold'
                          : userData.winRate >= 50
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {userData.winRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={
                        userData.roi > 0
                          ? 'text-green-600 dark:text-green-400 font-semibold'
                          : userData.roi < 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }
                    >
                      {userData.roi > 0 ? '+' : ''}{userData.roi}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">{userData.totalBets}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!hasPrevPage || loading}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!hasNextPage || loading}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Your Position (if not in top 10) */}
      {userPositionInfo.showCustomPosition && (
        <div className="mt-6 bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Your Position:</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-purple-900">#{user.rank || '?'} {user.username}</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <BiscuitIcon size={16} />
                <span className="font-semibold">{user.biscuits?.toLocaleString() || 0}</span>
              </div>
              <span className="text-sm text-gray-600">{user.totalBets || 0} bets</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
