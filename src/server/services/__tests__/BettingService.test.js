import mongoose from 'mongoose';
import BettingService from '../BettingService';
import User from '@server/models/User';
import Game from '@server/models/Game';
import Bet from '@server/models/Bet';
import { validateBet, calculateOdds } from '@shared/utils/odds-calculator';

// Robust Mongoose Mock
jest.mock('mongoose', () => {
  const mockSchemaInstance = {
    index: jest.fn(),
    virtual: jest.fn(() => ({ get: jest.fn() })),
    pre: jest.fn(),
    post: jest.fn(),
    methods: {},
    statics: {},
  };
  
  const MockSchema = jest.fn(() => mockSchemaInstance);
  MockSchema.Types = { ObjectId: 'ObjectId' };

  const mockMongoose = {
    startSession: jest.fn(),
    Types: {
      ObjectId: jest.fn((id) => id),
    },
    Schema: MockSchema,
    model: jest.fn(),
    models: {},
  };

  return {
    __esModule: true,
    ...mockMongoose,
    default: mockMongoose,
  };
});

// Mock models
jest.mock('@server/models/User', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));
jest.mock('@server/models/Game', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));
jest.mock('@server/models/Bet', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@shared/utils/odds-calculator');

describe('BettingService', () => {
  let mockSession;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup model methods
    User.findOne = jest.fn();
    Game.findById = jest.fn();
    Bet.find = jest.fn();
    
    // Mock Mongoose session and transaction
    mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    
    // Setup mongoose.startSession
    mongoose.startSession.mockResolvedValue(mockSession);

    // Default mock implementation for odds calculator
    calculateOdds.mockReturnValue({ homeOdds: 1.9, awayOdds: 1.9 });
    validateBet.mockReturnValue({ valid: true });
  });

  describe('placeBet', () => {
    const validBetParams = {
      userId: 'user123',
      gameId: 'game123',
      betAmount: 100,
      predictedWinner: 'home',
    };

    const mockUser = {
      _id: 'userId123',
      clerkId: 'user123',
      biscuits: 1000,
      save: jest.fn(),
    };

    const mockGame = {
      _id: 'game123',
      status: 'scheduled',
      startTime: new Date(Date.now() + 86400000), // Tomorrow
      gameDate: new Date(Date.now() + 86400000), // Synced with startTime
      homeBets: 0,
      awayBets: 0,
      homeBiscuitsWagered: 0,
      awayBiscuitsWagered: 0,
      save: jest.fn(),
    };

    let mockBetSave;

    beforeEach(() => {
      mockBetSave = jest.fn();
      // Mock Bet constructor to return an object with save method
      Bet.mockImplementation((data) => {
        const betInstance = {
          ...data,
          _id: 'bet123',
          save: mockBetSave,
          toObject: jest.fn().mockReturnValue({ ...data, _id: 'bet123' }),
        };
        // Ensure save resolves to the instance itself
        mockBetSave.mockResolvedValue(betInstance);
        return betInstance;
      });
    });

    // Helper to mock query chain: User.findOne().session()
    const mockFindOneSession = (result) => ({
      session: jest.fn().mockResolvedValue(result),
    });
    // Helper to mock query chain: Game.findById().session()
    const mockFindByIdSession = (result) => ({
      session: jest.fn().mockResolvedValue(result),
    });

    it('should successfully place a bet (Happy Path)', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      Game.findById.mockReturnValue(mockFindByIdSession(mockGame));
      
      const result = await BettingService.placeBet(validBetParams);

      // Verify transaction flow
      expect(mongoose.startSession).toHaveBeenCalled();
      expect(mockSession.startTransaction).toHaveBeenCalled();
      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();

      // Verify data updates
      expect(mockUser.biscuits).toBe(900); // 1000 - 100
      expect(mockUser.save).toHaveBeenCalledWith({ session: mockSession });
      expect(mockGame.homeBets).toBe(1);
      expect(mockGame.save).toHaveBeenCalledWith({ session: mockSession });
      expect(mockBetSave).toHaveBeenCalledWith({ session: mockSession });
      
      // Verify result structure
      expect(result).toHaveProperty('bet');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('game');
    });

    it('should throw error if user not found', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(null));
      Game.findById.mockReturnValue(mockFindByIdSession(mockGame));

      await expect(BettingService.placeBet(validBetParams))
        .rejects.toThrow('User not found');
      
      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it('should throw error if game not found', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      Game.findById.mockReturnValue(mockFindByIdSession(null));

      await expect(BettingService.placeBet(validBetParams))
        .rejects.toThrow('Game not found');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it('should throw error if bet validation fails', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      Game.findById.mockReturnValue(mockFindByIdSession(mockGame));
      validateBet.mockReturnValue({ valid: false, error: 'Invalid bet' });

      await expect(BettingService.placeBet(validBetParams))
        .rejects.toThrow('Invalid bet');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it('should throw error if predictedWinner is invalid', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      Game.findById.mockReturnValue(mockFindByIdSession(mockGame));

      const invalidParams = { ...validBetParams, predictedWinner: 'draw' };

      await expect(BettingService.placeBet(invalidParams))
        .rejects.toThrow('predictedWinner must be "home" or "away"');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it('should throw error if game is not scheduled', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      const liveGame = { ...mockGame, status: 'live' };
      Game.findById.mockReturnValue(mockFindByIdSession(liveGame));

      await expect(BettingService.placeBet(validBetParams))
        .rejects.toThrow('Game is live and not available for betting');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it('should throw error if game has already started (outside buffer)', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      const pastGame = { 
        ...mockGame, 
        startTime: new Date(Date.now() - 6000), // Started 6s ago (outside 5s buffer)
        gameDate: new Date(Date.now() - 6000) 
      };
      Game.findById.mockReturnValue(mockFindByIdSession(pastGame));

      await expect(BettingService.placeBet(validBetParams))
        .rejects.toThrow(/Betting is closed - game has already started/);

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it('should allow bet if game started recently (within 5s buffer)', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      const bufferGame = {
        ...mockGame,
        startTime: new Date(Date.now() - 2000), // Started 2s ago (inside 5s buffer)
        gameDate: new Date(Date.now() - 2000)
      };
      Game.findById.mockReturnValue(mockFindByIdSession(bufferGame));

      // Should not throw
      const result = await BettingService.placeBet(validBetParams);

      expect(result).toHaveProperty('bet');
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    it('should calculate correct odds based on team selection', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      Game.findById.mockReturnValue(mockFindByIdSession(mockGame));
      calculateOdds.mockReturnValue({ homeOdds: 2.5, awayOdds: 1.5 });

      // Test Home Bet
      await BettingService.placeBet({ ...validBetParams, predictedWinner: 'home' });
      // The bet created should have homeOdds (2.5)
      expect(Bet).toHaveBeenCalledWith(expect.objectContaining({ odds: 2.5 }));

      // Test Away Bet
      await BettingService.placeBet({ ...validBetParams, predictedWinner: 'away' });
      expect(Bet).toHaveBeenCalledWith(expect.objectContaining({ odds: 1.5 }));
    });

    it('should handle database transaction errors', async () => {
      User.findOne.mockReturnValue(mockFindOneSession(mockUser));
      Game.findById.mockReturnValue(mockFindByIdSession(mockGame));
      // Simulate save error
      mockUser.save.mockRejectedValue(new Error('DB Error'));

      await expect(BettingService.placeBet(validBetParams))
        .rejects.toThrow('DB Error');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
      expect(mockSession.commitTransaction).not.toHaveBeenCalled();
    });
  });

  describe('settleBetsForGame', () => {
    const gameId = 'game123';
    const winner = 'home';
    
    // Helper for Bet.find().session()
    const mockFindSession = (result) => ({
      session: jest.fn().mockResolvedValue(result),
    });

    it('should settle bets correctly (Happy Path)', async () => {
      const mockBets = [
        { 
          _id: 'bet1', 
          predictedWinner: 'home', 
          potentialWin: 200, 
          clerkId: 'user1',
          save: jest.fn()
        },
        { 
          _id: 'bet2', 
          predictedWinner: 'away', 
          betAmount: 100,
          clerkId: 'user2',
          save: jest.fn()
        }
      ];

      const mockUser1 = { 
        clerkId: 'user1', 
        biscuits: 1000, 
        save: jest.fn() 
      };
      const mockUser2 = { 
        clerkId: 'user2', 
        biscuits: 1000, 
        save: jest.fn() 
      };

      Bet.find.mockReturnValue(mockFindSession(mockBets));
      User.findOne
        .mockReturnValueOnce(mockFindSession(mockUser1)) // For bet1
        .mockReturnValueOnce(mockFindSession(mockUser2)); // For bet2

      const result = await BettingService.settleBetsForGame(gameId, winner);

      // Verify stats
      expect(result.settled).toBe(2);
      expect(result.won).toBe(1);
      expect(result.lost).toBe(1);
      expect(result.totalPaidOut).toBe(200);

      // Verify User 1 (Winner)
      expect(mockUser1.biscuits).toBe(1200); // 1000 + 200
      expect(mockUser1.winningBets).toBe(1);
      expect(mockBets[0].status).toBe('won');
      
      // Verify User 2 (Loser)
      expect(mockUser2.biscuits).toBe(1000); // Unchanged
      expect(mockUser2.losingBets).toBe(1);
      expect(mockBets[1].status).toBe('lost');

      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    it('should handle case where user is not found during settlement', async () => {
      const mockBets = [
        { _id: 'bet1', predictedWinner: 'home', clerkId: 'missing_user', save: jest.fn() }
      ];

      Bet.find.mockReturnValue(mockFindSession(mockBets));
      User.findOne.mockReturnValue(mockFindSession(null));

      await expect(BettingService.settleBetsForGame(gameId, winner))
        .rejects.toThrow('User not found for bet bet1');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      Bet.find.mockReturnValue({
        session: jest.fn().mockRejectedValue(new Error('DB Query Failed'))
      });

      await expect(BettingService.settleBetsForGame(gameId, winner))
        .rejects.toThrow('DB Query Failed');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });
  });

  describe('refundBetsForGame', () => {
    const gameId = 'gameRefund';
    const reason = 'Rain delay';

    const mockFindSession = (result) => ({
      session: jest.fn().mockResolvedValue(result),
    });

    it('should refund all pending bets', async () => {
      const mockBets = [
        { 
          _id: 'bet1', 
          betAmount: 100, 
          clerkId: 'user1',
          save: jest.fn()
        }
      ];

      const mockUser = { 
        clerkId: 'user1', 
        biscuits: 500, 
        save: jest.fn() 
      };

      Bet.find.mockReturnValue(mockFindSession(mockBets));
      User.findOne.mockReturnValue(mockFindSession(mockUser));

      const result = await BettingService.refundBetsForGame(gameId, reason);

      expect(result.refunded).toBe(1);
      expect(result.totalRefunded).toBe(100);
      expect(result.reason).toBe(reason);

      // Verify User Refund
      expect(mockUser.biscuits).toBe(600); // 500 + 100
      expect(mockBets[0].status).toBe('refunded');
      expect(mockBets[0].notes).toBe(reason);

      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    it('should skip refund if user is not found but continue (as per logic warning)', async () => {
        const mockBets = [
            { _id: 'bet1', betAmount: 100, clerkId: 'missing', save: jest.fn() }
        ];

        Bet.find.mockReturnValue(mockFindSession(mockBets));
        User.findOne.mockReturnValue(mockFindSession(null));

        const result = await BettingService.refundBetsForGame(gameId);

        expect(result.refunded).toBe(1);
        expect(result.totalRefunded).toBe(0); // Skipped
        expect(mockBets[0].save).not.toHaveBeenCalled();
    });

    it('should rollback transaction on error during refund', async () => {
      Bet.find.mockReturnValue({
        session: jest.fn().mockRejectedValue(new Error('Refund DB Error'))
      });

      await expect(BettingService.refundBetsForGame(gameId))
        .rejects.toThrow('Refund DB Error');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });
  });

  describe('getUserBettingSummary', () => {
    it('should return user summary stats', async () => {
      const mockUser = {
        totalBets: 10,
        winningBets: 5,
        losingBets: 5,
        pendingBets: 0,
        totalBiscuitsWagered: 1000,
        totalBiscuitsWon: 1500,
        totalBiscuitsLost: 500,
      };

      const mockPendingBets = [{ _id: 'p1' }];
      const mockRecentBets = [{ _id: 'r1' }];

      User.findOne.mockResolvedValue(mockUser);
      
      Bet.find.mockImplementation((query) => {
        if (query.status === 'pending') {
            return {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockPendingBets)
            };
        } else {
            return {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(mockRecentBets)
            };
        }
      });

      const result = await BettingService.getUserBettingSummary('user1');

      expect(result.summary.totalBets).toBe(10);
      expect(result.pendingBets).toEqual(mockPendingBets);
      expect(result.recentBets).toEqual(mockRecentBets);
    });
  });
});