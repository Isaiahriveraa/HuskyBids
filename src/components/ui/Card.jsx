/**
 * Card Component
 * A versatile card component for content organization
 * Supports: different variants, hover effects, and padding options
 */

'use client';

import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hoverable = true,
  className = '',
  onClick,
  ...props 
}) => {
  // Base styles
  const baseStyles = 'bg-white dark:bg-slate-800 rounded-xl overflow-hidden transition-all duration-300';

  // Variant styles
  const variants = {
    default: 'shadow-md dark:shadow-slate-900/50',
    elevated: 'shadow-xl dark:shadow-slate-900/70',
    outlined: 'border-2 border-uw-purple-200 dark:border-uw-purple-700 shadow-sm dark:shadow-slate-900/30',
    gold: 'border-2 border-uw-gold dark:border-uw-gold-600 bg-gradient-to-br from-uw-gold-50 to-uw-gold-100 dark:from-uw-gold-900/20 dark:to-uw-gold-800/20',
    flat: 'shadow-none border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900',
  };

  // Hover effect
  const hoverEffect = hoverable ? 'hover:shadow-2xl dark:hover:shadow-slate-900/80 hover:-translate-y-1 cursor-pointer' : '';
  
  // Padding options
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  // Combine classes
  const cardClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${hoverEffect}
    ${paddings[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 ${className}`}>
    {children}
  </div>
);
CardHeader.displayName = 'Card.Header';
Card.Header = CardHeader;

// Card Body Component
const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);
CardBody.displayName = 'Card.Body';
Card.Body = CardBody;

// Card Footer Component
const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);
CardFooter.displayName = 'Card.Footer';
Card.Footer = CardFooter;

export default Card;
