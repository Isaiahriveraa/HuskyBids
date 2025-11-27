'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useUserContext } from '../contexts/UserContext';
import { useUserStats } from '../hooks/useAPI';
import BiscuitIcon from '@components/BiscuitIcon';
import ErrorBoundary from '@components/ErrorBoundary';
import ErrorState from '@components/ErrorState';
import { DashboardSkeleton, SkeletonCard } from '@components/ui/LoadingSkeleton';

// Lazy load heavy components
const GameCalendar = dynamic(() => import('@components/GameCalendar'), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

const StatsGrid = dynamic(() => import('@components/dashboard/StatsGrid'), {
  loading: () => <SkeletonCard />,
});

const BettingChart = dynamic(() => import('@components/dashboard/BettingChart'), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

export default function Dashboard() {
  const { user, loading: userLoading } = useUserContext();
  const { stats, isLoading, error } = useUserStats();

  const loading = isLoading || userLoading;

  // Memoize profit/loss color calculation
  const profitLossColor = useMemo(() => {
    if (!stats) return 'text-gray-600';
    if (stats.profitLoss > 0) return 'text-green-600';
    if (stats.profitLoss < 0) return 'text-red-600';
    return 'text-gray-600';
  }, [stats]);

  // Memoize win rate color
  const winRateColor = useMemo(() => {
    if (!stats) return 'text-red-600';
    return stats.winRate >= 50 ? 'text-green-600' : 'text-red-600';
  }, [stats]);

  // Memoize win rate bar color
  const winRateBarColor = useMemo(() => {
    if (!stats) return 'bg-red-600';
    return stats.winRate >= 50 ? 'bg-green-600' : 'bg-red-600';
  }, [stats]);

  // Loading state
  if (loading || userLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-6">Dashboard</h1>
        <ErrorState
          error={error}
          showReload={true}
        />
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header with Welcome Message */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-300">
          Welcome back, {stats?.username || 'User'}! 👋
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2">
          Here's your betting overview and upcoming games
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="mb-6 md:mb-8">
        <StatsGrid stats={{
          balance: stats?.biscuits,
          totalWagered: stats?.totalWagered || stats?.totalBets * 50, // Approximate if not available
          totalWon: stats?.totalBiscuitsWon || 0,
          profitLoss: stats?.profitLoss || 0,
          winRate: stats?.winRate || 0,
          totalWageredChange: null, // Can be calculated if historical data available
          totalWonChange: null,
          profitLossChange: null,
          winRateChange: null,
        }} />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        {/* Profit/Loss */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow dark:shadow-slate-900/50 transition-all duration-300">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">Net Profit/Loss</h2>
          <p className={`text-3xl font-bold ${profitLossColor} dark:brightness-110`}>
            {stats?.profitLoss >= 0 ? '+' : ''}{stats?.profitLoss?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            ROI: {stats?.roi >= 0 ? '+' : ''}{stats?.roi || 0}%
          </p>
        </div>

        {/* Pending Bets */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow dark:shadow-slate-900/50 transition-all duration-300">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">Pending Bets</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.pendingBets || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {stats?.pendingAmount?.toLocaleString() || 0} biscuits at risk
          </p>
        </div>

        {/* Potential Winnings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow dark:shadow-slate-900/50 transition-all duration-300">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">Potential Winnings</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats?.potentialWinnings?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">From pending bets</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow dark:shadow-slate-900/50 mb-6 md:mb-8 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Activity</h2>
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{activity.game}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Bet {activity.amount} biscuits on {activity.prediction} at {activity.odds}x odds
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(activity.placedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-semibold ${
                      activity.resultColor === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : activity.resultColor === 'red'
                        ? 'text-red-600 dark:text-red-400'
                        : activity.resultColor === 'blue'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {activity.result}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{activity.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="mb-2">No betting activity yet</p>
            <p className="text-sm">
              Place your first bet on the{' '}
              <a href="/games" className="text-purple-600 dark:text-purple-400 hover:underline">
                Games page
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Upcoming Games Calendar */}
      <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow dark:shadow-slate-900/50 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Upcoming Games</h2>
        <ErrorBoundary>
          <GameCalendar sport="football" />
        </ErrorBoundary>
      </div>
    </div>
  );
}
