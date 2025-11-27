/**
 * StatCard - Minimal stat display component
 * Simple label + large value with optional trend indicator
 * 
 * @example
 * <StatCard label="Balance" value={24500} />
 * <StatCard label="Win Rate" value="67%" trend="+5%" trendUp />
 * <StatCard label="Profit" value={-150} prefix="" negative />
 */
'use client';

import { cn } from '@/shared/utils';

export default function StatCard({ 
  label,
  value,
  trend,
  trendUp,
  prefix = '',
  suffix = '',
  negative = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  // Format value if it's a number
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  const sizes = {
    sm: {
      label: 'text-[9px]',
      value: 'text-xl',
      trend: 'text-[10px]',
    },
    md: {
      label: 'text-[10px]',
      value: 'text-3xl',
      trend: 'text-xs',
    },
    lg: {
      label: 'text-xs',
      value: 'text-4xl',
      trend: 'text-sm',
    },
  };

  return (
    <div 
      className={cn(
        'py-4 px-5 border border-dotted border-zinc-800 font-mono',
        className
      )}
    >
      <p className={cn(
        'text-zinc-600 uppercase tracking-[0.2em] mb-2',
        sizes[size].label
      )}>
        {label}
      </p>
      <p className={cn(
        'font-light tracking-tight',
        sizes[size].value,
        negative ? 'text-zinc-500' : 'text-zinc-100'
      )}>
        {prefix}{formattedValue}{suffix}
      </p>
      {trend && (
        <p className={cn(
          'mt-1',
          sizes[size].trend,
          trendUp ? 'text-zinc-400' : 'text-zinc-600'
        )}>
          {trend}
        </p>
      )}
    </div>
  );
}
