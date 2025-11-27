'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { Card } from '../ui';
import BiscuitIcon from '../BiscuitIcon';

export default function SportActivityChart({ bets }) {
  if (!bets || bets.length === 0) {
    return (
      <Card variant="outline" className="h-[300px] flex items-center justify-center">
        <Card.Body>
          <p className="text-gray-500 text-center">No betting data available yet</p>
        </Card.Body>
      </Card>
    );
  }

  // Group bets by sport
  const sportStats = {};

  bets.forEach(bet => {
    if (!bet.gameId) return;

    const sport = bet.gameId.sport || 'unknown';
    if (!sportStats[sport]) {
      sportStats[sport] = {
        sport: sport.charAt(0).toUpperCase() + sport.slice(1),
        totalBets: 0,
        won: 0,
        lost: 0,
        pending: 0,
        totalWagered: 0,
        totalWon: 0,
      };
    }

    sportStats[sport].totalBets++;
    sportStats[sport].totalWagered += bet.betAmount;

    if (bet.status === 'won') {
      sportStats[sport].won++;
      sportStats[sport].totalWon += bet.actualWin;
    } else if (bet.status === 'lost') {
      sportStats[sport].lost++;
    } else if (bet.status === 'pending') {
      sportStats[sport].pending++;
    }
  });

  // Convert to array and calculate win rates
  const data = Object.values(sportStats).map(stat => ({
    ...stat,
    winRate: stat.won + stat.lost > 0
      ? ((stat.won / (stat.won + stat.lost)) * 100).toFixed(1)
      : 0,
    netProfit: stat.totalWon - (stat.totalWagered - (stat.pending * 0)), // Approximate, excluding pending
  }));

  const SPORT_COLORS = {
    Football: '#4c1d95', // UW Purple
    Basketball: '#f59e0b', // UW Gold
    Soccer: '#10b981',
    Baseball: '#3b82f6',
    Hockey: '#ef4444',
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{data.sport}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">Total Bets: <span className="font-semibold">{data.totalBets}</span></p>
            <p className="text-green-600">Won: <span className="font-semibold">{data.won}</span></p>
            <p className="text-red-600">Lost: <span className="font-semibold">{data.lost}</span></p>
            <p className="text-yellow-600">Pending: <span className="font-semibold">{data.pending}</span></p>
            <p className="text-gray-600">Win Rate: <span className="font-semibold">{data.winRate}%</span></p>
            <div className="flex items-center gap-1 text-gray-600">
              <span>Wagered:</span>
              <BiscuitIcon size={12} />
              <span className="font-semibold">{data.totalWagered.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="outline">
      <Card.Body>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Sport</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="sport"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Number of Bets', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="won" name="Won" stackId="a" fill="#10b981" />
            <Bar dataKey="lost" name="Lost" stackId="a" fill="#ef4444" />
            <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
