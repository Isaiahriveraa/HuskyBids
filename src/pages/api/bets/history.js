/**
 * Get User's Betting History
 * Returns all bets placed by the user
 */

import Bet from '@server/models/Bet';
import { compose, withErrorHandler, withMethods, withDatabase, withAuth } from '@server/middleware';

export default compose(
  withErrorHandler,
  withMethods(['GET']),
  withDatabase,
  withAuth
)(async (req, res) => {
  const { userId } = req;

  // Get query parameters
  const {
    status = 'all', // 'all', 'pending', 'won', 'lost', 'cancelled'
    sport = 'all', // 'all', 'football', 'basketball'
    limit = '50',
    skip = '0',
  } = req.query;

  // Build query
  const query = { clerkId: userId };

  if (status !== 'all') {
    query.status = status;
  }

  // Fetch bets with game details
  let bets = await Bet.find(query)
    .populate('gameId') // Populate game details
    .sort({ placedAt: -1 }) // Most recent first
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .lean();

  // Filter by sport after population (since sport is in Game, not Bet)
  if (sport !== 'all') {
    bets = bets.filter(bet => bet.gameId && bet.gameId.sport === sport);
  }

  // Build aggregation pipeline for counts stats, respecting filters
  const statsPipeline = [];
  // Always filter by user
  statsPipeline.push({ $match: { clerkId: userId } });
  // Filter by status if needed
  if (status !== 'all') {
    statsPipeline.push({ $match: { status } });
  }
  // If sport filter is applied, join with Game and filter by sport
  if (sport !== 'all') {
    statsPipeline.push(
      {
        $lookup: {
          from: 'games',
          localField: 'gameId',
          foreignField: '_id',
          as: 'game'
        }
      },
      { $unwind: '$game' },
      { $match: { 'game.sport': sport } }
    );
  }
  statsPipeline.push({
    $group: {
      _id: null,
      total: { $sum: 1 },
      pending: {
        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
      },
      won: {
        $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] }
      },
      lost: {
        $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] }
      },
      cancelled: {
        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
      }
    }
  });

  // Calculate statistics using aggregation (single query instead of 5)
  const statsAggregation = await Bet.aggregate(statsPipeline);

  const stats = statsAggregation[0] || {
    total: 0,
    pending: 0,
    won: 0,
    lost: 0,
    cancelled: 0
  };

  const totalBets = stats.total;

  // Build aggregation pipeline for financial stats, respecting filters
  const financialPipeline = [];
  // Always filter by user
  financialPipeline.push({ $match: { clerkId: userId } });
  // Filter by status if needed
  if (status !== 'all') {
    financialPipeline.push({ $match: { status } });
  }
  // If sport filter is applied, join with Game and filter by sport
  if (sport !== 'all') {
    financialPipeline.push(
      {
        $lookup: {
          from: 'games',
          localField: 'gameId',
          foreignField: '_id',
          as: 'game'
        }
      },
      { $unwind: '$game' },
      { $match: { 'game.sport': sport } }
    );
  }
  financialPipeline.push({
    $group: {
      _id: null,
      totalWagered: { $sum: '$betAmount' },
      totalWon: {
        $sum: {
          $cond: [{ $eq: ['$status', 'won'] }, '$actualWin', 0]
        }
      },
      totalLost: {
        $sum: {
          $cond: [{ $eq: ['$status', 'lost'] }, '$betAmount', 0]
        }
      }
    }
  });
  const financialStats = await Bet.aggregate(financialPipeline);
  const financial = financialStats[0] || { totalWagered: 0, totalWon: 0, totalLost: 0 };
  const { totalWagered, totalWon, totalLost } = financial;
  const netProfit = totalWon - totalLost;

  return res.status(200).json({
    success: true,
    bets: bets,
    stats: stats,
    financial: {
      totalWagered,
      totalWon,
      totalLost,
      netProfit,
      roi: totalWagered > 0 ? ((netProfit / totalWagered) * 100).toFixed(2) : 0,
    },
    pagination: {
      total: totalBets,
      limit: parseInt(limit),
      skip: parseInt(skip),
      hasMore: totalBets > parseInt(skip) + parseInt(limit),
    },
  });
});
