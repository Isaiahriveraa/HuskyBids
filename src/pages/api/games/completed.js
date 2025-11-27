/**
 * Get Completed Games from Database
 * Returns games that have finished with scores and results
 * Automatically syncs completed games if none found in database
 */

import connectDB from '@server/db';
import Game from '@server/models/Game';
import { getBaseUrl } from '@shared/constants/config';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const {
      sport = 'football',
      limit = '20',
      sortBy = 'recent', // 'recent' or 'oldest'
      autoSync = 'true', // Auto-sync if no completed games found
    } = req.query;

    // Build query for completed games
    const query = {
      status: 'completed',
    };

    // Filter by sport if specified
    if (sport !== 'all') {
      query.sport = sport;
    }

    // Determine sort order
    const sortOrder = sortBy === 'oldest' ? 1 : -1;

    // Fetch completed games
    let games = await Game.find(query)
      .sort({ gameDate: sortOrder }) // Most recent first by default
      .limit(parseInt(limit))
      .lean(); // Convert to plain JavaScript objects

    console.log(`📊 Query: ${JSON.stringify(query)}`);
    console.log(`📊 Found ${games.length} completed games for ${sport}`);

    // If no completed games found and autoSync is enabled, trigger sync
    if (games.length === 0 && autoSync === 'true') {
      console.log('📊 No completed games found, triggering auto-sync...');

      // Sync current season and previous season
      const currentYear = new Date().getFullYear();
      const seasons = [currentYear, currentYear - 1];

      const baseUrl = getBaseUrl();

      for (const season of seasons) {
        try {
          console.log(`🔄 Auto-syncing ${sport} season ${season}...`);

          await fetch(`${baseUrl}/api/games/sync?sport=${sport}&season=${season}&force=true`, {
            method: 'POST',
          });
        } catch (syncError) {
          console.error(`⚠️ Failed to sync season ${season}:`, syncError.message);
        }
      }

      // Re-fetch completed games after sync
      games = await Game.find(query)
        .sort({ gameDate: sortOrder })
        .limit(parseInt(limit))
        .lean();

      console.log(`📊 After auto-sync: Found ${games.length} completed games`);
    }

    // Add additional computed fields for display
    const enrichedGames = games.map((game) => {
      // Determine winning team
      let winningTeam = null;
      let winningScore = null;
      let losingTeam = null;
      let losingScore = null;
      let scoreDifference = null;

      if (game.winner === 'home') {
        winningTeam = game.homeTeam;
        winningScore = game.homeScore;
        losingTeam = game.awayTeam;
        losingScore = game.awayScore;
        scoreDifference = game.homeScore - game.awayScore;
      } else if (game.winner === 'away') {
        winningTeam = game.awayTeam;
        winningScore = game.awayScore;
        losingTeam = game.homeTeam;
        losingScore = game.homeScore;
        scoreDifference = game.awayScore - game.homeScore;
      }

      return {
        ...game,
        winningTeam,
        winningScore,
        losingTeam,
        losingScore,
        scoreDifference,
        gameResult: game.winner === 'tie'
          ? `Tie ${game.homeScore}-${game.awayScore}`
          : `${winningTeam} won ${winningScore}-${losingScore}`,
        // Format date for display
        formattedDate: new Date(game.gameDate).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedGames.length,
      games: enrichedGames,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching completed games:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
