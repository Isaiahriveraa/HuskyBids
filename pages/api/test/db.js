import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Game from '../../../models/Game';
import Bet from '../../../models/Bet';

export default async function handler(req, res) {
  try {
    // Connect to database
    await connectDB();
    
    // Count documents in each collection
    const userCount = await User.countDocuments();
    const gameCount = await Game.countDocuments();
    const betCount = await Bet.countDocuments();
    
    // Get database stats
    const dbConnection = await connectDB();
    const dbName = dbConnection.connections[0].name;
    
    res.status(200).json({
      success: true,
      message: '✅ MongoDB connection successful!',
      database: dbName,
      collections: {
        users: userCount,
        games: gameCount,
        bets: betCount,
      },
      timestamp: new Date().toISOString(),
      mongooseVersion: require('mongoose').version,
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
