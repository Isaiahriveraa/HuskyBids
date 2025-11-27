/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 * Prevents entire app from crashing due to component errors
 */

'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Store error info for display
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   logErrorToService(error, errorInfo);
    // }
  }

  handleReset = () => {
    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 * Displays user-friendly error message with retry option
 */
function ErrorFallback({ error, onReset }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-red-900 mb-2">
          Something went wrong
        </h2>

        <p className="text-red-700 mb-6">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="space-y-3">
          <Button
            variant="danger"
            onClick={onReset}
            className="w-full"
          >
            Try Again
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Reload Page
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 p-4 bg-red-900 text-red-100 rounded text-xs overflow-auto max-h-48">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default ErrorBoundary;
export { ErrorFallback };
