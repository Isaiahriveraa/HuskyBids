/**
 * Leaderboard API
 * Returns top users sorted by biscuits or other metrics
 *
 * Refactored to use StatisticsService for centralized calculations
 */

import StatisticsService from '@server/services/StatisticsService';
import { compose, withErrorHandler, withMethods, withDatabase } from '@server/middleware';

export default compose(
  withErrorHandler,
  withMethods(['GET']),
  withDatabase
)(async (req, res) => {
  // Parse query parameters
  const {
    limit = 20,
    page = 1,
    sortBy = 'biscuits', // 'biscuits' | 'winRate' | 'roi' | 'totalBets'
    period = 'all-time'
  } = req.query;

  // Get leaderboard from StatisticsService
  const result = await StatisticsService.getLeaderboard({
    limit: parseInt(limit),
    page: parseInt(page),
    sortBy,
    period,
  });

  return res.status(200).json({
    success: true,
    leaderboard: result.leaderboard,
    total: result.leaderboard.length,
    totalCount: result.pagination.total,
    page: result.pagination.page,
    totalPages: result.pagination.totalPages,
    hasNextPage: result.pagination.hasNextPage,
    hasPrevPage: result.pagination.hasPrevPage,
    filters: result.filters,
  });
});
