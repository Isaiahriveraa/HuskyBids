'use client';

import { useState } from 'react';
import { useUserContext } from '../../contexts/UserContext';
import {
  SectionLabel,
  DottedDivider,
  ActionBar,
} from '@/components/experimental';

export default function SettleBetsPage() {
  const { user, refreshUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [balanceBefore, setBalanceBefore] = useState(null);
  const [balanceAfter, setBalanceAfter] = useState(null);

  const handleSettleAll = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Save balance before settlement
      const before = user?.biscuits || 0;
      setBalanceBefore(before);
      console.log('Balance before settlement:', before);

      const response = await fetch('/api/bets/settle-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to settle bets');
      }

      setResult(data);

      // Refresh user data to update balance in header
      console.log('Settlement complete, refreshing user data...');
      await refreshUser();

      // Small delay to ensure state has updated
      setTimeout(() => {
        const after = user?.biscuits || 0;
        setBalanceAfter(after);
        console.log('Balance after settlement:', after);
        console.log('Balance change:', after - before);
      }, 500);
    } catch (err) {
      console.error('Error settling bets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 space-y-6 font-mono">
      {/* Header */}
      <div>
        <SectionLabel>Settle Bets</SectionLabel>
        <p className="text-zinc-600 text-xs mt-1">Process all pending bets for completed games</p>
      </div>

      <DottedDivider />

      {/* Settle Button */}
      <div className="space-y-4">
        <button
          onClick={handleSettleAll}
          disabled={loading}
          className="w-full py-3 border border-dotted border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-sm disabled:opacity-50"
        >
          {loading ? 'Settling...' : 'Settle All Pending Bets'}
        </button>

        {error && (
          <div className="p-4 border border-dotted border-red-900 bg-red-950/20">
            <div className="text-xs text-red-500 font-bold mb-1">Error</div>
            <div className="text-xs text-red-400">{error}</div>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="p-4 border border-dotted border-green-900 bg-green-950/20">
              <div className="text-xs text-green-500 font-bold mb-2">Settlement Complete</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-600">Games Processed:</span>
                  <span className="text-zinc-300 ml-2">{result.gamesProcessed}</span>
                </div>
                <div>
                  <span className="text-zinc-600">Bets Settled:</span>
                  <span className="text-zinc-300 ml-2">{result.betsSettled}</span>
                </div>
                <div>
                  <span className="text-zinc-600">Won:</span>
                  <span className="text-green-400 ml-2">{result.won}</span>
                </div>
                <div>
                  <span className="text-zinc-600">Lost:</span>
                  <span className="text-red-400 ml-2">{result.lost}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-600">Total Payout:</span>
                  <span className="text-zinc-300 ml-2">{result.totalPayout.toLocaleString()} biscuits</span>
                </div>
                {balanceBefore !== null && balanceAfter !== null && (
                  <div className="col-span-2 pt-2 border-t border-dotted border-zinc-800">
                    <span className="text-zinc-600">Your Balance Change:</span>
                    <span className="text-zinc-300 ml-2">
                      {balanceBefore.toLocaleString()} → {balanceAfter.toLocaleString()}
                      <span className={balanceAfter > balanceBefore ? 'text-green-400 ml-2' : 'text-zinc-500 ml-2'}>
                        ({balanceAfter > balanceBefore ? '+' : ''}{(balanceAfter - balanceBefore).toLocaleString()})
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Per-game results */}
            {result.games && result.games.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-zinc-600 mb-2">Game Details:</div>
                {result.games.map((game, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-dotted border-zinc-800 text-xs"
                  >
                    <div className="text-zinc-400 mb-1">
                      {game.homeTeam} vs {game.awayTeam}
                    </div>
                    <div className="flex gap-4 text-zinc-600">
                      <span>Winner: {game.winner === 'home' ? game.homeTeam : game.awayTeam}</span>
                      <span>Bets: {game.betsSettled}</span>
                      <span className="text-green-500">Won: {game.won}</span>
                      <span className="text-red-500">Lost: {game.lost}</span>
                      <span>Payout: {game.payout.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <DottedDivider />

      {/* Actions */}
      <ActionBar
        actions={[
          { key: 'D', label: 'Dashboard' },
          { key: 'G', label: 'Games' },
          { key: 'B', label: 'All bets' },
        ]}
      />
    </div>
  );
}
