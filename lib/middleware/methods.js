/**
 * HTTP Method Validation Middleware
 * Restricts API routes to specific HTTP methods
 */

/**
 * Middleware to validate HTTP methods
 * Returns 405 if method is not allowed
 *
 * @param {string[]} allowedMethods - Array of allowed HTTP methods (e.g., ['GET', 'POST'])
 * @returns {Function} Middleware function that validates methods
 *
 * @example
 * export default compose(
 *   withErrorHandler,
 *   withMethods(['POST']),
 *   withDatabase,
 *   withAuth
 * )(async (req, res) => {
 *   // Only POST requests reach here
 * });
 */
export function withMethods(allowedMethods) {
  return (handler) => {
    return async (req, res) => {
      if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`,
          allowedMethods,
          message: `This endpoint only accepts: ${allowedMethods.join(', ')}`
        });
      }
      return handler(req, res);
    };
  };
}
