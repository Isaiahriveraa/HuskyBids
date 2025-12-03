import { useCallback } from 'react';
import {
  BETTING_LIMITS,
  BETTING_ERRORS,
  GAME_STATUSES,
} from '@shared/constants/betting';

/**
 * Custom hook for validating bet inputs with on-demand validation.
 * 
 * Provides two functions:
 * - validate(): Full validation for bet submission
 * - canBet(): Quick check if game is available for betting (for proactive UI disabling)
 * 
 * @returns {{ validate: Function, canBet: Function }}
 * 
 * @example
 * const { validate, canBet } = useBetValidation();
 * 
 * // Check if betting is available for this game
 * const { canBet: isBettable, reason } = canBet(game);
 * if (!isBettable) console.log(reason);
 * 
 * // Validate full bet before submission
 * const { valid, error } = validate({ amount: 100, selectedTeam: 'home', userBiscuits: 500, game });
 */
export function useBetValidation() {
  /**
   * Check if a game is available for betting.
   * Use this for proactive UI disabling (disable bet button before user attempts).
   * 
   * @param {Object} game - Game object with status and startTime
   * @returns {{ canBet: boolean, reason: string | null }}
   */
  const canBet = useCallback((game) => {
    // Debug logging - remove after fixing validation issue
    const DEBUG = true;
    
    if (!game) {
      if (DEBUG) console.log('[useBetValidation] canBet: game is null/undefined');
      return { canBet: false, reason: BETTING_ERRORS.GAME_NOT_FOUND };
    }

    // Check game status - only scheduled games can be bet on
    if (game.status !== GAME_STATUSES.SCHEDULED) {
      if (DEBUG) console.log('[useBetValidation] canBet: game status is not scheduled', { status: game.status });
      return { canBet: false, reason: BETTING_ERRORS.GAME_NOT_SCHEDULED };
    }

    // Check if game has already started (startTime or gameDate in the past)
    // Only perform check if we have a valid time value
    const gameTimeValue = game.startTime || game.gameDate;
    if (gameTimeValue) {
      const gameTime = new Date(gameTimeValue);
      const now = new Date();

      if (DEBUG) {
        const isValidDate = !isNaN(gameTime.getTime());
        console.log('[useBetValidation] canBet: Date comparison debug', {
          gameId: game._id,
          startTime: game.startTime,
          gameDate: game.gameDate,
          usedValue: gameTimeValue,
          gameTimeParsed: isValidDate ? gameTime.toISOString() : 'Invalid Date',
          now: now.toISOString(),
          isValidDate,
          isGameInPast: isValidDate ? gameTime < now : 'N/A',
          differenceMs: isValidDate ? gameTime.getTime() - now.getTime() : 'N/A',
          differenceHours: isValidDate ? ((gameTime.getTime() - now.getTime()) / (1000 * 60 * 60)).toFixed(2) : 'N/A',
        });
      }

      // Validate that we got a valid date before comparing
      // isNaN check prevents false negatives from Invalid Date
      // Use strict < (not <=) so betting closes exactly when game starts
      if (!isNaN(gameTime.getTime()) && gameTime < now) {
        if (DEBUG) console.log('[useBetValidation] canBet: game has already started');
        return { canBet: false, reason: BETTING_ERRORS.GAME_ALREADY_STARTED };
      }
    } else {
      if (DEBUG) console.log('[useBetValidation] canBet: no startTime or gameDate available, allowing bet');
    }

    if (DEBUG) console.log('[useBetValidation] canBet: all checks passed, betting allowed');
    return { canBet: true, reason: null };
  }, []);

  /**
   * Full validation for bet submission.
   * Checks all inputs: team selection, amount validity, balance, and game status.
   * 
   * @param {Object} params - Validation parameters
   * @param {number} params.amount - Bet amount (should be parsed integer)
   * @param {string} params.selectedTeam - 'home' or 'away'
   * @param {number} params.userBiscuits - User's available biscuits
   * @param {Object} params.game - Game object
   * @returns {{ valid: boolean, error: string | null }}
   */
  const validate = useCallback(({ amount, selectedTeam, userBiscuits, game }) => {
    // 1. Team selection required
    if (!selectedTeam) {
      return { valid: false, error: BETTING_ERRORS.NO_TEAM_SELECTED };
    }

    // 2. Team must be 'home' or 'away'
    if (selectedTeam !== 'home' && selectedTeam !== 'away') {
      return { valid: false, error: BETTING_ERRORS.NO_TEAM_SELECTED };
    }

    // 3. Amount must exist and be positive
    if (amount === null || amount === undefined || amount <= 0) {
      return { valid: false, error: BETTING_ERRORS.INVALID_AMOUNT };
    }

    // 4. Amount must be a whole number (integer check)
    if (!Number.isInteger(amount)) {
      return { valid: false, error: BETTING_ERRORS.NOT_INTEGER };
    }

    // 5. Amount must meet minimum bet
    if (amount < BETTING_LIMITS.MIN_BET) {
      return { valid: false, error: BETTING_ERRORS.MIN_BET_NOT_MET(BETTING_LIMITS.MIN_BET) };
    }

    // 6. Amount must not exceed maximum bet
    if (amount > BETTING_LIMITS.MAX_BET) {
      return { valid: false, error: BETTING_ERRORS.MAX_BET_EXCEEDED(BETTING_LIMITS.MAX_BET) };
    }

    // 7. User must have sufficient biscuits
    if (amount > userBiscuits) {
      return { valid: false, error: BETTING_ERRORS.INSUFFICIENT_FUNDS };
    }

    // 8. Game status validation
    const gameCheck = canBet(game);
    if (!gameCheck.canBet) {
      return { valid: false, error: gameCheck.reason };
    }

    return { valid: true, error: null };
  }, [canBet]);

  return { validate, canBet };
}
