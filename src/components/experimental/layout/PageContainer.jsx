/**
 * PageContainer - Content wrapper
 * Provides consistent padding and max-width
 * 
 * @example
 * <PageContainer>{children}</PageContainer>
 */
'use client';

import { cn } from '@/shared/utils';

export default function PageContainer({ 
  children, 
  className,
  ...props 
}) {
  return (
    <main 
      className={cn(
        'max-w-lg lg:max-w-2xl mx-auto px-6 lg:px-8 pb-24 lg:pb-12',
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
