'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, Button, Badge, LoadingSpinner, Tabs } from '../Components/ui';
import BiscuitIcon from '../Components/BiscuitIcon';
import ErrorState from '../Components/ErrorState';
import { formatDateTime } from '@/lib/date-utils';
import { exportBettingHistoryToCSV } from '@/lib/export-utils';
import BettingDistributionChart from '../Components/charts/BettingDistributionChart';
import BettingTrendChart from '../Components/charts/BettingTrendChart';
import SportActivityChart from '../Components/charts/SportActivityChart';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Calendar,
  Target,
  BarChart3,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function BettingHistoryPage() {
  const { user, isLoaded } = useUser();
  const [bets, setBets] = useState([]);
  const [stats, setStats] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(true);

  const fetchBettingHistory = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching betting history...');
      const response = await fetch(`/api/bets/history?status=${activeFilter}&sport=${sportFilter}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch betting history');
      }

      const data = await response.json();
      console.log('Betting history loaded:', { betsCount: data.bets?.length, stats: data.stats });
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
    console.log('Betting History - Auth state:', { isLoaded, hasUser: !!user });
    if (isLoaded && user) {
      fetchBettingHistory();
    } else if (isLoaded && !user) {
      console.warn('User not loaded - Clerk may not be initialized properly');
      setLoading(false);
    }
  }, [isLoaded, user, fetchBettingHistory]);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'lost':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <Ban className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  }, []);

  const getStatusBadge = useCallback((status) => {
    const variants = {
      won: 'success',
      lost: 'danger',
      pending: 'warning',
      cancelled: 'secondary',
      refunded: 'info',
    };
    return variants[status] || 'secondary';
  }, []);

  const handleExportCSV = useCallback(() => {
    if (!bets || !stats || !financial) {
      alert('No data available to export');
      return;
    }
    try {
      exportBettingHistoryToCSV(bets, stats, financial);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    }
  }, [bets, stats, financial]);

  // Show loading spinner only while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" variant="uw" />
        <p className="ml-3 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If user is not authenticated, Clerk middleware should redirect to login
  // But just in case, show a helpful message
  if (!user) {
    console.error('Betting History: User not authenticated but page loaded. This should not happen.');
    return (
      <div className="flex justify-center items-center min-h-screen p-6">
        <div className="max-w-md w-full">
          <ErrorState
            title="Authentication Error"
            error="There was an issue loading your authentication. Please try refreshing the page or signing in again."
            showReload={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-uw-purple-900">Betting History</h1>
          <p className="text-gray-600 mt-1">Track all your bets and performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            disabled={loading || bets.length === 0}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showAnalytics ? 'Hide' : 'Show'} Analytics
            {showAnalytics ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            disabled={loading || bets.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Show loading state while fetching data */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" variant="uw" />
          <p className="ml-3 text-gray-600">Loading your betting history...</p>
        </div>
      )}

      {/* Show error if any */}
      {error && !loading && (
        <ErrorState
          title="Error Loading Betting History"
          error={error}
          onRetry={fetchBettingHistory}
        />
      )}

      {/* Show content when loaded successfully */}
      {!loading && !error && financial && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="elevated">
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Wagered</p>
                    <p className="text-2xl font-bold text-uw-purple-900 flex items-center gap-1">
                      <BiscuitIcon size={24} />
                      {financial.totalWagered.toLocaleString()}
                    </p>
                  </div>
                  <Target className="w-10 h-10 text-uw-purple-400" />
                </div>
              </Card.Body>
            </Card>

            <Card variant="elevated">
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Net Profit</p>
                    <p className={`text-2xl font-bold flex items-center gap-1 ${financial.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {financial.netProfit >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                      <BiscuitIcon size={24} />
                      {Math.abs(financial.netProfit).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card variant="elevated">
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Win Rate</p>
                    <p className="text-2xl font-bold text-uw-purple-900">
                      {stats?.total > 0 ? ((stats.won / (stats.won + stats.lost || 1)) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-uw-gold-500" />
                </div>
              </Card.Body>
            </Card>

            <Card variant="elevated">
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className={`text-2xl font-bold ${parseFloat(financial.roi) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {financial.roi}%
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Analytics Section with Charts */}
          {showAnalytics && bets.length > 0 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-uw-purple-900">
                <BarChart3 className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BettingTrendChart bets={bets} />
                <BettingDistributionChart stats={stats} />
              </div>
              <div className="grid grid-cols-1">
                <SportActivityChart bets={bets} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {stats && (
          <Tabs variant="pills" activeTab={activeFilter} onChange={setActiveFilter}>
            <Tabs.Tab id="all">All ({stats.total})</Tabs.Tab>
            <Tabs.Tab id="pending">Pending ({stats.pending})</Tabs.Tab>
            <Tabs.Tab id="won">Won ({stats.won})</Tabs.Tab>
            <Tabs.Tab id="lost">Lost ({stats.lost})</Tabs.Tab>
          </Tabs>
        )}

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sport:</label>
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Sports</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" variant="uw" />
        </div>
      )}

      {!loading && bets.length === 0 && (
        <Card variant="outline" className="text-center py-12">
          <Card.Body>
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bets yet</h3>
            <p className="text-gray-600 mb-4">Start betting on UW games to see your history here!</p>
            <Button variant="primary" onClick={() => window.location.href = '/games'}>Browse Games</Button>
          </Card.Body>
        </Card>
      )}

      {!loading && bets.length > 0 && (
        <div className="space-y-4">
          {bets.map((bet) => {
            const game = bet.gameId;
            if (!game) return null;

            const isUWHome = game.homeTeam === 'Washington Huskies';
            const betOnUW = (bet.predictedWinner === 'home' && isUWHome) || (bet.predictedWinner === 'away' && !isUWHome);

            return (
              <Card key={bet._id} variant="outline" className="hover:shadow-lg transition-shadow">
                <Card.Body>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-1 flex justify-center">{getStatusIcon(bet.status)}</div>

                    <div className="md:col-span-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" size="sm">{game.sport === 'football' ? '🏈' : '🏀'}</Badge>
                        <Badge variant={getStatusBadge(bet.status)} size="sm">{bet.status}</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900">{game.homeTeam} vs {game.awayTeam}</h3>
                      <p className="text-sm text-gray-600">{formatDateTime(game.gameDate)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Bet on: {betOnUW ? '🐺 UW' : bet.predictedWinner === 'home' ? game.homeTeam : game.awayTeam}
                      </p>
                    </div>

                    <div className="md:col-span-3 text-center">
                      <p className="text-xs text-gray-600">Bet Amount</p>
                      <p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                        <BiscuitIcon size={18} />
                        {bet.betAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Odds: {bet.odds.toFixed(2)}x</p>
                    </div>

                    <div className="md:col-span-3 text-center">
                      <p className="text-xs text-gray-600">
                        {bet.status === 'pending' ? 'Potential Win' : 'Result'}
                      </p>
                      <p className={`text-lg font-bold flex items-center justify-center gap-1 ${
                        bet.status === 'won' ? 'text-green-600' : bet.status === 'lost' ? 'text-red-600' : 'text-uw-purple-700'
                      }`}>
                        <BiscuitIcon size={18} />
                        {bet.status === 'won' 
                          ? `+${bet.actualWin.toLocaleString()}`
                          : bet.status === 'lost' ? `-${bet.betAmount.toLocaleString()}` : bet.potentialWin.toLocaleString()}
                      </p>
                      {bet.status === 'won' && (
                        <p className="text-xs text-green-600 font-semibold mt-1">
                          Profit: +{(bet.actualWin - bet.betAmount).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {game.status === 'completed' && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-center gap-6 text-sm">
                        <span className={`font-semibold ${game.winner === 'home' ? 'text-green-600' : 'text-gray-600'}`}>
                          {game.homeTeam}: {game.homeScore}
                        </span>
                        <span className="text-gray-400">Final</span>
                        <span className={`font-semibold ${game.winner === 'away' ? 'text-green-600' : 'text-gray-600'}`}>
                          {game.awayTeam}: {game.awayScore}
                        </span>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}

      {/* Show when no bets exist */}
      {!loading && !error && bets.length === 0 && (
        <Card variant="outline" className="text-center py-12">
          <Card.Body>
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Betting History Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any bets yet. Start betting on UW games to see your history here!
            </p>
            <Button onClick={() => window.location.href = '/games'}>
              Browse Games
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
