/**
 * Middleware Composition Utility
 * Allows chaining multiple middleware functions together
 */

/**
 * Composes multiple middleware functions into a single wrapper
 * Middleware are applied from right to left (bottom to top)
 *
 * @param {...Function} middlewares - Middleware functions to compose
 * @returns {Function} A function that accepts a handler and returns a wrapped handler
 *
 * @example
 * // Middleware are applied in reverse order:
 * // 1. withUser runs last (innermost)
 * // 2. withAuth runs third
 * // 3. withDatabase runs second
 * // 4. withMethods runs first (validates early)
 * // 5. withErrorHandler wraps everything (outermost - catches all errors)
 *
 * export default compose(
 *   withErrorHandler,        // Applied last (catches all errors)
 *   withMethods(['POST']),   // Applied fourth
 *   withDatabase,            // Applied third
 *   withAuth,                // Applied second
 *   withUser                 // Applied first (innermost)
 * )(async (req, res) => {
 *   // req.userId and req.user are available here
 *   const { user } = req;
 *   res.json({ success: true, biscuits: user.biscuits });
 * });
 */
export function compose(...middlewares) {
  return (handler) => {
    // Apply middleware from right to left (reduceRight)
    // This ensures the first middleware in the list wraps everything
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}
