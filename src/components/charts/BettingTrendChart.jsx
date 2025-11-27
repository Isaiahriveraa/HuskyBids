'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '../ui';
import BiscuitIcon from '../BiscuitIcon';

export default function BettingTrendChart({ bets }) {
  if (!bets || bets.length === 0) {
    return (
      <Card variant="outline" className="h-[350px] flex items-center justify-center">
        <Card.Body>
          <p className="text-gray-500 text-center">No betting data available yet</p>
        </Card.Body>
      </Card>
    );
  }

  // Sort bets by date (oldest first)
  const sortedBets = [...bets]
    .filter(bet => bet.gameId && bet.placedAt)
    .sort((a, b) => new Date(a.placedAt) - new Date(b.placedAt));

  // Calculate cumulative profit over time
  let cumulativeProfit = 0;
  const trendData = sortedBets.map((bet, index) => {
    let profitLoss = 0;

    if (bet.status === 'won') {
      profitLoss = bet.actualWin - bet.betAmount;
    } else if (bet.status === 'lost') {
      profitLoss = -bet.betAmount;
    }
    // pending and cancelled bets don't affect profit yet

    cumulativeProfit += profitLoss;

    return {
      date: new Date(bet.placedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      profit: cumulativeProfit,
      betNumber: index + 1,
      betAmount: bet.betAmount,
      status: bet.status,
      game: bet.gameId ? `${bet.gameId.homeTeam} vs ${bet.gameId.awayTeam}` : 'Unknown',
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.date}</p>
          <p className="text-sm text-gray-600 mb-1">Bet #{data.betNumber}</p>
          <p className="text-xs text-gray-500 mb-2">{data.game}</p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-gray-600">Cumulative Profit:</span>
            <BiscuitIcon size={14} />
            <span className={`font-semibold ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.profit >= 0 ? '+' : ''}{data.profit.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Determine if overall trend is positive
  const isPositive = cumulativeProfit >= 0;

  return (
    <Card variant="outline">
      <Card.Body>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Total:</span>
            <BiscuitIcon size={16} />
            <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{cumulativeProfit.toLocaleString()}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="profit"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
