/**
 * BalanceDisplay - User balance display
 * Large, prominent balance display with label
 * 
 * @example
 * <BalanceDisplay balance={24500} label="Balance" />
 */
'use client';

import SectionLabel from './SectionLabel';

export default function BalanceDisplay({ 
  balance = 0,
  label = 'Balance',
  className = '',
}) {
  const formattedBalance = typeof balance === 'number' 
    ? balance.toLocaleString() 
    : balance;

  return (
    <div className={className}>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-4xl font-light tracking-tight">{formattedBalance}</p>
    </div>
  );
}
