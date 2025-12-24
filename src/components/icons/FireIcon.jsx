/**
 * FireIcon Component
 * Modern, clean flame icon
 */

'use client';

import { memo } from 'react';

const FireIcon = memo(function FireIcon({
  size = 16,
  className = '',
  variant = 'default'
}) {
  const sizeValue = typeof size === 'number' ? size : 16;

  const variants = {
    default: {
      id: 'flame-default',
      colors: ['#fcd34d', '#f97316', '#dc2626'],
      inner: '#fef3c7',
    },
    subtle: {
      id: 'flame-subtle',
      colors: ['#fdba74', '#ea580c', '#b91c1c'],
      inner: '#fed7aa',
    },
    intense: {
      id: 'flame-intense',
      colors: ['#fef08a', '#fbbf24', '#ea580c'],
      inner: '#fffbeb',
    },
    mono: {
      id: 'flame-mono',
      colors: ['#d4d4d8', '#71717a', '#3f3f46'],
      inner: '#f4f4f5',
    }
  };

  const colors = variants[variant] || variants.default;

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      role="img"
      aria-label="Fire icon"
      shapeRendering="crispEdges"
    >
      {/* Red (Base & Embers) */}
      <path
        d="M7 19h2v2h-2z M9 20h6v2h-6z M15 19h2v2h-2z M6 16h2v2h-2z M17 14h2v2h-2z M12 5h2v2h-2z"
        fill={colors.colors[2]}
      />
      
      {/* Orange (Flame Body) */}
      <path
        d="M9 14h2v5h-2z M11 9h2v10h-2z M13 13h2v6h-2z M10 7h2v2h-2z"
        fill={colors.colors[1]}
      />

      {/* Yellow (Core Heat) */}
      <path
        d="M11 15h2v3h-2z"
        fill={colors.colors[0]}
      />
    </svg>
  );
});

// Animated version
FireIcon.Animated = memo(function AnimatedFireIcon({
  size = 16,
  className = '',
  variant = 'intense'
}) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes flame-dance {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.05) translateY(-1px); }
        }
        .flame-dance {
          animation: flame-dance 0.8s steps(2) infinite;
          transform-origin: center bottom;
        }
      `}</style>
      <div className="flame-dance">
        <FireIcon size={size} variant={variant} />
      </div>
    </div>
  );
});

// Streak counter
FireIcon.Streak = memo(function FireStreak({
  count = 0,
  size = 16,
  showCount = true,
  className = ''
}) {
  const getVariant = (n) => {
    if (n >= 7) return 'intense';
    if (n >= 3) return 'default';
    return 'subtle';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <FireIcon size={size} variant={getVariant(count)} />
      {showCount && (
        <span className="text-orange-400 font-mono text-sm font-semibold tabular-nums">
          {count}
        </span>
      )}
    </div>
  );
});

export default FireIcon;
