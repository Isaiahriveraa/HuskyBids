/**
 * Reward System Constants
 * Single source of truth for all reward-related values
 */

// Daily Login Rewards
export const DAILY_LOGIN_BONUS = 50; // Base daily login reward
export const STARTING_BISCUITS = 1000; // New user starting amount

// Login Streak Multipliers
export const STREAK_MULTIPLIERS = {
  BASE: 1,      // No streak bonus
  TIER_1: 1.5,  // 3-day streak
  TIER_2: 2,    // 7-day streak
};

// Streak Thresholds
export const STREAK_THRESHOLDS = {
  TIER_1: 3,   // Days needed for 1.5x bonus
  TIER_2: 7,   // Days needed for 2x bonus
};

/**
 * Calculate daily login reward based on streak
 * @param {number} streak - Current login streak
 * @returns {number} - Reward amount
 */
export function calculateDailyReward(streak) {
  let multiplier = STREAK_MULTIPLIERS.BASE;

  if (streak >= STREAK_THRESHOLDS.TIER_2) {
    multiplier = STREAK_MULTIPLIERS.TIER_2; // 2x for 7+ days
  } else if (streak >= STREAK_THRESHOLDS.TIER_1) {
    multiplier = STREAK_MULTIPLIERS.TIER_1; // 1.5x for 3+ days
  }

  return Math.floor(DAILY_LOGIN_BONUS * multiplier);
}

/**
 * Get date normalized to midnight
 * @param {Date} [date=new Date()] - Date to normalize (defaults to today)
 * @returns {Date} - Date at 00:00:00
 */
export function getToday(date = new Date()) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Calculate days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} - Number of days between dates
 */
export function daysBetween(date1, date2) {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
