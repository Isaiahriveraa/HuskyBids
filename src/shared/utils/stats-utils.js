/**
 * Statistics Utility Functions
 * Centralized calculation logic for user statistics and analytics
 */

/**
 * Calculates win rate percentage
 * @param {number} winningBets - Number of bets won
 * @param {number} totalBets - Total number of bets
 * @param {number} precision - Decimal places (default: 1)
 * @returns {number} Win rate as percentage
 */
export function calculateWinRate(winningBets, totalBets, precision = 1) {
  if (!totalBets || totalBets === 0) return 0;

  const rate = (winningBets / totalBets) * 100;
  return Math.round(rate * Math.pow(10, precision)) / Math.pow(10, precision);
}

/**
 * Calculates Return on Investment (ROI)
 * @param {number} totalWon - Total biscuits won
 * @param {number} totalLost - Total biscuits lost
 * @param {number} totalWagered - Total biscuits wagered
 * @param {number} precision - Decimal places (default: 2)
 * @returns {number} ROI as percentage
 */
export function calculateROI(totalWon, totalLost, totalWagered, precision = 2) {
  // If no wagered amount provided, fall back to won + lost as approximation
  const wagered = totalWagered || (totalWon + totalLost);

  if (!wagered || wagered === 0) return 0;

  const netProfit = totalWon - totalLost;
  const roi = (netProfit / wagered) * 100;

  return Math.round(roi * Math.pow(10, precision)) / Math.pow(10, precision);
}

/**
 * Gets today's date at midnight (for date comparisons)
 * @returns {Date} Today's date at 00:00:00
 */
export function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Calculates profit/loss
 * @param {number} totalWon - Total biscuits won
 * @param {number} totalLost - Total biscuits lost
 * @returns {number} Net profit (positive) or loss (negative)
 */
export function calculateProfitLoss(totalWon, totalLost) {
  return (totalWon || 0) - (totalLost || 0);
}

/**
 * Formats biscuits amount with commas
 * @param {number} amount - Biscuit amount
 * @returns {string} Formatted amount
 */
export function formatBiscuits(amount) {
  if (amount === null || amount === undefined) return '0';
  return amount.toLocaleString('en-US');
}

/**
 * Formats percentage value
 * @param {number} value - Percentage value
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculates average bet size
 * @param {number} totalWagered - Total biscuits wagered
 * @param {number} totalBets - Total number of bets
 * @returns {number} Average bet size
 */
export function calculateAverageBetSize(totalWagered, totalBets) {
  if (!totalBets || totalBets === 0) return 0;
  return Math.round(totalWagered / totalBets);
}

/**
 * Determines betting tier/rank based on total bets
 * @param {number} totalBets - Total number of bets
 * @returns {Object} Tier information
 */
export function getBettingTier(totalBets) {
  if (totalBets >= 1000) return { name: 'Legend', icon: '👑', color: 'gold' };
  if (totalBets >= 500) return { name: 'Master', icon: '💎', color: 'purple' };
  if (totalBets >= 250) return { name: 'Expert', icon: '⭐', color: 'blue' };
  if (totalBets >= 100) return { name: 'Pro', icon: '🔥', color: 'orange' };
  if (totalBets >= 50) return { name: 'Veteran', icon: '🎯', color: 'green' };
  if (totalBets >= 10) return { name: 'Regular', icon: '📈', color: 'teal' };
  return { name: 'Rookie', icon: '🌱', color: 'gray' };
}

/**
 * Checks if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const today = getToday();
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate.getTime() === today.getTime();
}

/**
 * Gets days between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Days between dates
 */
export function getDaysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats a streak count
 * @param {number} streak - Streak count
 * @param {string} unit - Unit name (default: 'day')
 * @returns {string} Formatted streak
 */
export function formatStreak(streak, unit = 'day') {
  if (streak === 0) return `No ${unit} streak`;
  if (streak === 1) return `1 ${unit} streak`;
  return `${streak} ${unit} streak`;
}
