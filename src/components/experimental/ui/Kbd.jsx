/**
 * Kbd - Keyboard Key Indicator
 * Displays a keyboard-style hint for shortcuts
 * 
 * @example
 * <Kbd>H</Kbd>
 * <Kbd active>N</Kbd>
 * <Kbd size="sm">?</Kbd>
 */
'use client';

import { cn } from '@/shared/utils';

const sizeClasses = {
  xs: 'w-4 h-4 text-[8px]',
  sm: 'w-5 h-5 text-[9px]',
  md: 'w-6 h-6 text-[10px]',
  lg: 'w-7 h-7 text-xs',
};

export default function Kbd({ 
  children, 
  active = false, 
  size = 'sm',
  className,
  ...props 
}) {
  return (
    <kbd 
      className={cn(
        'flex items-center justify-center border transition-colors font-mono',
        sizeClasses[size],
        active 
          ? 'border-zinc-500 text-zinc-300' 
          : 'border-zinc-800 text-zinc-700',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
