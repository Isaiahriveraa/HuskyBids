import { BETTING_LIMITS } from '../../../lib/constants/betting';

/**
 * Custom hook for validating bet inputs
 * @param {number} betAmount - Amount to bet
 * @param {string} selectedTeam - Selected team ('home' or 'away')
 * @param {number} userBiscuits - User's available biscuits
 * @returns {Object} - { valid, error }
 */
export function useBetValidation(betAmount, selectedTeam, userBiscuits) {
  if (!selectedTeam) {
    return { valid: false, error: 'Please select a team' };
  }

  if (!betAmount || betAmount <= 0) {
    return { valid: false, error: 'Please enter a bet amount' };
  }

  if (betAmount < BETTING_LIMITS.MIN_BET) {
    return { valid: false, error: `Minimum bet is ${BETTING_LIMITS.MIN_BET} biscuits` };
  }

  if (betAmount > BETTING_LIMITS.MAX_BET) {
    return { valid: false, error: `Maximum bet is ${BETTING_LIMITS.MAX_BET} biscuits` };
  }

  if (betAmount > userBiscuits) {
    return { valid: false, error: 'Insufficient biscuits' };
  }

  return { valid: true, error: null };
}
