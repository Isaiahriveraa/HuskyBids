/**
 * Get Upcoming Games from Database
 * Returns games that haven't been completed yet
 * Automatically syncs current season if no upcoming games found
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
      sport = 'all',
      limit = '20',
      includeCompleted = 'false',
      autoSync = 'true',
    } = req.query;

    // Build query
    const query = {};

    // Filter by sport
    if (sport !== 'all') {
      query.sport = sport;
    }

    // Filter by status and date
    if (includeCompleted === 'false') {
      query.status = { $in: ['scheduled', 'live', 'postponed'] };
      // Only include games that haven't started yet or are currently live
      query.gameDate = { $gte: new Date() };
    }

    // Fetch games
    let games = await Game.find(query)
      .sort({ gameDate: 1 }) // Sort by date ascending (earliest first)
      .limit(parseInt(limit))
      .lean(); // Convert to plain JavaScript objects

    // If no games found and autoSync is enabled, sync current season
    if (games.length === 0 && autoSync === 'true') {
      console.log('📊 No upcoming games found, triggering auto-sync for current season...');

      try {
        const currentYear = new Date().getFullYear();
        const baseUrl = getBaseUrl();

        // If 'all' sports selected, sync both football and basketball
        if (sport === 'all') {
          console.log(`🔄 Auto-syncing all sports for season ${currentYear}...`);

          // Sync football
          await fetch(`${baseUrl}/api/games/sync?sport=football&season=${currentYear}&force=true`, {
            method: 'POST',
          });

          // Sync basketball
          await fetch(`${baseUrl}/api/games/sync?sport=basketball&season=${currentYear}&force=true`, {
            method: 'POST',
          });
        } else {
          console.log(`🔄 Auto-syncing ${sport} season ${currentYear}...`);

          await fetch(`${baseUrl}/api/games/sync?sport=${sport}&season=${currentYear}&force=true`, {
            method: 'POST',
          });
        }

        // Re-fetch games after sync
        games = await Game.find(query)
          .sort({ gameDate: 1 })
          .limit(parseInt(limit))
          .lean();

        console.log(`📊 After auto-sync: Found ${games.length} upcoming games`);
      } catch (syncError) {
        console.error('⚠️ Auto-sync failed:', syncError.message);
      }
    }

    // Add additional computed fields
    const enrichedGames = games.map((game) => {
      const now = new Date();
      const gameTime = new Date(game.gameDate);

      return {
        ...game,
        isUpcoming: gameTime > now,
        daysUntil: Math.ceil((gameTime - now) / (1000 * 60 * 60 * 24)),
        // Match the canBet logic from Game model virtual field
        canBet: (
          (game.bettingOpen !== false) && // Default true if not set
          game.status === 'scheduled' &&
          now < gameTime &&
          (!game.bettingCloseTime || now < new Date(game.bettingCloseTime))
        ),
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedGames.length,
      games: enrichedGames,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
