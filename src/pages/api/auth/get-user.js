/**
 * Get User Data from MongoDB
 * Returns user information including biscuits, stats, etc.
 */

import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@server/db';
import User from '@server/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user from Clerk
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Connect to database
    await connectDB();

    // Find user in MongoDB
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found in database',
        clerkId: userId,
      });
    }

    // Return user data (including virtual fields)
    const userData = {
      _id: user._id,
      clerkId: user.clerkId,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      biscuits: user.biscuits,
      totalBets: user.totalBets,
      winningBets: user.winningBets,
      losingBets: user.losingBets,
      pendingBets: user.pendingBets,
      winRate: user.winRate, // Virtual field
      lastLoginDate: user.lastLoginDate,
      loginStreak: user.loginStreak,
      totalBiscuitsWon: user.totalBiscuitsWon,
      totalBiscuitsLost: user.totalBiscuitsLost,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
