/**
 * Odds Calculator for HuskyBids
 * Calculates dynamic odds based on betting distribution
 */

/**
 * Calculate odds for home and away teams based on betting distribution
 * @param {number} homeBets - Number of bets on home team
 * @param {number} awayBets - Number of bets on away team
 * @param {number} homeBiscuits - Total biscuits bet on home team
 * @param {number} awayBiscuits - Total biscuits bet on away team
 * @returns {object} - { homeOdds, awayOdds }
 */
export function calculateOdds(homeBets = 0, awayBets = 0, homeBiscuits = 0, awayBiscuits = 0) {
  const MIN_ODDS = 1.1;
  const MAX_ODDS = 10.0;
  const DEFAULT_ODDS = 2.0;

  // If no bets placed yet, return default odds
  if (homeBets === 0 && awayBets === 0) {
    return {
      homeOdds: DEFAULT_ODDS,
      awayOdds: DEFAULT_ODDS,
    };
  }

  // Calculate total bets and biscuits
  const totalBets = homeBets + awayBets;
  const totalBiscuits = homeBiscuits + awayBiscuits;

  // If only one side has bets, give them low odds and other side high odds
  if (homeBets === 0) {
    return { homeOdds: MAX_ODDS, awayOdds: MIN_ODDS };
  }
  if (awayBets === 0) {
    return { homeOdds: MIN_ODDS, awayOdds: MAX_ODDS };
  }

  // Calculate percentage of bets on each side
  const homePercentage = homeBets / totalBets;
  const awayPercentage = awayBets / totalBets;

  // Weight by amount wagered (more important than bet count)
  const homeBiscuitPercentage = totalBiscuits > 0 ? homeBiscuits / totalBiscuits : 0.5;
  const awayBiscuitPercentage = totalBiscuits > 0 ? awayBiscuits / totalBiscuits : 0.5;

  // Combine bet count and biscuit amount (70% weight on biscuits, 30% on bet count)
  const homeWeight = homeBiscuitPercentage * 0.7 + homePercentage * 0.3;
  const awayWeight = awayBiscuitPercentage * 0.7 + awayPercentage * 0.3;

  // Calculate odds (inverse of probability)
  // More bets on a side = lower odds (less risky = less reward)
  let homeOdds = 1 / homeWeight;
  let awayOdds = 1 / awayWeight;

  // Apply slight house edge (reduce odds by 5%)
  homeOdds *= 0.95;
  awayOdds *= 0.95;

  // Clamp odds to min/max range
  homeOdds = Math.max(MIN_ODDS, Math.min(MAX_ODDS, homeOdds));
  awayOdds = Math.max(MIN_ODDS, Math.min(MAX_ODDS, awayOdds));

  // Round to 2 decimal places
  homeOdds = Math.round(homeOdds * 100) / 100;
  awayOdds = Math.round(awayOdds * 100) / 100;

  return { homeOdds, awayOdds };
}

/**
 * Calculate potential winnings for a bet
 * @param {number} betAmount - Amount of biscuits bet
 * @param {number} odds - Odds multiplier
 * @returns {number} - Total payout (includes original bet)
 */
export function calculatePayout(betAmount, odds) {
  return Math.round(betAmount * odds);
}

/**
 * Calculate profit (payout minus original bet)
 * @param {number} betAmount - Amount of biscuits bet
 * @param {number} odds - Odds multiplier
 * @returns {number} - Profit amount
 */
export function calculateProfit(betAmount, odds) {
  const payout = calculatePayout(betAmount, odds);
  return payout - betAmount;
}

/**
 * Format odds for display (e.g., "2.5x" or "+150")
 * @param {number} odds - Odds multiplier
 * @param {string} format - 'multiplier' or 'american'
 * @returns {string} - Formatted odds string
 */
export function formatOdds(odds, format = 'multiplier') {
  if (format === 'american') {
    // Convert decimal odds to American odds
    if (odds >= 2.0) {
      const americanOdds = Math.round((odds - 1) * 100);
      return `+${americanOdds}`;
    } else {
      const americanOdds = Math.round(-100 / (odds - 1));
      return `${americanOdds}`;
    }
  }

  // Default: multiplier format
  return `${odds.toFixed(2)}x`;
}

/**
 * Validate bet amount
 * @param {number} betAmount - Amount to bet
 * @param {number} userBiscuits - User's available biscuits
 * @param {number} minBet - Minimum bet amount
 * @param {number} maxBet - Maximum bet amount
 * @returns {object} - { valid, error }
 */
export function validateBet(betAmount, userBiscuits, minBet = 10, maxBet = 10000) {
  if (!betAmount || betAmount <= 0) {
    return { valid: false, error: 'Bet amount must be greater than 0' };
  }

  if (betAmount < minBet) {
    return { valid: false, error: `Minimum bet is ${minBet} biscuits` };
  }

  if (betAmount > maxBet) {
    return { valid: false, error: `Maximum bet is ${maxBet} biscuits` };
  }

  if (betAmount > userBiscuits) {
    return { valid: false, error: 'Insufficient biscuits' };
  }

  // Check if it's a valid number
  if (!Number.isInteger(betAmount)) {
    return { valid: false, error: 'Bet amount must be a whole number' };
  }

  return { valid: true, error: null };
}

/**
 * Calculate house edge percentage
 * @param {number} homeOdds - Home team odds
 * @param {number} awayOdds - Away team odds
 * @returns {number} - House edge percentage
 */
export function calculateHouseEdge(homeOdds, awayOdds) {
  const impliedProbability = 1 / homeOdds + 1 / awayOdds;
  const houseEdge = ((impliedProbability - 1) * 100).toFixed(2);
  return parseFloat(houseEdge);
}
