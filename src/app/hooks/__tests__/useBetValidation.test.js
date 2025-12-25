import { renderHook } from '@testing-library/react';
import { useBetValidation } from '../useBetValidation';
import { BETTING_LIMITS, BETTING_ERRORS, GAME_STATUSES } from '@shared/constants/betting';

describe('useBetValidation', () => {
  // Helper to create a valid scheduled game
  const createScheduledGame = (overrides = {}) => ({
    _id: 'game-123',
    status: GAME_STATUSES.SCHEDULED,
    gameDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    homeTeam: 'Washington Huskies',
    awayTeam: 'Oregon Ducks',
    homeOdds: 1.8,
    awayOdds: 2.2,
    ...overrides,
  });

  describe('canBet()', () => {
    it('should return canBet: true for a scheduled game in the future', () => {
      const { result } = renderHook(() => useBetValidation());
      const game = createScheduledGame();

      const check = result.current.canBet(game);

      expect(check.canBet).toBe(true);
      expect(check.reason).toBeNull();
    });

    it('should return canBet: false when game is null', () => {
      const { result } = renderHook(() => useBetValidation());

      const check = result.current.canBet(null);

      expect(check.canBet).toBe(false);
      expect(check.reason).toBe(BETTING_ERRORS.GAME_NOT_FOUND);
    });

    it('should return canBet: false for completed games', () => {
      const { result } = renderHook(() => useBetValidation());
      const game = createScheduledGame({ status: GAME_STATUSES.COMPLETED });

      const check = result.current.canBet(game);

      expect(check.canBet).toBe(false);
      expect(check.reason).toBe(BETTING_ERRORS.GAME_NOT_SCHEDULED);
    });

    it('should return canBet: false for live games', () => {
      const { result } = renderHook(() => useBetValidation());
      const game = createScheduledGame({ status: GAME_STATUSES.LIVE });

      const check = result.current.canBet(game);

      expect(check.canBet).toBe(false);
      expect(check.reason).toBe(BETTING_ERRORS.GAME_NOT_SCHEDULED);
    });

    it('should return canBet: false for cancelled games', () => {
      const { result } = renderHook(() => useBetValidation());
      const game = createScheduledGame({ status: GAME_STATUSES.CANCELLED });

      const check = result.current.canBet(game);

      expect(check.canBet).toBe(false);
      expect(check.reason).toBe(BETTING_ERRORS.GAME_NOT_SCHEDULED);
    });

    it('should return canBet: false when game has already started', () => {
      const { result } = renderHook(() => useBetValidation());
      const game = createScheduledGame({
        gameDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      });

      const check = result.current.canBet(game);

      expect(check.canBet).toBe(false);
      expect(check.reason).toBe(BETTING_ERRORS.GAME_ALREADY_STARTED);
    });

    it('should return canBet: true when gameDate is undefined', () => {
      const { result } = renderHook(() => useBetValidation());
      const game = createScheduledGame({
        gameDate: undefined,
      });

      const check = result.current.canBet(game);

      // When no time data, allow betting if status is scheduled
      expect(check.canBet).toBe(true);
      expect(check.reason).toBeNull();
    });

    it('should return canBet: true when gameDate is invalid date string', () => {
      const { result } = renderHook(() => useBetValidation());
      const game = createScheduledGame({
        gameDate: 'invalid-date',
      });

      const check = result.current.canBet(game);

      // When date is unparseable, allow betting if status is scheduled
      expect(check.canBet).toBe(true);
      expect(check.reason).toBeNull();
    });
  });

  describe('validate()', () => {
    const defaultParams = () => ({
      amount: 100,
      selectedTeam: 'home',
      userBiscuits: 1000,
      game: createScheduledGame(),
    });

    it('should return valid: true for valid bet input', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate(defaultParams());

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeNull();
    });

    it('should return error when no team is selected', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        selectedTeam: null,
      });

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(BETTING_ERRORS.NO_TEAM_SELECTED);
    });

    it('should return error for invalid team selection', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        selectedTeam: 'invalid',
      });

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(BETTING_ERRORS.NO_TEAM_SELECTED);
    });

    it('should return error when amount is null or undefined', () => {
      const { result } = renderHook(() => useBetValidation());

      const validationNull = result.current.validate({
        ...defaultParams(),
        amount: null,
      });
      const validationUndefined = result.current.validate({
        ...defaultParams(),
        amount: undefined,
      });

      expect(validationNull.valid).toBe(false);
      expect(validationNull.error).toBe(BETTING_ERRORS.INVALID_AMOUNT);
      expect(validationUndefined.valid).toBe(false);
      expect(validationUndefined.error).toBe(BETTING_ERRORS.INVALID_AMOUNT);
    });

    it('should return error when amount is zero or negative', () => {
      const { result } = renderHook(() => useBetValidation());

      const validationZero = result.current.validate({
        ...defaultParams(),
        amount: 0,
      });
      const validationNegative = result.current.validate({
        ...defaultParams(),
        amount: -50,
      });

      expect(validationZero.valid).toBe(false);
      expect(validationZero.error).toBe(BETTING_ERRORS.INVALID_AMOUNT);
      expect(validationNegative.valid).toBe(false);
      expect(validationNegative.error).toBe(BETTING_ERRORS.INVALID_AMOUNT);
    });

    it('should return error when amount is not a whole number', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        amount: 50.5,
      });

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(BETTING_ERRORS.NOT_INTEGER);
    });

    it('should return error when amount is below minimum bet', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        amount: BETTING_LIMITS.MIN_BET - 1, // 9 biscuits
      });

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(BETTING_ERRORS.MIN_BET_NOT_MET(BETTING_LIMITS.MIN_BET));
    });

    it('should return error when amount exceeds maximum bet', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        amount: BETTING_LIMITS.MAX_BET + 1, // 10001 biscuits
        userBiscuits: BETTING_LIMITS.MAX_BET + 1000, // User has enough
      });

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(BETTING_ERRORS.MAX_BET_EXCEEDED(BETTING_LIMITS.MAX_BET));
    });

    it('should return error when user has insufficient biscuits', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        amount: 500,
        userBiscuits: 100, // Only 100 biscuits available
      });

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(BETTING_ERRORS.INSUFFICIENT_FUNDS);
    });

    it('should return error when game is not scheduled', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        game: createScheduledGame({ status: GAME_STATUSES.COMPLETED }),
      });

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(BETTING_ERRORS.GAME_NOT_SCHEDULED);
    });

    it('should return error when game has already started', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        game: createScheduledGame({
          gameDate: new Date(Date.now() - 3600000).toISOString(),
        }),
      });

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(BETTING_ERRORS.GAME_ALREADY_STARTED);
    });

    it('should allow bet exactly at minimum amount', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        amount: BETTING_LIMITS.MIN_BET, // 10 biscuits
      });

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeNull();
    });

    it('should allow bet exactly at maximum amount', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        amount: BETTING_LIMITS.MAX_BET, // 10000 biscuits
        userBiscuits: BETTING_LIMITS.MAX_BET,
      });

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeNull();
    });

    it('should allow away team selection', () => {
      const { result } = renderHook(() => useBetValidation());

      const validation = result.current.validate({
        ...defaultParams(),
        selectedTeam: 'away',
      });

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeNull();
    });
  });
});
