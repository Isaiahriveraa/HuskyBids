/**
 * Daily Login Reward API
 * Allows users to manually claim their daily login reward
 * Reward amount scales with login streak
 */

import { calculateDailyReward, getToday } from '../../../lib/constants/rewards';
import { compose, withErrorHandler, withMethods, withDatabase, withAuth, withUser } from '../../../lib/middleware';

export default compose(
  withErrorHandler,
  withMethods(['POST']),
  withDatabase,
  withAuth,
  withUser
)(async (req, res) => {
  const { user } = req;

  const now = new Date();
  const today = getToday(); // Normalized to midnight

  // Check if user has already claimed today
  if (user.lastDailyRewardClaimed) {
    const lastClaimedDate = getToday(user.lastDailyRewardClaimed);

    if (lastClaimedDate.getTime() === today.getTime()) {
      return res.status(200).json({
        success: false,
        message: 'Daily reward already claimed today',
        alreadyClaimed: true,
        nextClaimTime: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      });
    }
  }

  // Use current login streak (tracked by sync-user.js)
  const currentStreak = user.loginStreak || 1;

  // Calculate reward based on streak using centralized logic
  const rewardAmount = calculateDailyReward(currentStreak);

  // Award biscuits
  user.biscuits += rewardAmount;
  user.lastDailyRewardClaimed = now;

  await user.save();

  console.log(`🎁 Daily reward claimed! ${user.username} received ${rewardAmount} biscuits (${currentStreak}x streak)`);

  return res.status(200).json({
    success: true,
    message: 'Daily reward claimed successfully',
    reward: rewardAmount,
    newBalance: user.biscuits,
    streak: currentStreak,
    nextClaimTime: new Date(today.getTime() + 24 * 60 * 60 * 1000),
  });
});
