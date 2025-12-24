/**
 * BiscuitIcon Component
 * Custom icon for the HuskyBids currency
 * Supports multiple sizes and animation variants
 */

'use client';

import { useState, memo } from 'react';
import Image from 'next/image';

const BiscuitIcon = memo(function BiscuitIcon({
  size = 24,
  animate = false,
  className = ''
}) {
  const [imageError, setImageError] = useState(false);
  const animationClass = animate ? 'animate-bounce-slow' : '';

  return (
    <div
      className={`inline-flex items-center justify-center ${animationClass} ${className}`}
      style={{ width: size, height: size }}
    >
      {!imageError ? (
        <Image
          src="/images/biscuit.png"
          alt="Biscuit"
          width={size}
          height={size}
          className="object-contain drop-shadow-md"
          onError={() => setImageError(true)}
        />
      ) : (
        <span
          className="text-center leading-none font-bold text-xs text-uw-gold"
          style={{ fontSize: Math.max(10, size * 0.4) }}
          role="img"
          aria-label="Points"
        >
          Pts
        </span>
      )}
    </div>
  );
});

// Biscuit Balance Display Component
BiscuitIcon.Balance = memo(function BiscuitBalance({ amount, size = 24, showLabel = true, className = '' }) {
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <BiscuitIcon size={size} animate={false} />
      <span className="font-bold text-uw-gold text-lg">
        {amount?.toLocaleString() || 0}
      </span>
      {showLabel && (
        <span className="text-sm text-gray-600">pts</span>
      )}
    </div>
  );
});

// Animated Biscuit Rain (for big wins)
BiscuitIcon.Rain = memo(function BiscuitRain({ count = 10 }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1000}ms`,
            animationDuration: `${2000 + Math.random() * 1000}ms`,
          }}
        >
          <BiscuitIcon size={32} />
        </div>
      ))}
    </div>
  );
});

export default BiscuitIcon; 