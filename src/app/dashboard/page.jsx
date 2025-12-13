'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../contexts/UserContext';
import { useUserStats } from '../hooks/useAPI';
import {
  BalanceDisplay,
  DottedDivider,
  SectionLabel,
  StatCard,
  BetHistoryRow,
  ActionBar,
} from '@/components/experimental';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function Dashboard() {
  const router = useRouter();
  const { stats, isLoading, error, mutate } = useUserStats();
  const { refreshUser, showSettlementNotification } = useUserContext();
  const hasSettledRef = useRef(false);

  // Auto-settle pending bets on mount (silent, with 2 min cache)
  useEffect(() => {
    const SETTLE_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
    const lastSettle = localStorage.getItem('lastBetSettlement');
    const now = Date.now();

    if (!hasSettledRef.current && (!lastSettle || now - parseInt(lastSettle) > SETTLE_CACHE_DURATION)) {
      hasSettledRef.current = true;

      fetch('/api/bets/auto-settle-user', { method: 'POST' })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.settled > 0) {
            localStorage.setItem('lastBetSettlement', now.toString());
            const netChange = data.netChange || 0;
            const sign = netChange > 0 ? '+' : '';
            showSettlementNotification(
              `${data.settled} bet${data.settled > 1 ? 's' : ''} settled: ${sign}${netChange} pts`
            );
            // Refresh data to show updated stats
            mutate();
            refreshUser();
          }
        })
        .catch(() => {}); // Silent fail
    }
  }, [mutate, refreshUser, showSettlementNotification]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case 'g':
          router.push('/games');
          break;
        case 'b':
          router.push('/betting-history');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
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

  return (
    <div className="py-8 space-y-8 font-mono">
      {/* Balance */}
      <BalanceDisplay balance={stats?.biscuits || 0} />

      <DottedDivider />

      {/* Stats Grid */}
      <div>
        <SectionLabel className="mb-4">Stats</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard 
            label="Win Rate" 
            value={`${stats?.winRate || 0}%`}
            size="sm"
          />
          <StatCard 
            label="Total Bets" 
            value={stats?.totalBets || 0}
            size="sm"
          />
          <StatCard 
            label="Profit/Loss" 
            value={stats?.profitLoss || 0}
            prefix={stats?.profitLoss >= 0 ? '+' : ''}
            negative={stats?.profitLoss < 0}
            size="sm"
          />
          <StatCard 
            label="Pending" 
            value={stats?.pendingBets || 0}
            trend={stats?.pendingAmount ? `${stats.pendingAmount.toLocaleString()} at risk` : null}
            size="sm"
          />
        </div>
      </div>

      <DottedDivider />

      {/* Recent Activity */}
      <div>
        <SectionLabel className="mb-4">Recent Activity</SectionLabel>
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="border border-dotted border-zinc-800">
            {stats.recentActivity.slice(0, 5).map((activity) => (
              <BetHistoryRow
                key={activity.id}
                game={activity.game}
                prediction={activity.prediction}
                amount={activity.amount}
                odds={activity.odds}
                status={activity.status}
                payout={activity.payout}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center border border-dotted border-zinc-800">
            <p className="text-zinc-600 text-sm">No betting activity yet</p>
            <Link 
              href="/games" 
              className="text-zinc-500 text-xs hover:text-zinc-400 underline mt-2 inline-block"
            >
              Place your first bet
            </Link>
          </div>
        )}
      </div>

      <DottedDivider />

      {/* Actions */}
      <ActionBar
        actions={[
          { key: 'G', label: 'Games' },
          { key: 'N', label: 'New bet' },
          { key: 'B', label: 'All bets' },
        ]}
      />
    </div>
  );
}
