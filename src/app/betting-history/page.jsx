'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  SectionLabel,
  DottedDivider,
  StatCard,
  BetHistoryRow,
  Kbd,
  ActionBar,
} from '@/components/experimental';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatDateTime } from '@shared/utils/date-utils';

// SWR fetcher function
const fetcher = (url) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch betting history');
  return res.json();
});

export default function BettingHistoryPage() {
  const { user, isLoaded } = useUser();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');

  // Build cache key with filters
  const cacheKey = isLoaded && user
    ? `/api/bets/history?status=${activeFilter}&sport=${sportFilter}`
    : null;

  // Use SWR for data fetching with caching
  const { data, error, isLoading } = useSWR(cacheKey, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
    revalidateOnFocus: false,
  });

  const bets = data?.bets || [];
  const stats = data?.stats || null;
  const financial = data?.financial || null;
  const loading = isLoading || !isLoaded;

  // Auth error
  if (!user) {
    return (
      <div className="py-8 font-mono">
        <SectionLabel>Error</SectionLabel>
        <p className="text-zinc-500 text-sm mt-2">Authentication required</p>
        <Link href="/sign-up" className="mt-4 text-xs text-zinc-600 hover:text-zinc-400 underline">
          Sign in
        </Link>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 font-mono">
        <SectionLabel>Error</SectionLabel>
        <p className="text-zinc-500 text-sm mt-2">{error.message || 'Failed to load betting history'}</p>
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All', count: stats?.total || 0, key: 'A' },
    { id: 'pending', label: 'Pending', count: stats?.pending || 0, key: 'P' },
    { id: 'won', label: 'Won', count: stats?.won || 0, key: 'W' },
    { id: 'lost', label: 'Lost', count: stats?.lost || 0, key: 'L' },
  ];

  return (
    <div className="py-8 space-y-8 font-mono">
      {/* Header */}
      <div>
        <SectionLabel>Betting History</SectionLabel>
        <p className="text-zinc-600 text-xs mt-2">Track your bets and performance</p>
      </div>

      {/* Stats Grid */}
      {financial && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Wagered"
            value={financial.totalWagered || 0}
            size="sm"
          />
          <StatCard
            label="Net Profit"
            value={Math.abs(financial.netProfit || 0)}
            prefix={financial.netProfit >= 0 ? '+' : '-'}
            negative={financial.netProfit < 0}
            size="sm"
          />
          <StatCard
            label="Win Rate"
            value={stats?.total > 0 ? `${((stats.won / (stats.won + stats.lost || 1)) * 100).toFixed(0)}%` : '0%'}
            size="sm"
          />
          <StatCard
            label="ROI"
            value={`${financial.roi || 0}%`}
            negative={parseFloat(financial.roi) < 0}
            size="sm"
          />
        </div>
      )}

      <DottedDivider />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs border border-dotted transition-colors ${
              activeFilter === f.id
                ? 'border-zinc-600 text-zinc-300 bg-zinc-900/50'
                : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-500'
            }`}
          >
            <Kbd size="xs">{f.key}</Kbd>
            {f.label}
            <span className="text-zinc-700">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Sport Filter */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-zinc-600">Sport:</span>
        {['all', 'football', 'basketball'].map((sport) => (
          <button
            key={sport}
            onClick={() => setSportFilter(sport)}
            className={`px-2 py-1 transition-colors ${
              sportFilter === sport
                ? 'text-zinc-300'
                : 'text-zinc-700 hover:text-zinc-500'
            }`}
          >
            {sport === 'all' ? 'All' : sport.charAt(0).toUpperCase() + sport.slice(1)}
          </button>
        ))}
      </div>

      <DottedDivider />

      {/* Bets List */}
      {loading && bets.length === 0 ? (
        <div className="border border-dotted border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-400">
            <tbody>
              {[...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : bets.length === 0 ? (
        <div className="py-12 text-center border border-dotted border-zinc-800">
          <p className="text-zinc-600 text-sm">No bets found</p>
          <Link
            href="/games"
            className="text-zinc-500 text-xs hover:text-zinc-400 underline mt-2 inline-block"
          >
            Browse games to place bets
          </Link>
        </div>
      ) : (
        <div className="border border-dotted border-zinc-800">
          {bets.map((bet) => {
            const game = bet.gameId;
            if (!game) return null;

            const gameTitle = `${game.homeTeam?.replace(' Huskies', '').replace(' Washington', 'UW') || 'TBD'} v ${game.awayTeam?.replace(' Huskies', '').replace(' Washington', 'UW') || 'TBD'}`;
            const prediction = bet.predictedWinner === 'home'
              ? game.homeTeam?.replace(' Huskies', '').replace(' Washington', 'UW')
              : game.awayTeam?.replace(' Huskies', '').replace(' Washington', 'UW');

            return (
              <BetHistoryRow
                key={bet._id}
                game={gameTitle}
                prediction={prediction || bet.predictedWinner}
                amount={bet.betAmount}
                odds={bet.odds}
                status={bet.status}
                payout={bet.status === 'won' ? bet.actualWin : undefined}
                date={formatDateTime(game.gameDate)}
              />
            );
          })}
        </div>
      )}

      <DottedDivider />

      {/* Actions */}
      <ActionBar
        actions={[
          { key: 'G', label: 'Games' },
          { key: 'D', label: 'Dashboard' },
        ]}
      />
    </div>
  );
}
