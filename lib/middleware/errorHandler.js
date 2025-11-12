/**
 * Error Handler Middleware
 * Provides consistent error handling across all API routes
 * Handles Mongoose validation errors, duplicate key errors, and generic errors
 */

/**
 * Middleware to wrap route handlers with error handling
 * Catches all errors and returns appropriate HTTP responses
 *
 * @param {Function} handler - The API route handler to wrap
 * @returns {Function} Wrapped handler with error handling
 *
 * @example
 * export default withErrorHandler(async (req, res) => {
 *   // Any errors thrown here will be caught and handled
 *   const data = await riskyOperation();
 *   res.json(data);
 * });
 */
export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error(`[${req.method} ${req.url}] Error:`, error);

      // Mongoose validation error
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.message,
          details: Object.keys(error.errors).reduce((acc, key) => {
            acc[key] = error.errors[key].message;
            return acc;
          }, {}),
        });
      }

      // Mongoose duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || 'field';
        return res.status(409).json({
          success: false,
          error: 'Duplicate entry',
          message: `A record with this ${field} already exists`,
          field,
        });
      }

      // Mongoose CastError (invalid ObjectId, etc.)
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid data format',
          message: `Invalid ${error.path}: ${error.value}`,
        });
      }

      // Generic error
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack,
          details: error.toString(),
        }),
      });
    }
  };
}
