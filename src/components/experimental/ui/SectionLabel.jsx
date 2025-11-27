/**
 * SectionLabel - Uppercase tiny label
 * Used for section headers in the minimal design
 * 
 * @example
 * <SectionLabel>Balance</SectionLabel>
 * <SectionLabel>Quick bets</SectionLabel>
 */
'use client';

import { cn } from '@/shared/utils';

export default function SectionLabel({ 
  children, 
  className,
  ...props 
}) {
  return (
    <p 
      className={cn(
        'text-[10px] text-zinc-600 uppercase tracking-[0.2em] mb-2 font-mono',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
