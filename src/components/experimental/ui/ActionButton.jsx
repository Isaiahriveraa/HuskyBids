/**
 * ActionButton - CTA button with keyboard hint
 * Primary action button with dotted border style
 * 
 * @example
 * <ActionButton href="/new-bid" shortcut="N">New bet</ActionButton>
 * <ActionButton onClick={handleClick} shortcut="S">Save</ActionButton>
 */
'use client';

import Link from 'next/link';
import { cn } from '@/shared/utils';
import Kbd from './Kbd';

export default function ActionButton({ 
  href, 
  shortcut, 
  children, 
  onClick,
  variant = 'default', // 'default' | 'primary' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  className,
  ...props 
}) {
  const variants = {
    default: 'border border-dotted border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50 text-zinc-400 hover:text-white',
    primary: 'border border-dotted border-zinc-600 hover:border-zinc-400 bg-zinc-900/30 text-zinc-300 hover:text-white',
    ghost: 'border border-transparent hover:border-zinc-800 text-zinc-600 hover:text-zinc-400',
  };

  const sizes = {
    sm: 'py-2 px-3 text-xs gap-1.5',
    md: 'py-3 px-4 text-sm gap-2',
    lg: 'py-4 px-6 text-base gap-3',
  };

  const buttonClass = cn(
    'flex items-center justify-center transition-all font-mono',
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      {shortcut && <Kbd size="xs">{shortcut}</Kbd>}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClass} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClass} {...props}>
      {content}
    </button>
  );
}
