/**
 * Input Component
 * Form input field with validation states
 * Supports: text, email, password, number types
 */

'use client';

import React from 'react';

const Input = ({ 
  type = 'text',
  label = '',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  leftIcon = null,
  rightIcon = null,
  fullWidth = true,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  // Base input styles
  const baseStyles = 'px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20 text-gray-900 dark:text-gray-100';

  // Conditional styles
  const errorStyles = error
    ? 'border-red-500 dark:border-red-600 focus:border-red-500 dark:focus:border-red-600 focus:ring-red-500 dark:focus:ring-red-600'
    : 'border-gray-300 dark:border-slate-600 focus:border-uw-purple-600 dark:focus:border-uw-purple-400 focus:ring-uw-purple-600 dark:focus:ring-uw-purple-400';

  const disabledStyles = disabled ? 'bg-gray-100 dark:bg-slate-800 cursor-not-allowed opacity-60' : 'bg-white dark:bg-slate-700';
  const widthStyle = fullWidth ? 'w-full' : '';
  const paddingLeft = leftIcon ? 'pl-12' : 'pl-4';
  const paddingRight = rightIcon ? 'pr-12' : 'pr-4';
  
  // Combine classes
  const inputClasses = `
    ${baseStyles}
    ${errorStyles}
    ${disabledStyles}
    ${widthStyle}
    ${paddingLeft}
    ${paddingRight}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className={fullWidth ? 'w-full' : 'inline-block'}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
