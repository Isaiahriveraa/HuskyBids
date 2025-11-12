/**
 * Button Component
 * A flexible, accessible button component with multiple variants
 * Supports: primary, secondary, gold, ghost, danger styles
 */

'use client';

import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform active:scale-95';

  // Variant styles with dark mode support
  const variants = {
    primary: 'bg-gradient-to-r from-uw-purple-500 to-uw-purple-700 dark:from-uw-purple-400 dark:to-uw-purple-600 text-white shadow-lg shadow-uw-purple-500/50 dark:shadow-uw-purple-400/30 hover:shadow-xl hover:shadow-uw-purple-600/50 dark:hover:shadow-uw-purple-500/40 hover:scale-105 focus:ring-uw-purple-500/50 dark:focus:ring-uw-purple-400/50',

    secondary: 'bg-gradient-to-r from-uw-purple-100 to-uw-purple-200 dark:from-uw-purple-900/30 dark:to-uw-purple-800/30 text-uw-purple-800 dark:text-uw-purple-200 border-2 border-uw-purple-200 dark:border-uw-purple-700 hover:from-uw-purple-200 hover:to-uw-purple-300 dark:hover:from-uw-purple-800/40 dark:hover:to-uw-purple-700/40 shadow-md hover:shadow-lg focus:ring-uw-purple-400/50',

    gold: 'bg-gradient-to-r from-uw-gold-400 to-uw-gold-500 dark:from-uw-gold-500 dark:to-uw-gold-600 text-uw-dark dark:text-uw-dark font-bold shadow-lg shadow-uw-gold-500/30 dark:shadow-uw-gold-600/30 hover:shadow-xl hover:scale-105 focus:ring-uw-gold/50',

    ghost: 'bg-transparent hover:bg-uw-purple-50 dark:hover:bg-uw-purple-900/20 text-uw-purple-700 dark:text-uw-purple-300 focus:ring-uw-purple-300/50 dark:focus:ring-uw-purple-600/50',

    danger: 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-lg shadow-red-500/30 dark:shadow-red-600/30 hover:shadow-xl focus:ring-red-500/50',

    success: 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white shadow-lg shadow-green-500/30 dark:shadow-green-600/30 hover:shadow-xl focus:ring-green-500/50',

    outline: 'bg-transparent border-2 border-uw-purple-600 dark:border-uw-purple-400 text-uw-purple-700 dark:text-uw-purple-300 hover:bg-uw-purple-50 dark:hover:bg-uw-purple-900/20 focus:ring-uw-purple-300/50 dark:focus:ring-uw-purple-600/50'
  };

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  // Width styles
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combine classes
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${widthStyle}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-3 h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      {children}
      
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
