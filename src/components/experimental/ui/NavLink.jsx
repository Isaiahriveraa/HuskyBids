/**
 * NavLink - Navigation link with keyboard hint
 * Displays both the keyboard shortcut and label
 * 
 * @example
 * <NavLink href="/games" shortcut="G" active>Games</NavLink>
 */
'use client';

import Link from 'next/link';
import { cn } from '@/shared/utils';
import Kbd from './Kbd';

export default function NavLink({ 
  href, 
  shortcut, 
  children, 
  active = false,
  variant = 'default', // 'default' | 'sidebar' | 'mobile'
  className,
  ...props 
}) {
  const variants = {
    default: cn(
      'flex items-center gap-3 py-3 px-6 transition-colors',
      active 
        ? 'text-white bg-zinc-900/50' 
        : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/30'
    ),
    sidebar: cn(
      'flex items-center gap-3 py-3 px-6 transition-colors',
      active 
        ? 'text-white bg-zinc-900/50' 
        : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/30'
    ),
    mobile: cn(
      'flex flex-col items-center gap-1.5 py-1'
    ),
  };

  return (
    <Link
      href={href}
      className={cn(variants[variant], className)}
      {...props}
    >
      <Kbd active={active}>{shortcut}</Kbd>
      {variant === 'mobile' ? (
        <span className={cn(
          'text-[9px] uppercase tracking-wider transition-colors',
          active ? 'text-zinc-400' : 'text-zinc-700'
        )}>
          {children}
        </span>
      ) : (
        <span className="text-sm">{children}</span>
      )}
    </Link>
  );
}
