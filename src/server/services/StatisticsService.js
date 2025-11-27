import User from '@server/models/User';
import Game from '@server/models/Game';
import Bet from '@server/models/Bet';
import { calculateWinRate, calculateROI } from '@shared/utils/stats-utils';

/**
 * StatisticsService
 *
 * Centralized service for calculating user statistics and leaderboard rankings.
 * Uses utility functions to ensure consistent calculations across the app.
 *
 * Methods:
 * - getUserStats: Get comprehensive user statistics with recent bets
 * - getLeaderboard: Get paginated leaderboard with filters
 * - getUserRank: Get specific user's rank on leaderboard
 */
class StatisticsService {
  /**
   * Get comprehensive user statistics
   *
   * @param {string} userId - Clerk user ID
   * @returns {Promise<Object>} User profile, stats, and recent bets
   * @throws {Error} If user not found
   */
  async getUserStats(userId) {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error('User not found');

    // Fetch recent and pending bets in parallel
    const [recentBets, pendingBets] = await Promise.all([
      Bet.find({ clerkId: userId })
        .sort({ placedAt: -1 })
        .limit(10)
        .populate('gameId')
        .lean(),
      Bet.find({ clerkId: userId, status: 'pending' })
        .populate('gameId')
        .lean(),
    ]);

    // Calculate derived statistics using centralized utilities
    const winRate = calculateWinRate(user.winningBets || 0, user.totalBets || 0);
    const roi = calculateROI(
      user.totalBiscuitsWon || 0,
      user.totalBiscuitsLost || 0,
      user.totalBiscuitsWagered || 0
    );

    return {
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        biscuits: user.biscuits,
        loginStreak: user.loginStreak || 0,
        joinedAt: user.createdAt,
      },
      stats: {
        totalBets: user.totalBets || 0,
        winningBets: user.winningBets || 0,
        losingBets: user.losingBets || 0,
        pendingBets: user.pendingBets || 0,
        winRate,
        roi,
        totalWagered: user.totalBiscuitsWagered || 0,
        totalWon: user.totalBiscuitsWon || 0,
        totalLost: user.totalBiscuitsLost || 0,
        netProfit: (user.totalBiscuitsWon || 0) - (user.totalBiscuitsLost || 0),
      },
      recentBets: recentBets.map(bet => ({
        id: bet._id,
        game: bet.gameId,
        betAmount: bet.betAmount,
        predictedWinner: bet.predictedWinner,
        odds: bet.odds,
        status: bet.status,
        potentialWin: bet.potentialWin,
        actualWin: bet.actualWin || 0,
        placedAt: bet.placedAt,
        settledAt: bet.settledAt,
      })),
      pendingBets: pendingBets.map(bet => ({
        id: bet._id,
        game: bet.gameId,
        betAmount: bet.betAmount,
        predictedWinner: bet.predictedWinner,
        odds: bet.odds,
        potentialWin: bet.potentialWin,
        placedAt: bet.placedAt,
      })),
    };
  }

  /**
   * Get paginated leaderboard with optional filters
   *
   * @param {Object} options - Leaderboard options
   * @param {number} options.limit - Items per page (default: 20)
   * @param {number} options.page - Page number (default: 1)
   * @param {string} options.sortBy - Sort field: 'biscuits' | 'winRate' | 'roi' | 'totalBets' (default: 'biscuits')
   * @param {string} options.period - Time period filter (not yet implemented)
   * @returns {Promise<Object>} Paginated leaderboard data
   */
  async getLeaderboard({
    limit = 20,
    page = 1,
    sortBy = 'biscuits',
    period = 'all-time'
  } = {}) {
    const skip = (page - 1) * limit;

    // Determine sort order based on sortBy parameter
    let sortField;
    switch (sortBy) {
      case 'biscuits':
        sortField = { biscuits: -1 };
        break;
      case 'totalBets':
        sortField = { totalBets: -1, biscuits: -1 };
        break;
      case 'winRate':
        // For winRate and ROI, we'll calculate after fetching
        // since they're virtual fields. Fetch all then sort.
        sortField = { winningBets: -1, totalBets: -1 };
        break;
      case 'roi':
        sortField = { totalBiscuitsWon: -1, totalBiscuitsLost: 1 };
        break;
      default:
        sortField = { biscuits: -1 };
    }

    // Base query: active, non-banned users
    const query = {
      isActive: true,
      isBanned: false,
    };

    // Fetch users
    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sortField)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Calculate derived stats and format leaderboard
    let leaderboard = users.map((user, index) => {
      const winRate = calculateWinRate(user.winningBets || 0, user.totalBets || 0);
      const roi = calculateROI(
        user.totalBiscuitsWon || 0,
        user.totalBiscuitsLost || 0,
        user.totalBiscuitsWagered || 0
      );

      return {
        rank: skip + index + 1, // Temporary rank
        clerkId: user.clerkId,
        username: user.username,
        profileImage: user.profileImage,
        biscuits: user.biscuits,
        totalBets: user.totalBets || 0,
        winningBets: user.winningBets || 0,
        losingBets: user.losingBets || 0,
        winRate,
        roi,
        totalWagered: user.totalBiscuitsWagered || 0,
        netProfit: (user.totalBiscuitsWon || 0) - (user.totalBiscuitsLost || 0),
      };
    });

    // If sorting by winRate or ROI, re-sort the results
    if (sortBy === 'winRate') {
      leaderboard.sort((a, b) => {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        return b.biscuits - a.biscuits; // Tiebreaker
      });
    } else if (sortBy === 'roi') {
      leaderboard.sort((a, b) => {
        if (b.roi !== a.roi) return b.roi - a.roi;
        return b.biscuits - a.biscuits; // Tiebreaker
      });
    }

    // Re-assign ranks after sorting
    leaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: skip + index + 1,
    }));

    return {
      leaderboard,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      filters: {
        sortBy,
        period,
      },
    };
  }

  /**
   * Get a specific user's rank on the leaderboard
   *
   * @param {string} userId - Clerk user ID
   * @param {string} sortBy - Sort field to determine rank
   * @returns {Promise<Object>} User's rank and surrounding users
   */
  async getUserRank(userId, sortBy = 'biscuits') {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error('User not found');

    // Determine sort order
    let sortField;
    switch (sortBy) {
      case 'biscuits':
        sortField = { biscuits: -1 };
        break;
      case 'totalBets':
        sortField = { totalBets: -1, biscuits: -1 };
        break;
      default:
        sortField = { biscuits: -1 };
    }

    // Count how many users are ranked higher
    const query = {
      isActive: true,
      isBanned: false,
    };

    let rank;
    if (sortBy === 'biscuits') {
      rank = await User.countDocuments({
        ...query,
        biscuits: { $gt: user.biscuits },
      }) + 1;
    } else if (sortBy === 'totalBets') {
      rank = await User.countDocuments({
        ...query,
        $or: [
          { totalBets: { $gt: user.totalBets } },
          { totalBets: user.totalBets, biscuits: { $gt: user.biscuits } },
        ],
      }) + 1;
    }

    return {
      rank,
      user: {
        username: user.username,
        biscuits: user.biscuits,
        totalBets: user.totalBets || 0,
        winRate: calculateWinRate(user.winningBets || 0, user.totalBets || 0),
        roi: calculateROI(
          user.totalBiscuitsWon || 0,
          user.totalBiscuitsLost || 0,
          user.totalBiscuitsWagered || 0
        ),
      },
    };
  }

  /**
   * Get global betting statistics (platform-wide)
   *
   * @returns {Promise<Object>} Platform statistics
   */
  async getGlobalStats() {
    const [totalUsers, activeBettors, stats] = await Promise.all([
      User.countDocuments({ isActive: true, isBanned: false }),
      User.countDocuments({ isActive: true, isBanned: false, totalBets: { $gt: 0 } }),
      User.aggregate([
        {
          $match: { isActive: true, isBanned: false }
        },
        {
          $group: {
            _id: null,
            totalBets: { $sum: '$totalBets' },
            totalWagered: { $sum: '$totalBiscuitsWagered' },
            totalWon: { $sum: '$totalBiscuitsWon' },
            totalLost: { $sum: '$totalBiscuitsLost' },
            totalBiscuits: { $sum: '$biscuits' },
          }
        }
      ]),
    ]);

    const platformStats = stats[0] || {
      totalBets: 0,
      totalWagered: 0,
      totalWon: 0,
      totalLost: 0,
      totalBiscuits: 0,
    };

    return {
      users: {
        total: totalUsers,
        activeBettors,
        inactiveUsers: totalUsers - activeBettors,
      },
      bets: {
        totalPlaced: platformStats.totalBets,
        totalWagered: platformStats.totalWagered,
        totalWon: platformStats.totalWon,
        totalLost: platformStats.totalLost,
      },
      economy: {
        totalBiscuitsInCirculation: platformStats.totalBiscuits,
        averageBiscuitsPerUser: totalUsers > 0
          ? Math.round(platformStats.totalBiscuits / totalUsers)
          : 0,
      },
    };
  }
}

// Export singleton instance
export default new StatisticsService();
