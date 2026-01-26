/**
 * HuskyBidsLoader - Animated text loading component
 * Letters chase each other in a wave pattern
 *
 * @example
 * <HuskyBidsLoader size="md" />
 * <HuskyBidsLoader size="xl" centered subtitle="Loading your account..." />
 */
'use client';

import { cn } from '@/shared/utils';

export default function HuskyBidsLoader({
  size = 'md',
  centered = false,
  subtitle = null,
  className
}) {
  const text = 'HuskyBids';
  const letters = text.split('');

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-3xl',
  };

  return (
    <div
      className={cn(
        'font-mono',
        centered && 'flex items-center justify-center',
        className
      )}
    >
      {/* Vertical flex container to stack HuskyBids + subtitle */}
      <div className="flex flex-col items-center gap-2">

        {/* Animated "HuskyBids" text */}
        <span className={cn('inline-flex', sizes[size])}>
          {letters.map((letter, index) => (
            <span
              key={index}
              className="animate-letter-chase inline-block"
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </span>

        {/* Conditionally render subtitle if provided */}
        {subtitle && (
          <p className="text-xs text-zinc-400 text-center">
            {subtitle}
          </p>
        )}

      </div>
    </div>
  );
}
