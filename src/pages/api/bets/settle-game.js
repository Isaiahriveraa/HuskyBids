/**
 * Settle Bets for a Completed Game
 * Processes all pending bets for a game and updates user balances
 */

import connectDB from '@server/db';
import Game from '@server/models/Game';
import Bet from '@server/models/Bet';
import User from '@server/models/User';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Only allow authenticated admins (you can add admin check here)
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectDB();

    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'Game ID is required' });
    }

    // Find the game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Verify game is completed
    if (game.status !== 'completed') {
      return res.status(400).json({
        error: 'Game is not completed yet',
        gameStatus: game.status
      });
    }

    // Verify winner is set
    if (!game.winner || game.winner === 'tie') {
      return res.status(400).json({
        error: game.winner === 'tie'
          ? 'Tie games require manual settlement'
          : 'Winner not set for this game'
      });
    }

    // Get all pending bets for this game
    const pendingBets = await Bet.find({
      gameId: game._id,
      status: 'pending'
    }).populate('userId');

    if (pendingBets.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending bets to settle',
        settled: 0,
      });
    }

    console.log(`🎯 Settling ${pendingBets.length} bets for game: ${game.homeTeam} vs ${game.awayTeam}`);
    console.log(`Winner: ${game.winner === 'home' ? game.homeTeam : game.awayTeam}`);

    let wonCount = 0;
    let lostCount = 0;
    let totalPayout = 0;
    const errors = [];

    // Process each bet
    for (const bet of pendingBets) {
      try {
        const didWin = bet.predictedWinner === game.winner;

        if (didWin) {
          // Settle as won
          await bet.settleAsWon();

          // Add winnings to user's account
          const user = await User.findById(bet.userId);
          if (user) {
            user.biscuits += bet.actualWin;
            user.winningBets = (user.winningBets || 0) + 1;
            user.totalBiscuitsWon = (user.totalBiscuitsWon || 0) + bet.actualWin;
            await user.save();

            totalPayout += bet.actualWin;
            wonCount++;

            console.log(`✅ Paid out ${bet.actualWin} biscuits to user ${user.clerkId}`);
          }
        } else {
          // Settle as lost
          await bet.settleAsLost();

          // Update user stats
          const user = await User.findById(bet.userId);
          if (user) {
            user.losingBets = (user.losingBets || 0) + 1;
            user.totalBiscuitsLost = (user.totalBiscuitsLost || 0) + bet.betAmount;
            await user.save();
          }

          lostCount++;
          console.log(`❌ Bet lost: ${bet.betAmount} biscuits`);
        }
      } catch (error) {
        console.error(`Error settling bet ${bet._id}:`, error);
        errors.push({
          betId: bet._id,
          error: error.message,
        });
      }
    }

    console.log(`📊 Settlement complete: ${wonCount} won, ${lostCount} lost, ${totalPayout} biscuits paid out`);

    res.status(200).json({
      success: true,
      message: 'Bets settled successfully',
      game: {
        id: game._id,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        winner: game.winner,
      },
      settled: pendingBets.length,
      won: wonCount,
      lost: lostCount,
      totalPayout,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error settling bets:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
