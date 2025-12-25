import GameService from '../GameService';
import Game from '@server/models/Game';
import BettingService from '../BettingService';
import { calculateOdds } from '@shared/utils/odds-calculator';

// Mock dependencies
jest.mock('@server/models/Game', () => {
  // Create a mock class that includes static methods
  const MockGame = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn(),
  }));
  
  // Add static methods to the mock class
  MockGame.findOne = jest.fn();
  MockGame.findById = jest.fn();
  MockGame.find = jest.fn();
  MockGame.countDocuments = jest.fn();
  MockGame.aggregate = jest.fn();

  return {
    __esModule: true,
    default: MockGame,
  };
});

jest.mock('../BettingService', () => ({
  __esModule: true,
  default: {
    refundBetsForGame: jest.fn(),
    settleBetsForGame: jest.fn(),
    closeGameBetting: jest.fn(), // If called internally or not needed
  },
}));

jest.mock('@shared/utils/odds-calculator', () => ({
  calculateOdds: jest.fn(),
}));

describe('GameService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation that handles potential zero inputs gracefully
    // mimicking a safe "initial" state if inputs are zero
    calculateOdds.mockImplementation((h, a) => {
      if (h === 0 && a === 0) return { homeOdds: 1.9, awayOdds: 1.9 }; // Default/Start
      return { homeOdds: 1.9, awayOdds: 1.9 }; // Fixed for other tests unless overridden
    });
  });

  describe('updateGameFromESPN', () => {
    const espnData = {
      id: 'espn123',
      competitions: [{
        competitors: [
          { homeAway: 'home', team: { displayName: 'Team A' }, score: '10' },
          { homeAway: 'away', team: { displayName: 'Team B' }, score: '5' },
        ],
        venue: { fullName: 'Stadium' },
      }],
      status: { type: { name: 'STATUS_SCHEDULED' } },
      date: new Date().toISOString(),
      links: [{ href: 'http://espn.com' }],
    };

    it('should create a new game if it does not exist', async () => {
      Game.findOne.mockResolvedValue(null);
      
      await GameService.updateGameFromESPN(espnData);

      expect(Game.findOne).toHaveBeenCalledWith({ apiGameId: 'espn123' });
      expect(Game).toHaveBeenCalled(); // Checks constructor call
      expect(calculateOdds).toHaveBeenCalled();
    });

    it('should update an existing game', async () => {
      const existingGame = {
        apiGameId: 'espn123',
        status: 'scheduled',
        save: jest.fn(),
        homeScore: 0,
        awayScore: 0,
        winner: null,
      };
      Game.findOne.mockResolvedValue(existingGame);

      await GameService.updateGameFromESPN(espnData);

      expect(existingGame.save).toHaveBeenCalled();
      expect(existingGame.homeTeam).toBe('Team A');
    });

    it('should finalize game if status changes to completed', async () => {
      const completedEspnData = {
        ...espnData,
        status: { type: { name: 'STATUS_FINAL' } },
        competitions: [{
            competitors: [
              { homeAway: 'home', team: { displayName: 'Team A' }, score: '20' },
              { homeAway: 'away', team: { displayName: 'Team B' }, score: '10' },
            ],
        }]
      };

      const existingGame = {
        _id: 'game123',
        apiGameId: 'espn123',
        status: 'live', // Was live, now completed
        save: jest.fn(),
        winner: null,
        homeScore: 10,
        awayScore: 10,
        toObject: jest.fn(),
      };
      
      Game.findOne.mockResolvedValue(existingGame);
      Game.findById.mockResolvedValue(existingGame); // For finalizeGame call
      
      await GameService.updateGameFromESPN(completedEspnData);

      expect(BettingService.settleBetsForGame).toHaveBeenCalled();
      expect(existingGame.save).toHaveBeenCalled();
    });

    it('should throw error if update fails', async () => {
        Game.findOne.mockRejectedValue(new Error('DB connection failed'));
  
        await expect(GameService.updateGameFromESPN(espnData))
          .rejects.toThrow('DB connection failed');
    });
  });

  describe('closeGameBetting', () => {
    it('should close betting for a game', async () => {
      const mockGame = { _id: 'g1', bettingOpen: true, save: jest.fn(), homeTeam: 'H', awayTeam: 'A' };
      Game.findById.mockResolvedValue(mockGame);

      const result = await GameService.closeGameBetting('g1');

      expect(mockGame.bettingOpen).toBe(false);
      expect(mockGame.save).toHaveBeenCalled();
      expect(result).toBe(mockGame);
    });

    it('should throw if game not found', async () => {
      Game.findById.mockResolvedValue(null);
      await expect(GameService.closeGameBetting('g1')).rejects.toThrow('Game not found');
    });

    it('should do nothing if betting is already closed', async () => {
      const mockGame = { _id: 'g1', bettingOpen: false, save: jest.fn(), homeTeam: 'H', awayTeam: 'A' };
      Game.findById.mockResolvedValue(mockGame);

      await GameService.closeGameBetting('g1');
      expect(mockGame.save).not.toHaveBeenCalled();
    });
  });

  describe('finalizeGame', () => {
    it('should finalize game (Home Win)', async () => {
      const mockGame = { 
        _id: 'g1', 
        status: 'live', 
        save: jest.fn(), 
        toObject: jest.fn().mockReturnValue({}),
        homeTeam: 'H', 
        awayTeam: 'A' 
      };
      Game.findById.mockResolvedValue(mockGame);
      BettingService.settleBetsForGame.mockResolvedValue({ settled: 10 });

      const result = await GameService.finalizeGame('g1', 20, 10);

      expect(mockGame.status).toBe('completed');
      expect(mockGame.winner).toBe('home');
      expect(mockGame.homeScore).toBe(20);
      expect(mockGame.save).toHaveBeenCalled();
      expect(BettingService.settleBetsForGame).toHaveBeenCalledWith('g1', 'home');
      expect(result.settlement).toEqual({ settled: 10 });
    });

    it('should finalize game (Tie)', async () => {
      const mockGame = { 
        _id: 'g1', 
        status: 'live', 
        save: jest.fn(), 
        toObject: jest.fn().mockReturnValue({}),
        homeTeam: 'H', 
        awayTeam: 'A' 
      };
      Game.findById.mockResolvedValue(mockGame);
      BettingService.refundBetsForGame.mockResolvedValue({ refunded: 5 });

      await GameService.finalizeGame('g1', 10, 10);

      expect(mockGame.winner).toBe('tie');
      expect(BettingService.refundBetsForGame).toHaveBeenCalledWith('g1', 'Game ended in a tie');
      expect(BettingService.settleBetsForGame).not.toHaveBeenCalled();
    });

    it('should throw if game not found', async () => {
      Game.findById.mockResolvedValue(null);
      await expect(GameService.finalizeGame('g1', 10, 5)).rejects.toThrow('Game not found');
    });
  });

  describe('cancelGame', () => {
    it('should cancel game and refund bets', async () => {
      const mockGame = { 
        _id: 'g1', 
        status: 'scheduled', 
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue({}),
        homeTeam: 'H', 
        awayTeam: 'A'
      };
      Game.findById.mockResolvedValue(mockGame);
      BettingService.refundBetsForGame.mockResolvedValue({ refunded: 10 });

      await GameService.cancelGame('g1', 'Rain');

      expect(mockGame.status).toBe('cancelled');
      expect(mockGame.bettingOpen).toBe(false);
      expect(BettingService.refundBetsForGame).toHaveBeenCalledWith('g1', 'Rain');
    });

    it('should throw if game not found', async () => {
      Game.findById.mockResolvedValue(null);
      await expect(GameService.cancelGame('g1')).rejects.toThrow('Game not found');
    });
  });

  describe('postponeGame', () => {
    it('should postpone game', async () => {
      const mockGame = { _id: 'g1', status: 'scheduled', save: jest.fn(), homeTeam: 'H', awayTeam: 'A' };
      Game.findById.mockResolvedValue(mockGame);
      
      const newDate = new Date();
      await GameService.postponeGame('g1', newDate);

      expect(mockGame.status).toBe('postponed');
      expect(mockGame.bettingOpen).toBe(false);
      expect(mockGame.gameDate).toEqual(newDate);
      expect(mockGame.save).toHaveBeenCalled();
    });
  });

  describe('recalculateGameOdds', () => {
    it('should recalculate odds', async () => {
      const mockGame = { 
        _id: 'g1', 
        homeBets: 10, 
        awayBets: 5, 
        homeBiscuitsWagered: 1000, 
        awayBiscuitsWagered: 500,
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue({}),
        homeTeam: 'H', 
        awayTeam: 'A'
      };
      Game.findById.mockResolvedValue(mockGame);
      calculateOdds.mockReturnValue({ homeOdds: 1.5, awayOdds: 2.5 });

      await GameService.recalculateGameOdds('g1');

      expect(calculateOdds).toHaveBeenCalledWith(10, 5, 1000, 500);
      expect(mockGame.homeOdds).toBe(1.5);
      expect(mockGame.awayOdds).toBe(2.5);
      expect(mockGame.save).toHaveBeenCalled();
    });
  });

  describe('getGamesByStatus', () => {
    it('should return games filtered by status', async () => {
      const mockChain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(['game1']),
      };
      Game.find.mockReturnValue(mockChain);

      const result = await GameService.getGamesByStatus('scheduled');

      expect(Game.find).toHaveBeenCalledWith({ status: 'scheduled' });
      expect(result).toEqual(['game1']);
    });

    it('should apply sport filter if provided', async () => {
      const mockChain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };
      Game.find.mockReturnValue(mockChain);

      await GameService.getGamesByStatus('scheduled', 'basketball');

      expect(Game.find).toHaveBeenCalledWith({ status: 'scheduled', sport: 'basketball' });
    });
  });

  describe('autoCloseBetting', () => {
    it('should close betting for games that have started', async () => {
      const mockGames = [
        { _id: 'g1', homeTeam: 'A', awayTeam: 'B' }, 
        { _id: 'g2', homeTeam: 'C', awayTeam: 'D' }
      ];
      
      // Mock getGamesNeedingBettingClosed query
      const mockFindChain = { lean: jest.fn().mockResolvedValue(mockGames) };
      Game.find.mockReturnValue(mockFindChain);

      // Mock closeGameBetting logic via finding game by id individually
      const mockGameInstance = { 
        _id: 'g1', 
        bettingOpen: true, 
        save: jest.fn(), 
        homeTeam: 'A', 
        awayTeam: 'B' 
      };
      Game.findById.mockResolvedValue(mockGameInstance);

      const result = await GameService.autoCloseBetting();

      expect(result.closed).toBe(2);
      expect(Game.findById).toHaveBeenCalledTimes(2);
    });
    
    it('should handle errors for individual games', async () => {
      // Mock getGamesNeedingBettingClosed query
      Game.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([{ _id: 'g1' }]) });

      // Mock failure
      Game.findById.mockRejectedValue(new Error('Update failed'));

      const result = await GameService.autoCloseBetting();

      expect(result.closed).toBe(0);
    });
  });

  describe('autoFinalizeGames', () => {
    it('should finalize completed games', async () => {
        const mockGames = [{ _id: 'g1', homeScore: 10, awayScore: 5 }];
        // Mock getGamesNeedingFinalization
        Game.find.mockReturnValue({ lean: jest.fn().mockResolvedValue(mockGames) });

        // Mock finalizeGame dependencies
        const mockGameInstance = { 
            _id: 'g1', 
            status: 'completed', 
            save: jest.fn(), 
            toObject: jest.fn(),
            homeTeam: 'H',
            awayTeam: 'A'
        };
        Game.findById.mockResolvedValue(mockGameInstance);
        BettingService.settleBetsForGame.mockResolvedValue({});

        const result = await GameService.autoFinalizeGames();

        expect(result.finalized).toBe(1);
    });

    it('should track errors', async () => {
        const mockGames = [{ _id: 'g1' }];
        Game.find.mockReturnValue({ lean: jest.fn().mockResolvedValue(mockGames) });
        Game.findById.mockRejectedValue(new Error('Fail'));

        const result = await GameService.autoFinalizeGames();

        expect(result.finalized).toBe(0);
        expect(result.errors).toHaveLength(1);
    });
  });
});