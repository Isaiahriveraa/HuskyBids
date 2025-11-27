/**
 * Database Connection Middleware
 * Ensures MongoDB connection is established before handler executes
 */

import connectDB from '@server/db';
import { areModelsRegistered } from '@server/models';

/**
 * Middleware to establish database connection
 * Connects to MongoDB before executing the handler
 *
 * @param {Function} handler - The API route handler to wrap
 * @returns {Function} Wrapped handler with database connection
 *
 * @example
 * export default withDatabase(async (req, res) => {
 *   // Database is connected and ready
 *   const users = await User.find({});
 * });
 */
export function withDatabase(handler) {
  return async (req, res) => {
    try {
      // Connect to database (this also registers models)
      await connectDB();

      // Verify models are registered (helps with debugging)
      if (!areModelsRegistered()) {
        console.error('❌ Not all models are registered after connection');
        throw new Error('Model registration failed');
      }

      return handler(req, res);
    } catch (error) {
      console.error('Database middleware error:', error);
      throw error;
    }
  };
}
