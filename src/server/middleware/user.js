/**
 * User Lookup Middleware
 * Automatically loads authenticated user from database
 * Requires withAuth and withDatabase to be used first
 */

import User from '@server/models/User';

/**
 * Middleware to load user from database
 * Requires req.userId to be set (use withAuth first)
 * Adds req.user to the request object
 *
 * @param {Function} handler - The API route handler to wrap
 * @returns {Function} Wrapped handler with user loaded
 *
 * @example
 * export default compose(
 *   withErrorHandler,
 *   withDatabase,
 *   withAuth,
 *   withUser
 * )(async (req, res) => {
 *   const user = req.user; // Fully loaded user document
 *   res.json({ biscuits: user.biscuits });
 * });
 */
export function withUser(handler) {
  return async (req, res) => {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID not found',
        message: 'Authentication required. Please ensure withAuth is applied before withUser.'
      });
    }

    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found in database. Please complete registration.'
      });
    }

    // Attach user to request for use in handler
    req.user = user;

    return handler(req, res);
  };
}
