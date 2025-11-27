/**
 * Authentication Middleware
 * Wraps API routes to ensure user is authenticated via Clerk
 */

import { getAuth } from '@clerk/nextjs/server';

/**
 * Middleware to verify user authentication
 * Adds req.userId if authenticated, returns 401 if not
 *
 * @param {Function} handler - The API route handler to wrap
 * @returns {Function} Wrapped handler with authentication check
 *
 * @example
 * export default withAuth(async (req, res) => {
 *   const userId = req.userId; // Available after auth check
 *   // ... your route logic
 * });
 */
export function withAuth(handler) {
  return async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource'
      });
    }

    // Attach userId to request for use in handler
    req.userId = userId;

    return handler(req, res);
  };
}
