/**
 * User Stats API
 * Returns comprehensive dashboard statistics for authenticated user
 *
 * Refactored to use StatisticsService for centralized calculations
 */

import StatisticsService from '../../../lib/services/StatisticsService';
import { compose, withErrorHandler, withMethods, withDatabase, withAuth } from '../../../lib/middleware';

export default compose(
  withErrorHandler,
  withMethods(['GET']),
  withDatabase,
  withAuth
)(async (req, res) => {
  // Get comprehensive user stats from StatisticsService
  const userStats = await StatisticsService.getUserStats(req.userId);

  // Get user's rank on leaderboard
  const rankInfo = await StatisticsService.getUserRank(req.userId, 'biscuits');

  // Format recent activity for display
  const recentActivity = userStats.recentBets.slice(0, 5).map(bet => {
    const game = bet.game;
    const isHome = bet.predictedWinner === 'home';
    const predictedTeam = isHome ? game?.homeTeam : game?.awayTeam;

    // Determine result message
    let result = 'Pending';
    let resultColor = 'gray';

    if (bet.status === 'won') {
      result = `Won ${bet.actualWin} biscuits`;
      resultColor = 'green';
    } else if (bet.status === 'lost') {
      result = `Lost ${bet.betAmount} biscuits`;
      resultColor = 'red';
    } else if (bet.status === 'refunded') {
      result = `Refunded ${bet.betAmount} biscuits`;
      resultColor = 'blue';
    }

    return {
      id: bet.id,
      game: game ? `${game.homeTeam} vs ${game.awayTeam}` : 'Unknown Game',
      prediction: predictedTeam || 'Unknown',
      amount: bet.betAmount,
      odds: bet.odds,
      potentialWin: bet.potentialWin,
      result,
      resultColor,
      status: bet.status,
      placedAt: bet.placedAt,
      gameDate: game?.gameDate,
    };
  });

  // Calculate pending bets totals
  const pendingAmount = userStats.pendingBets.reduce((sum, bet) => sum + bet.betAmount, 0);
  const potentialWinnings = userStats.pendingBets.reduce((sum, bet) => sum + bet.potentialWin, 0);

  // Compile comprehensive stats
  const stats = {
    // User info
    ...userStats.user,

    // Betting statistics
    ...userStats.stats,

    // Pending bet details
    pendingAmount,
    potentialWinnings,

    // Ranking (from StatisticsService)
    rank: rankInfo.rank,
    totalUsers: 0, // Can add to StatisticsService if needed
    percentile: 0, // Can calculate if totalUsers is available

    // Recent activity
    recentActivity,
  };

  return res.status(200).json({
    success: true,
    stats,
  });
});
