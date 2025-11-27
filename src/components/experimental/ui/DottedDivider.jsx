/**
 * DottedDivider - Visual separator
 * Consistent dotted border divider for sections
 * 
 * @example
 * <DottedDivider />
 * <DottedDivider spacing="lg" />
 */
'use client';

import { cn } from '@/shared/utils';

const spacingClasses = {
  none: '',
  sm: 'my-4',
  md: 'my-6',
  lg: 'my-10',
};

export default function DottedDivider({ 
  spacing = 'none',
  className,
  ...props 
}) {
  return (
    <div 
      className={cn(
        'border-t border-dotted border-zinc-800',
        spacingClasses[spacing],
        className
      )}
      role="separator"
      {...props}
    />
  );
}
