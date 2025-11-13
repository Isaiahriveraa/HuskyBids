/**
 * Get Upcoming Games from Database
 * Returns games that haven't been completed yet
 * Automatically syncs current season if no upcoming games found
 */

import connectDB from '../../../lib/mongodb';
import Game from '../../../models/Game';
import { getBaseUrl } from '../../../lib/constants/config';

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

    // Filter by status
    if (includeCompleted === 'false') {
      query.status = { $in: ['scheduled', 'live', 'postponed'] };
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
    const enrichedGames = games.map((game) => ({
      ...game,
      isUpcoming: new Date(game.gameDate) > new Date(),
      daysUntil: Math.ceil(
        (new Date(game.gameDate) - new Date()) / (1000 * 60 * 60 * 24)
      ),
      canBet: game.status === 'scheduled' && new Date(game.gameDate) > new Date(),
    }));

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
