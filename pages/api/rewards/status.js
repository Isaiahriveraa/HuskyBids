/**
 * Daily Rewards Status API
 * Returns current daily reward and task status
 */

import Bet from '../../../models/Bet';
import { compose, withErrorHandler, withMethods, withDatabase, withAuth, withUser } from '../../../lib/middleware';

export default compose(
  withErrorHandler,
  withMethods(['GET']),
  withDatabase,
  withAuth,
  withUser
)(async (req, res) => {
  const { user } = req;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check daily login status
  let dailyLoginClaimed = false;
  if (user.lastDailyRewardClaimed) {
    const lastClaimed = new Date(user.lastDailyRewardClaimed);
    const lastClaimedDate = new Date(
      lastClaimed.getFullYear(),
      lastClaimed.getMonth(),
      lastClaimed.getDate()
    );
    dailyLoginClaimed = lastClaimedDate.getTime() === today.getTime();
  }

  // Get today's bets for task tracking
  const todayStart = new Date(today);
  const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const todayBets = await Bet.find({
    clerkId: req.userId,
    placedAt: { $gte: todayStart, $lt: todayEnd },
  }).lean();

  const todayWonBets = todayBets.filter(bet => bet.status === 'won').length;

  // Define daily tasks
  const tasks = [
    {
      id: 'daily_login',
      name: 'Claim Daily Login Bonus',
      description: 'Log in and claim your daily bonus',
      reward: 50,
      completed: dailyLoginClaimed,
      progress: dailyLoginClaimed ? 1 : 0,
      target: 1,
    },
    {
      id: 'place_3_bets',
      name: 'Place 3 Bets',
      description: 'Place at least 3 bets today',
      reward: 100,
      completed: todayBets.length >= 3,
      progress: todayBets.length,
      target: 3,
    },
    {
      id: 'win_a_bet',
      name: 'Win a Bet',
      description: 'Win at least one bet today',
      reward: 200,
      completed: todayWonBets >= 1,
      progress: todayWonBets,
      target: 1,
    },
  ];

  // Calculate total rewards earned today
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const potentialRewards = tasks.reduce((sum, t) => sum + t.reward, 0);
  const earnedRewards = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.reward, 0);

  return res.status(200).json({
    success: true,
    tasks,
    summary: {
      tasksCompleted,
      totalTasks: tasks.length,
      earnedRewards,
      potentialRewards,
    },
    streak: {
      current: user.loginStreak || 0,
      lastLogin: user.lastLoginDate,
    },
  });
});
