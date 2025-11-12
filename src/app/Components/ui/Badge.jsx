/**
 * Badge Component
 * Display status indicators, labels, and counts
 * Supports: success, error, warning, info, purple, gold variants
 */

'use client';

import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center font-semibold';
  
  // Variant styles
  const variants = {
    default: 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-600',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-600',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600',
    purple: 'bg-uw-purple-100 dark:bg-uw-purple-900/30 text-uw-purple-800 dark:text-uw-purple-300 border border-uw-purple-300 dark:border-uw-purple-600',
    gold: 'bg-uw-gold-100 dark:bg-uw-gold-900/30 text-uw-gold-800 dark:text-uw-gold-300 border border-uw-gold-400 dark:border-uw-gold-600',
    'purple-solid': 'bg-uw-purple-600 dark:bg-uw-purple-500 text-white shadow-md shadow-uw-purple-500/30',
    'gold-solid': 'bg-uw-gold-500 dark:bg-uw-gold-600 text-uw-dark shadow-md shadow-uw-gold-500/30',
  };
  
  // Size styles
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  
  // Rounded styles
  const roundedStyle = rounded ? 'rounded-full' : 'rounded';
  
  // Combine classes
  const badgeClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${roundedStyle}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;
