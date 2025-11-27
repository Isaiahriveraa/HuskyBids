'use client';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDarkMode } from '@/app/contexts/DarkModeContext';

export default function BettingChart({ data, title = 'Betting History' }) {
  const { isDark } = useDarkMode();

  const colors = {
    line: isDark ? '#9B8DCE' : '#4B2E83',
    gradient: isDark ? ['#9B8DCE', '#7D6BC2'] : ['#4B2E83', '#7D6BC2'],
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#CBD5E1' : '#6B7280',
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.gradient[0]} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors.gradient[1]} stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="date"
            stroke={colors.text}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={colors.text}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
              borderRadius: '12px',
              color: isDark ? '#F1F5F9' : '#1F2937',
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.line}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
