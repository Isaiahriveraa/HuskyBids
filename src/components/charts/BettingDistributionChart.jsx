'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '../ui';

const COLORS = {
  won: '#10b981', // green
  lost: '#ef4444', // red
  pending: '#f59e0b', // amber
  cancelled: '#6b7280', // gray
};

export default function BettingDistributionChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: 'Won', value: stats.won, color: COLORS.won },
    { name: 'Lost', value: stats.lost, color: COLORS.lost },
    { name: 'Pending', value: stats.pending, color: COLORS.pending },
    { name: 'Cancelled', value: stats.cancelled || 0, color: COLORS.cancelled },
  ].filter(item => item.value > 0);

  // If no data, show empty state
  if (data.length === 0 || stats.total === 0) {
    return (
      <Card variant="outline" className="h-[300px] flex items-center justify-center">
        <Card.Body>
          <p className="text-gray-500 text-center">No betting data available yet</p>
        </Card.Body>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / stats.total) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} bets ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry) => {
    const percentage = ((entry.value / stats.total) * 100).toFixed(0);
    return `${percentage}%`;
  };

  return (
    <Card variant="outline">
      <Card.Body>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bet Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry) => `${value}: ${entry.payload.value}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
