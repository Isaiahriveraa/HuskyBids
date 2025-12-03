'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  SectionLabel,
  DottedDivider,
  StatCard,
  BetHistoryRow,
  Kbd,
  ActionBar,
  LoadingScreen,
} from '@/components/experimental';
import { formatDateTime } from '@shared/utils/date-utils';

export default function BettingHistoryPage() {
  const { user, isLoaded } = useUser();
  const [bets, setBets] = useState([]);
  const [stats, setStats] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');

  const fetchBettingHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bets/history?status=${activeFilter}&sport=${sportFilter}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch betting history');
      }

      const data = await response.json();
      setBets(data.bets || []);
      setStats(data.stats);
      setFinancial(data.financial);
      setError(null);
    } catch (err) {
      console.error('Error fetching betting history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, sportFilter]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchBettingHistory();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user, fetchBettingHistory]);

  // Loading state
  if (!isLoaded || loading) {
    return <LoadingScreen message="history" />;
  }

  // Auth error
  if (!user) {
    return (
      <div className="py-8 font-mono">
        <SectionLabel>Error</SectionLabel>
        <p className="text-zinc-500 text-sm mt-2">Authentication required</p>
        <Link href="/login" className="mt-4 text-xs text-zinc-600 hover:text-zinc-400 underline">
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
        <p className="text-zinc-500 text-sm mt-2">{error}</p>
        <button 
          onClick={fetchBettingHistory}
          className="mt-4 text-xs text-zinc-600 hover:text-zinc-400 underline"
        >
          Try again
        </button>
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
      {bets.length === 0 ? (
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
