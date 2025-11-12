import connectDB from '../../../lib/mongodb';
import Game from '../../../models/Game';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Get all games with their statuses
    const allGames = await Game.find({})
      .select('homeTeam awayTeam gameDate status homeScore awayScore sport')
      .sort({ gameDate: -1 })
      .limit(20)
      .lean();

    // Count by status
    const statusCounts = await Game.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get games with scores (likely completed)
    const gamesWithScores = await Game.find({
      homeScore: { $exists: true, $ne: null },
      awayScore: { $exists: true, $ne: null }
    })
      .select('homeTeam awayTeam gameDate status homeScore awayScore sport')
      .sort({ gameDate: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      totalGames: await Game.countDocuments(),
      statusCounts,
      recentGames: allGames,
      gamesWithScores,
    });
  } catch (error) {
    console.error('Error checking games:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
