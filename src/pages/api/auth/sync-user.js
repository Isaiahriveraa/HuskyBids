/**
 * Sync Clerk User to MongoDB
 * Creates or updates user in MongoDB when they sign up or log in
 * Tracks login streaks (rewards are claimed separately via /api/rewards/daily-login)
 */

import { getAuth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@server/db';
import User from '@server/models/User';
import { STARTING_BISCUITS, daysBetween } from '@shared/constants/rewards';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user from Clerk
    const { userId } = getAuth(req);

    if (!userId) {
      console.error('[SYNC-USER] No authenticated user');
      return res.status(401).json({
        error: 'Unauthorized',
        hint: 'User not authenticated with Clerk'
      });
    }

    console.log('[SYNC-USER] Authenticated user:', userId);

    // Connect to database
    await connectDB();

    // Check if user exists in MongoDB
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      // User exists - update login streak (NO automatic bonus)
      const now = new Date();
      const lastLogin = user.lastLoginDate;

      // Calculate days since last login
      let daysSinceLastLogin = 0;
      if (lastLogin) {
        daysSinceLastLogin = daysBetween(lastLogin, now);
      }

      // Update login streak based on days since last login
      if (!lastLogin || daysSinceLastLogin > 1) {
        // First login ever or streak broken - reset to 1
        user.loginStreak = 1;
      } else if (daysSinceLastLogin === 1) {
        // Consecutive day login - increment streak
        user.loginStreak += 1;
      }
      // If daysSinceLastLogin === 0, same day login, streak stays the same

      // Update last login date
      user.lastLoginDate = now;
      await user.save();

      console.log(`✅ User synced: ${user.username}, Streak: ${user.loginStreak} days`);

      return res.status(200).json({
        success: true,
        user: user,
        message: 'User synced successfully',
        isNewUser: false,
        loginStreak: user.loginStreak,
      });
    } else {
      // User doesn't exist in MongoDB - create them
      // This happens on first login after Clerk signup

      // Fetch user details from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      // Extract username and email
      const username = clerkUser.username ||
                      clerkUser.firstName ||
                      clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] ||
                      `user_${userId.slice(-8)}`;

      const email = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;
      const profileImage = clerkUser.imageUrl || null;

      // Create new user in MongoDB with default values
      user = await User.create({
        clerkId: userId,
        username: username,
        email: email,
        profileImage: profileImage,
        biscuits: STARTING_BISCUITS,
        lastLoginDate: new Date(),
        loginStreak: 1,
      });

      console.log(`✅ Created new user in MongoDB: ${username} (${userId}) with ${STARTING_BISCUITS} starting biscuits`);

      return res.status(201).json({
        success: true,
        user: user,
        message: `Welcome to HuskyBids! You start with ${STARTING_BISCUITS} biscuits!`,
        isNewUser: true,
        startingBiscuits: STARTING_BISCUITS,
      });
    }
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
