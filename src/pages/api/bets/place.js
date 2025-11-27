/**
 * Place Bet API
 * Allows users to place bets on games
 *
 * Refactored to use BettingService with transaction support
 */

import BettingService from '@server/services/BettingService';
import { compose, withErrorHandler, withMethods, withDatabase, withAuth } from '@server/middleware';

export default compose(
  withErrorHandler,
  withMethods(['POST']),
  withDatabase,
  withAuth
)(async (req, res) => {
  // Get bet details from request
  const { gameId, betAmount, predictedWinner } = req.body;

  // Validate input
  if (!gameId || !betAmount || !predictedWinner) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: gameId, betAmount, predictedWinner',
    });
  }

  // Place bet using BettingService (handles all validation, transactions, and updates)
  const result = await BettingService.placeBet({
    userId: req.userId,
    gameId,
    betAmount,
    predictedWinner,
  });

  return res.status(201).json({
    success: true,
    message: 'Bet placed successfully',
    bet: {
      _id: result.bet._id,
      betAmount: result.bet.betAmount,
      predictedWinner: result.bet.predictedWinner,
      odds: result.bet.odds,
      potentialWin: result.bet.potentialWin,
      status: result.bet.status,
      placedAt: result.bet.placedAt,
    },
    user: result.user,
    game: result.game,
  });
});
