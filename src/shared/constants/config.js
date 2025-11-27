/**
 * Application Configuration Constants
 * Single source of truth for app-wide configuration values
 */

// Server Configuration
export const PORT = parseInt(process.env.PORT || '3002', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Base URL Configuration
export const BASE_URL =
  NODE_ENV === 'development'
    ? `http://localhost:${PORT}`
    : process.env.NEXT_PUBLIC_APP_URL || 'https://huskybids.vercel.app';

/**
 * Get the base URL for API calls
 * @returns {string} Base URL
 */
export function getBaseUrl() {
  return BASE_URL;
}

/**
 * Check if running in development mode
 * @returns {boolean}
 */
export function isDevelopment() {
  return NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 * @returns {boolean}
 */
export function isProduction() {
  return NODE_ENV === 'production';
}
