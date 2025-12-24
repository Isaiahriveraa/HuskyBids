/**
 * Auto-Settle User's Pending Bets
 *
 * Automatically processes pending bets when user logs in:
 * 1. Fetches all user's pending bets
 * 2. For each bet, checks if the game is completed
 * 3. Sets game winner from scores if not already set
 * 4. Settles the bet (won/lost/refunded)
 * 5. Updates user balance and statistics
 * 6. Returns settlement summary and updated user data
 *
 * This ensures users always see up-to-date balances on login.
 */

import connectDB from '@server/db';
import Bet from '@server/models/Bet';
import User from '@server/models/User';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectDB();

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`🎯 Auto-settling bets for user: ${user.username} (${clerkId})`);

    // Get all user's pending bets with game data populated
    const pendingBets = await Bet.find({
      clerkId,
      status: 'pending'
    }).populate('gameId');

    if (pendingBets.length === 0) {
      console.log('✅ No pending bets to settle');
      return res.status(200).json({
        success: true,
        message: 'No pending bets',
        settled: 0,
        user: {
          biscuits: user.biscuits,
          winningBets: user.winningBets,
          losingBets: user.losingBets,
          pendingBets: user.pendingBets,
        },
      });
    }

    console.log(`📋 Found ${pendingBets.length} pending bets`);

    // Settlement tracking
    let settledCount = 0;
    let wonCount = 0;
    let lostCount = 0;
    let refundedCount = 0;
    let totalWinnings = 0;
    let totalLosses = 0;
    const settlementDetails = [];

    // Process each pending bet
    for (const bet of pendingBets) {
      try {
        const game = bet.gameId;

        // Skip if game data is missing
        if (!game) {
          console.warn(`⚠️  Bet ${bet._id} has no associated game`);
          continue;
        }

        // Skip if game is not completed
        if (game.status !== 'completed') {
          console.log(`⏭️  Game ${game._id} not completed yet (${game.status})`);
          continue;
        }

        // Determine winner if not already set
        if (!game.winner) {
          await determineGameWinner(game);
        }

        // Settle the bet based on game outcome
        const settlementResult = await settleBet(bet, game, user);

        if (settlementResult) {
          settledCount++;

          if (settlementResult.outcome === 'won') {
            wonCount++;
            totalWinnings += settlementResult.amount;
          } else if (settlementResult.outcome === 'lost') {
            lostCount++;
            totalLosses += settlementResult.amount;
          } else if (settlementResult.outcome === 'refunded') {
            refundedCount++;
          }

          settlementDetails.push({
            betId: bet._id,
            game: `${game.homeTeam} vs ${game.awayTeam}`,
            outcome: settlementResult.outcome,
            amount: settlementResult.amount,
            prediction: bet.predictedWinner,
            actualWinner: game.winner,
          });

          console.log(`✅ Settled bet ${bet._id}: ${settlementResult.outcome} (${settlementResult.amount} biscuits)`);
        }
      } catch (betError) {
        console.error(`❌ Error settling bet ${bet._id}:`, betError);
        // Continue processing other bets even if one fails
      }
    }

    // Re-fetch user to get updated balance and stats
    const updatedUser = await User.findOne({ clerkId });

    console.log(`📊 Settlement Summary: ${settledCount} bets settled (${wonCount} won, ${lostCount} lost, ${refundedCount} refunded)`);
    console.log(`💰 Net change: ${totalWinnings - totalLosses} biscuits`);

    res.status(200).json({
      success: true,
      message: settledCount > 0
        ? `Settled ${settledCount} bet${settledCount > 1 ? 's' : ''}`
        : 'No bets to settle',
      settled: settledCount,
      won: wonCount,
      lost: lostCount,
      refunded: refundedCount,
      totalWinnings,
      totalLosses,
      netChange: totalWinnings - totalLosses,
      user: {
        biscuits: updatedUser.biscuits,
        winningBets: updatedUser.winningBets,
        losingBets: updatedUser.losingBets,
        pendingBets: updatedUser.pendingBets,
        totalBiscuitsWon: updatedUser.totalBiscuitsWon,
        totalBiscuitsLost: updatedUser.totalBiscuitsLost,
      },
      details: settlementDetails,
    });
  } catch (error) {
    console.error('❌ Error in auto-settle:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

/**
 * Determines the winner of a completed game based on scores
 * Updates the game document with the winner
 *
 * @param {Game} game - The game document
 * @returns {Promise<void>}
 */
async function determineGameWinner(game) {
  if (game.status !== 'completed') {
    throw new Error('Cannot determine winner for non-completed game');
  }

  // Determine winner from scores
  if (game.homeScore > game.awayScore) {
    game.winner = 'home';
  } else if (game.awayScore > game.homeScore) {
    game.winner = 'away';
  } else {
    game.winner = 'tie';
  }

  await game.save();

  console.log(`🏆 Winner determined for ${game.homeTeam} vs ${game.awayTeam}: ${game.winner} (${game.homeScore}-${game.awayScore})`);
}

/**
 * Settles a single bet based on game outcome
 * Updates bet status and user balance/statistics
 *
 * @param {Bet} bet - The bet document
 * @param {Game} game - The game document
 * @param {User} user - The user document
 * @returns {Promise<Object|null>} Settlement result or null if not settled
 */
async function settleBet(bet, game, user) {
  // Verify bet is still pending
  if (bet.status !== 'pending') {
    console.log(`⏭️  Bet ${bet._id} already settled (${bet.status})`);
    return null;
  }

  // Handle tie games - refund the bet
  if (game.winner === 'tie') {
    await bet.refund();

    // Add bet amount back to user's balance
    user.biscuits += bet.betAmount;
    user.pendingBets = Math.max(0, (user.pendingBets || 0) - 1);
    await user.save();

    return {
      outcome: 'refunded',
      amount: bet.betAmount,
    };
  }

  // Determine if bet won or lost
  const didWin = bet.predictedWinner === game.winner;

  if (didWin) {
    // Settle as won
    await bet.settleAsWon();

    // Add winnings to user's balance
    user.biscuits += bet.actualWin;
    user.winningBets = (user.winningBets || 0) + 1;
    user.totalBiscuitsWon = (user.totalBiscuitsWon || 0) + bet.actualWin;
    user.pendingBets = Math.max(0, (user.pendingBets || 0) - 1);
    await user.save();

    return {
      outcome: 'won',
      amount: bet.actualWin,
    };
  } else {
    // Settle as lost
    await bet.settleAsLost();

    // Update user stats (balance already deducted when bet was placed)
    user.losingBets = (user.losingBets || 0) + 1;
    user.totalBiscuitsLost = (user.totalBiscuitsLost || 0) + bet.betAmount;
    user.pendingBets = Math.max(0, (user.pendingBets || 0) - 1);
    await user.save();

    return {
      outcome: 'lost',
      amount: bet.betAmount,
    };
  }
}
