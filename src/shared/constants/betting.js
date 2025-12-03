/**
 * Betting Constants
 * Centralized configuration for all betting-related limits and values
 */

/**
 * Betting limits and initial values
 */
export const BETTING_LIMITS = {
  MIN_BET: 10,
  MAX_BET: 10000,
  STARTING_BISCUITS: 1000,
  DEFAULT_ODDS: 2.0,
  MIN_ODDS: 1.1,
  MAX_ODDS: 10.0,
};

/**
 * Quick bet amount options for betting modal
 */
export const QUICK_BET_AMOUNTS = [50, 100, 250, 500, 1000];

/**
 * Bet status values
 */
export const BET_STATUSES = {
  PENDING: 'pending',
  WON: 'won',
  LOST: 'lost',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
};

/**
 * Game status values
 */
export const GAME_STATUSES = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  POSTPONED: 'postponed',
};

/**
 * Odds calculation configuration
 */
export const ODDS_CONFIG = {
  BISCUIT_WEIGHT: 0.7,    // 70% weight on biscuits wagered
  BET_COUNT_WEIGHT: 0.3,  // 30% weight on bet count
  HOUSE_EDGE: 0.05,       // 5% house edge
};

/**
 * Supported sports
 */
export const SPORTS = {
  FOOTBALL: 'football',
  BASKETBALL: 'basketball',
};

/**
 * Error messages for betting
 */
export const BETTING_ERRORS = {
  INSUFFICIENT_FUNDS: 'Insufficient biscuits',
  MIN_BET_NOT_MET: (min) => `Minimum bet is ${min} biscuits`,
  MAX_BET_EXCEEDED: (max) => `Maximum bet is ${max} biscuits`,
  INVALID_AMOUNT: 'Please enter a valid bet amount',
  NOT_INTEGER: 'Bet must be a whole number',
  NO_TEAM_SELECTED: 'Please select a team',
  GAME_NOT_FOUND: 'Game not found',
  BETTING_CLOSED: 'Betting is closed for this game',
  GAME_ALREADY_STARTED: 'Betting is closed - game has already started',
  GAME_NOT_SCHEDULED: 'Game is not available for betting',
};
