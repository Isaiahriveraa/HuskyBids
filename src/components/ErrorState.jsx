/**
 * ErrorState Component
 * Standardized error display component with retry functionality
 * Replaces inconsistent error handling patterns across the app
 */

'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui';

export default function ErrorState({
  error,
  onRetry,
  title = 'Something went wrong',
  showReload = false,
  className = '',
}) {
  // Normalize error message from various sources
  const getErrorMessage = (err) => {
    if (typeof err === 'string') return err;
    if (err?.message) return err.message;
    if (err?.error) return err.error;
    if (err?.info?.error) return err.info.error;
    return 'An unexpected error occurred. Please try again.';
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-900 mb-1">
            {title}
          </h3>
          <p className="text-red-700 mb-4">
            {errorMessage}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {onRetry && (
              <Button
                variant="danger"
                size="sm"
                onClick={onRetry}
                className="inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {showReload && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ErrorStateInline - Compact inline error for small spaces
 */
export function ErrorStateInline({ error, onRetry, className = '' }) {
  const getErrorMessage = (err) => {
    if (typeof err === 'string') return err;
    if (err?.message) return err.message;
    if (err?.error) return err.error;
    return 'An error occurred';
  };

  return (
    <div className={`flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
        <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
      </div>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="ml-4 text-red-600 hover:text-red-800"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
