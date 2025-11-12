/**
 * LoadingSpinner Component
 * UW-themed loading indicator
 */

'use client';

import React from 'react';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'purple',
  fullScreen = false,
  text = '',
  className = '',
  ...props 
}) => {
  // Size styles
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };
  
  // Color styles
  const colors = {
    purple: 'border-uw-purple-200 border-t-uw-purple',
    gold: 'border-uw-gold-200 border-t-uw-gold',
    white: 'border-white border-opacity-25 border-t-white',
  };
  
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div 
        className={`
          rounded-full animate-spin
          ${sizes[size]}
          ${colors[color]}
          ${className}
        `}
        {...props}
      />
      {text && (
        <p className="text-sm font-medium text-gray-600">{text}</p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

// Skeleton Loader Component
LoadingSpinner.Skeleton = ({ 
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
  className = '',
}) => (
  <div 
    className={`
      animate-pulse bg-gray-200
      ${width} ${height} ${rounded} ${className}
    `}
  />
);

// Spinner with UW Logo (for brand consistency)
LoadingSpinner.UWSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} relative`}>
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-uw-purple-200 border-t-uw-purple rounded-full animate-spin" />
        {/* Inner pulsing circle */}
        <div className="absolute inset-2 bg-uw-gold rounded-full animate-pulse-slow flex items-center justify-center">
          <span className="text-uw-purple font-bold text-2xl">W</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
