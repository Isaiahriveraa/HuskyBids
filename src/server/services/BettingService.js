import mongoose from 'mongoose';
import User from '@server/models/User';
import Game from '@server/models/Game';
import Bet from '@server/models/Bet';
import { calculateOdds, validateBet } from '@shared/utils/odds-calculator';
import { BETTING_LIMITS } from '@shared/constants/betting';

/**
 * BettingService
 *
 * Centralized service for all betting operations with MongoDB transaction support.
 * Ensures data consistency across User, Game, and Bet collections.
 *
 * Methods:
 * - placeBet: Place a new bet with transaction safety
 * - settleBetsForGame: Settle all pending bets when game completes
 * - refundBetsForGame: Refund all pending bets (cancelled/postponed games)
 */
class BettingService {
  /**
   * Place a bet with full transaction support
   *
   * @param {Object} params - Bet parameters
   * @param {string} params.userId - Clerk user ID
   * @param {string} params.gameId - Game MongoDB ID
   * @param {number} params.betAmount - Amount to wager
   * @param {string} params.predictedWinner - 'home' or 'away'
   * @returns {Promise<Object>} Bet, updated user balance, and updated odds
   * @throws {Error} If validation fails or transaction fails
   */
  async placeBet({ userId, gameId, betAmount, predictedWinner }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Get user and game with session lock
      const user = await User.findOne({ clerkId: userId }).session(session);
      const game = await Game.findById(gameId).session(session);

      if (!user) throw new Error('User not found');
      if (!game) throw new Error('Game not found');

      // 2. Validate bet amount
      const validation = validateBet(
        betAmount,
        user.biscuits,
        BETTING_LIMITS.MIN_BET,
        BETTING_LIMITS.MAX_BET
      );
      if (!validation.valid) throw new Error(validation.error);

      // 3. Validate predicted winner
      if (!['home', 'away'].includes(predictedWinner)) {
        throw new Error('predictedWinner must be "home" or "away"');
      }

      // 4. Check game is open for betting
      if (game.status !== 'scheduled') {
        throw new Error(`Game is ${game.status} and not available for betting`);
      }

      // Validation: Check if game has started
      // Use a small buffer (e.g., 5 seconds) to account for slight server time differences
      const now = new Date();
      const gameTime = new Date(game.gameDate);
      const BUFFER_MS = 5000;
      const cutoffTime = new Date(now.getTime() - BUFFER_MS);

      if (gameTime <= cutoffTime) {
        throw new Error(`Betting is closed - game has already started (gameDate: ${gameTime.toISOString()}, now: ${now.toISOString()})`);
      }

      // 5. Calculate current odds BEFORE placing bet
      const currentOdds = calculateOdds(
        game.homeBets || 0,
        game.awayBets || 0,
        game.homeBiscuitsWagered || 0,
        game.awayBiscuitsWagered || 0
      );

      const betOdds = predictedWinner === 'home' ? currentOdds.homeOdds : currentOdds.awayOdds;

      // 6. Create bet with potentialWin calculated upfront
      const potentialWin = Math.round(betAmount * betOdds);

      const bet = new Bet({
        userId: user._id,
        clerkId: userId,
        gameId: new mongoose.Types.ObjectId(gameId),
        betAmount,
        predictedWinner,
        odds: betOdds,
        potentialWin,
        status: 'pending',
      });

      // 7. Update user balance and stats
      user.biscuits -= betAmount;
      user.totalBets = (user.totalBets || 0) + 1;
      user.pendingBets = (user.pendingBets || 0) + 1;
      user.totalBiscuitsWagered = (user.totalBiscuitsWagered || 0) + betAmount;

      // 8. Update game statistics
      game.totalBetsPlaced = (game.totalBetsPlaced || 0) + 1;
      game.totalBiscuitsWagered = (game.totalBiscuitsWagered || 0) + betAmount;

      if (predictedWinner === 'home') {
        game.homeBets = (game.homeBets || 0) + 1;
        game.homeBiscuitsWagered = (game.homeBiscuitsWagered || 0) + betAmount;
      } else {
        game.awayBets = (game.awayBets || 0) + 1;
        game.awayBiscuitsWagered = (game.awayBiscuitsWagered || 0) + betAmount;
      }

      // 9. Recalculate odds for NEXT bet
      const newOdds = calculateOdds(
        game.homeBets,
        game.awayBets,
        game.homeBiscuitsWagered,
        game.awayBiscuitsWagered
      );

      game.homeOdds = newOdds.homeOdds;
      game.awayOdds = newOdds.awayOdds;

      // 10. Save all changes atomically
      await Promise.all([
        bet.save({ session }),
        user.save({ session }),
        game.save({ session }),
      ]);

      // 11. Commit transaction
      await session.commitTransaction();

      console.log(`✅ Bet placed: ${user.username} wagered ${betAmount} biscuits on ${predictedWinner} (odds: ${betOdds})`);

      return {
        bet: bet.toObject(),
        user: {
          biscuits: user.biscuits,
          totalBets: user.totalBets,
        },
        game: {
          homeOdds: game.homeOdds,
          awayOdds: game.awayOdds,
          totalBetsPlaced: game.totalBetsPlaced,
        },
      };
    } catch (error) {
      // Rollback on any error
      await session.abortTransaction();
      console.error('❌ Bet placement failed, transaction rolled back:', error.message);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Settle all pending bets for a completed game
   *
   * @param {string} gameId - Game MongoDB ID
   * @param {string} winner - 'home' or 'away'
   * @returns {Promise<Object>} Settlement statistics
   */
  async settleBetsForGame(gameId, winner) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find all pending bets for this game
      const pendingBets = await Bet.find({
        gameId: new mongoose.Types.ObjectId(gameId),
        status: 'pending'
      }).session(session);

      let wonCount = 0;
      let lostCount = 0;
      let totalPaidOut = 0;

      for (const bet of pendingBets) {
        const isWinner = bet.predictedWinner === winner;

        if (isWinner) {
          const payout = await this._settleBetAsWon(bet, session);
          totalPaidOut += payout;
          wonCount++;
        } else {
          await this._settleBetAsLost(bet, session);
          lostCount++;
        }
      }

      await session.commitTransaction();

      console.log(`✅ Settled ${pendingBets.length} bets for game ${gameId}: ${wonCount} won, ${lostCount} lost, ${totalPaidOut} biscuits paid out`);

      return {
        settled: pendingBets.length,
        won: wonCount,
        lost: lostCount,
        totalPaidOut,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('❌ Bet settlement failed, transaction rolled back:', error.message);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Internal: Settle a single bet as won
   * @private
   */
  async _settleBetAsWon(bet, session) {
    bet.status = 'won';
    bet.settledAt = new Date();
    bet.actualWin = bet.potentialWin;

    const user = await User.findOne({ clerkId: bet.clerkId }).session(session);
    if (!user) throw new Error(`User not found for bet ${bet._id}`);

    user.biscuits += bet.actualWin;
    user.winningBets = (user.winningBets || 0) + 1;
    user.pendingBets = Math.max(0, (user.pendingBets || 0) - 1);
    user.totalBiscuitsWon = (user.totalBiscuitsWon || 0) + bet.actualWin;

    await Promise.all([
      bet.save({ session }),
      user.save({ session }),
    ]);

    return bet.actualWin;
  }

  /**
   * Internal: Settle a single bet as lost
   * @private
   */
  async _settleBetAsLost(bet, session) {
    bet.status = 'lost';
    bet.settledAt = new Date();
    bet.actualWin = 0;

    const user = await User.findOne({ clerkId: bet.clerkId }).session(session);
    if (!user) throw new Error(`User not found for bet ${bet._id}`);

    user.losingBets = (user.losingBets || 0) + 1;
    user.pendingBets = Math.max(0, (user.pendingBets || 0) - 1);
    user.totalBiscuitsLost = (user.totalBiscuitsLost || 0) + bet.betAmount;

    await Promise.all([
      bet.save({ session }),
      user.save({ session }),
    ]);
  }

  /**
   * Refund all pending bets for a cancelled/postponed game
   *
   * @param {string} gameId - Game MongoDB ID
   * @param {string} reason - Reason for refund
   * @returns {Promise<Object>} Refund statistics
   */
  async refundBetsForGame(gameId, reason = 'Game cancelled') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const pendingBets = await Bet.find({
        gameId: new mongoose.Types.ObjectId(gameId),
        status: 'pending'
      }).session(session);

      let totalRefunded = 0;

      for (const bet of pendingBets) {
        bet.status = 'refunded';
        bet.settledAt = new Date();
        bet.notes = reason;

        const user = await User.findOne({ clerkId: bet.clerkId }).session(session);
        if (!user) {
          console.warn(`⚠️ User not found for bet ${bet._id}, skipping refund`);
          continue;
        }

        // Return biscuits to user
        user.biscuits += bet.betAmount;
        user.pendingBets = Math.max(0, (user.pendingBets || 0) - 1);
        user.totalBets = Math.max(0, (user.totalBets || 0) - 1);
        user.totalBiscuitsWagered = Math.max(0, (user.totalBiscuitsWagered || 0) - bet.betAmount);

        totalRefunded += bet.betAmount;

        await Promise.all([
          bet.save({ session }),
          user.save({ session }),
        ]);
      }

      await session.commitTransaction();

      console.log(`✅ Refunded ${pendingBets.length} bets for game ${gameId}: ${totalRefunded} biscuits returned. Reason: ${reason}`);

      return {
        refunded: pendingBets.length,
        totalRefunded,
        reason,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('❌ Bet refund failed, transaction rolled back:', error.message);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get betting summary for a specific user
   *
   * @param {string} userId - Clerk user ID
   * @returns {Promise<Object>} User betting statistics
   */
  async getUserBettingSummary(userId) {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error('User not found');

    const [pendingBets, recentBets] = await Promise.all([
      Bet.find({ clerkId: userId, status: 'pending' })
        .populate('gameId')
        .sort({ placedAt: -1 }),
      Bet.find({ clerkId: userId })
        .sort({ placedAt: -1 })
        .limit(10)
        .populate('gameId'),
    ]);

    return {
      summary: {
        totalBets: user.totalBets || 0,
        winningBets: user.winningBets || 0,
        losingBets: user.losingBets || 0,
        pendingBets: user.pendingBets || 0,
        totalWagered: user.totalBiscuitsWagered || 0,
        totalWon: user.totalBiscuitsWon || 0,
        totalLost: user.totalBiscuitsLost || 0,
      },
      pendingBets,
      recentBets,
    };
  }
}

const bettingService = new BettingService();
export default bettingService;
