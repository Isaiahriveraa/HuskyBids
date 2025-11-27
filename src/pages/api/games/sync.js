/**
 * Sync Games from ESPN API to MongoDB Database
 * This endpoint fetches games from ESPN and stores them in the database
 * Can be called manually or via cron job
 */

import connectDB from '@server/db';
import Game from '@server/models/Game';
import { getBaseUrl } from '@shared/constants/config';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectDB();

    const { sport = 'football', force = false, season } = req.query;

    // Build fetch URL with optional season parameter
    const baseUrl = getBaseUrl();
    let fetchUrl = `${baseUrl}/api/games/fetch-espn?sport=${sport}`;
    if (season) {
      fetchUrl += `&season=${season}`;
    }

    console.log(`🔄 Fetching games from: ${fetchUrl}`);
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch games from ESPN');
    }

    const { games } = await response.json();

    const results = {
      total: games.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    // Process each game
    for (const gameData of games) {
      try {
        // Check if game already exists
        const existingGame = await Game.findOne({ apiGameId: gameData.apiGameId });

        if (existingGame) {
          // Update existing game (scores, status, etc.)
          const shouldUpdate =
            force ||
            existingGame.status !== gameData.status ||
            existingGame.homeScore !== gameData.homeScore ||
            existingGame.awayScore !== gameData.awayScore;

          if (shouldUpdate) {
            console.log(`🔄 Updating game ${gameData.apiGameId}: ${gameData.opponent}`);

            existingGame.sport = gameData.sport;
            existingGame.homeTeam = gameData.homeTeam;
            existingGame.awayTeam = gameData.awayTeam;
            existingGame.opponent = gameData.opponent; // Always update opponent from ESPN data
            existingGame.gameDate = new Date(gameData.gameDate);
            existingGame.location = gameData.location;
            existingGame.status = gameData.status;
            existingGame.homeScore = gameData.homeScore;
            existingGame.awayScore = gameData.awayScore;
            existingGame.week = gameData.week || existingGame.week;

            // Update logos and player data
            existingGame.uwLogo = gameData.uwLogo || existingGame.uwLogo;
            existingGame.opponentLogo = gameData.opponentLogo || existingGame.opponentLogo;
            existingGame.homeTeamLogo = gameData.homeTeamLogo || existingGame.homeTeamLogo;
            existingGame.awayTeamLogo = gameData.awayTeamLogo || existingGame.awayTeamLogo;

            // Always update player data and odds from ESPN (even if null)
            // This ensures fresh data is always synced, allowing player stats to appear as games progress
            existingGame.uwTopPlayer = gameData.uwTopPlayer;
            existingGame.opponentTopPlayer = gameData.opponentTopPlayer;
            existingGame.espnOdds = gameData.odds;

            // Mark nested objects as modified to ensure Mongoose saves them (especially when setting to null)
            existingGame.markModified('uwTopPlayer');
            existingGame.markModified('opponentTopPlayer');
            existingGame.markModified('espnOdds');

            // Log player data updates for debugging
            if (gameData.uwTopPlayer) {
              console.log(`  ✅ UW Player: ${gameData.uwTopPlayer.name} (${gameData.uwTopPlayer.position})`);
            } else {
              console.log(`  ⚠️ No UW player data available for this game`);
            }

            if (gameData.opponentTopPlayer) {
              console.log(`  ✅ Opponent Player: ${gameData.opponentTopPlayer.name} (${gameData.opponentTopPlayer.position})`);
            } else {
              console.log(`  ⚠️ No opponent player data available for this game`);
            }

            // Determine winner if game is completed
            if (gameData.status === 'completed') {
              if (gameData.homeScore > gameData.awayScore) {
                existingGame.winner = 'home';
              } else if (gameData.awayScore > gameData.homeScore) {
                existingGame.winner = 'away';
              } else {
                existingGame.winner = 'tie';
              }
            }

            await existingGame.save();
            results.updated++;
          } else {
            results.skipped++;
          }
        } else {
          // Create new game
          const newGame = new Game({
            apiGameId: gameData.apiGameId,
            sport: gameData.sport,
            homeTeam: gameData.homeTeam,
            awayTeam: gameData.awayTeam,
            opponent: gameData.opponent,
            gameDate: new Date(gameData.gameDate),
            location: gameData.location,
            status: gameData.status,
            homeScore: gameData.homeScore,
            awayScore: gameData.awayScore,
            week: gameData.week || null,
            winner:
              gameData.status === 'completed'
                ? gameData.homeScore > gameData.awayScore
                  ? 'home'
                  : gameData.awayScore > gameData.homeScore
                  ? 'away'
                  : 'tie'
                : null,
            // ESPN data
            uwLogo: gameData.uwLogo,
            opponentLogo: gameData.opponentLogo,
            homeTeamLogo: gameData.homeTeamLogo,
            awayTeamLogo: gameData.awayTeamLogo,
            uwTopPlayer: gameData.uwTopPlayer,
            opponentTopPlayer: gameData.opponentTopPlayer,
            espnOdds: gameData.odds,
          });

          await newGame.save();
          results.created++;
        }
      } catch (error) {
        console.error(`Error processing game ${gameData.apiGameId}:`, error);
        results.errors.push({
          gameId: gameData.apiGameId,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Sync completed for ${sport}`,
      results: results,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Game sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
