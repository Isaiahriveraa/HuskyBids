/**
 * Get User's Bets
 * Returns all bets placed by the authenticated user
 * This is a simplified version of /api/bets/history that just returns bet data
 * without filtering, pagination, or statistics
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

  // Get all bets for the user, most recent first
  const bets = await Bet.find({ clerkId: userId })
    .populate('gameId')
    .sort({ placedAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    bets,
  });
});
