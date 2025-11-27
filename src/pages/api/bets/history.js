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

  // Count total bets for pagination
  const totalBets = await Bet.countDocuments(query);

  // Calculate statistics
  const stats = {
    total: totalBets,
    pending: await Bet.countDocuments({ clerkId: userId, status: 'pending' }),
    won: await Bet.countDocuments({ clerkId: userId, status: 'won' }),
    lost: await Bet.countDocuments({ clerkId: userId, status: 'lost' }),
    cancelled: await Bet.countDocuments({ clerkId: userId, status: 'cancelled' }),
  };

  // Calculate financial stats
  const allBets = await Bet.find({ clerkId: userId }).lean();
  const totalWagered = allBets.reduce((sum, bet) => sum + bet.betAmount, 0);
  const totalWon = allBets
    .filter((bet) => bet.status === 'won')
    .reduce((sum, bet) => sum + bet.actualWin, 0);
  const totalLost = allBets
    .filter((bet) => bet.status === 'lost')
    .reduce((sum, bet) => sum + bet.betAmount, 0);
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
