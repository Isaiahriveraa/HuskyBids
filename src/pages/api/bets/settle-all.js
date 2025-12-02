/**
 * Settle All Completed Games
 * Processes all completed games with pending bets
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
    // Only allow authenticated users (you can add admin check here)
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectDB();

    // Find all completed games with a winner set
    const completedGames = await Game.find({
      status: 'completed',
      winner: { $in: ['home', 'away'] }, // Exclude ties and null
    });

    if (completedGames.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No completed games to settle',
        gamesProcessed: 0,
      });
    }

    console.log(`🎯 Processing ${completedGames.length} completed games`);

    let totalGamesSettled = 0;
    let totalBetsSettled = 0;
    let totalWon = 0;
    let totalLost = 0;
    let totalPayout = 0;
    const gameResults = [];

    // Process each game
    for (const game of completedGames) {
      try {
        // Get all pending bets for this game
        const pendingBets = await Bet.find({
          gameId: game._id,
          status: 'pending'
        }).populate('userId');

        if (pendingBets.length === 0) {
          console.log(`⏭️  No pending bets for ${game.homeTeam} vs ${game.awayTeam}`);
          continue;
        }

        console.log(`\n📋 Settling ${pendingBets.length} bets for: ${game.homeTeam} vs ${game.awayTeam}`);
        console.log(`   Winner: ${game.winner === 'home' ? game.homeTeam : game.awayTeam}`);

        let gameWon = 0;
        let gameLost = 0;
        let gamePayout = 0;

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

                gamePayout += bet.actualWin;
                gameWon++;
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

              gameLost++;
            }
          } catch (betError) {
            console.error(`   ⚠️  Error settling bet ${bet._id}:`, betError.message);
          }
        }

        totalGamesSettled++;
        totalBetsSettled += pendingBets.length;
        totalWon += gameWon;
        totalLost += gameLost;
        totalPayout += gamePayout;

        gameResults.push({
          gameId: game._id,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          winner: game.winner,
          betsSettled: pendingBets.length,
          won: gameWon,
          lost: gameLost,
          payout: gamePayout,
        });

        console.log(`   ✅ Settled: ${gameWon} won, ${gameLost} lost, ${gamePayout} biscuits paid`);
      } catch (gameError) {
        console.error(`Error processing game ${game._id}:`, gameError.message);
      }
    }

    console.log(`\n📊 SETTLEMENT SUMMARY:`);
    console.log(`   Games processed: ${totalGamesSettled}`);
    console.log(`   Bets settled: ${totalBetsSettled}`);
    console.log(`   Won: ${totalWon}, Lost: ${totalLost}`);
    console.log(`   Total payout: ${totalPayout} biscuits`);

    res.status(200).json({
      success: true,
      message: 'All completed games settled',
      gamesProcessed: totalGamesSettled,
      betsSettled: totalBetsSettled,
      won: totalWon,
      lost: totalLost,
      totalPayout,
      games: gameResults,
    });
  } catch (error) {
    console.error('Error settling all games:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
