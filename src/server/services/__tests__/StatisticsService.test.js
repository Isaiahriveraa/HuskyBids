import StatisticsService from '../StatisticsService';
import User from '@server/models/User';
import Bet from '@server/models/Bet';
import { calculateWinRate, calculateROI } from '@shared/utils/stats-utils';

// Mock dependencies
jest.mock('@server/models/User', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.mock('@server/models/Bet', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

jest.mock('@shared/utils/stats-utils', () => ({
  calculateWinRate: jest.fn(),
  calculateROI: jest.fn(),
}));

describe('StatisticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    calculateWinRate.mockReturnValue(50);
    calculateROI.mockReturnValue(10);
  });

  describe('getUserStats', () => {
    const mockUser = {
      clerkId: 'u1',
      username: 'User1',
      biscuits: 1000,
      totalBets: 10,
      winningBets: 5,
      totalBiscuitsWagered: 100,
      totalBiscuitsWon: 150,
      totalBiscuitsLost: 50,
    };

    it('should return complete user stats', async () => {
      User.findOne.mockResolvedValue(mockUser);
      
      const mockRecentBets = [{ _id: 'b1', gameId: 'g1' }];
      const mockPendingBets = [{ _id: 'b2', gameId: 'g2' }];

      // We need to differentiate the two Bet.find calls
      Bet.find
        .mockReturnValueOnce({ // recent bets
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockRecentBets)
        })
        .mockReturnValueOnce({ // pending bets
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockPendingBets)
        });

      const result = await StatisticsService.getUserStats('u1');

      expect(User.findOne).toHaveBeenCalledWith({ clerkId: 'u1' });
      expect(result.user.username).toBe('User1');
      expect(result.stats.winRate).toBe(50);
      expect(result.stats.roi).toBe(10);
      expect(result.recentBets).toHaveLength(1);
      expect(result.pendingBets).toHaveLength(1);
    });

    it('should throw if user not found', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(StatisticsService.getUserStats('u1')).rejects.toThrow('User not found');
    });
  });

  describe('getLeaderboard', () => {
    const mockUsers = [
      { clerkId: 'u1', biscuits: 200, winningBets: 10, totalBets: 20 },
      { clerkId: 'u2', biscuits: 100, winningBets: 5, totalBets: 20 }
    ];

    it('should return paginated leaderboard sorted by biscuits', async () => {
      User.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUsers)
      });
      User.countDocuments.mockResolvedValue(2);

      const result = await StatisticsService.getLeaderboard({ page: 1, limit: 10 });

      expect(result.leaderboard).toHaveLength(2);
      expect(result.leaderboard[0].rank).toBe(1);
      expect(result.leaderboard[0].clerkId).toBe('u1');
      expect(result.pagination.total).toBe(2);
    });

    it('should sort by winRate manually', async () => {
        // u1 has higher winRate
        calculateWinRate
            .mockReturnValueOnce(20) // u1
            .mockReturnValueOnce(80); // u2

        User.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockUsers)
        });
        User.countDocuments.mockResolvedValue(2);

        const result = await StatisticsService.getLeaderboard({ sortBy: 'winRate' });

        expect(result.leaderboard[0].clerkId).toBe('u2');
        expect(result.leaderboard[1].clerkId).toBe('u1');
    });

    it('should sort by winRate with tie-breaker (biscuits)', async () => {
      // Both users have same winRate, but u1 has more biscuits (200) than u2 (100)
      calculateWinRate.mockReturnValue(50);

      User.find.mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(mockUsers)
      });
      User.countDocuments.mockResolvedValue(2);

      const result = await StatisticsService.getLeaderboard({ sortBy: 'winRate' });

      // Should be sorted by biscuits descending as secondary sort
      // u1 (200) > u2 (100)
      expect(result.leaderboard[0].clerkId).toBe('u1');
      expect(result.leaderboard[1].clerkId).toBe('u2');
    });

    it('should sort by roi manually', async () => {
        calculateROI
            .mockReturnValueOnce(10) // u1
            .mockReturnValueOnce(50); // u2

        User.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockUsers)
        });
        User.countDocuments.mockResolvedValue(2);

        const result = await StatisticsService.getLeaderboard({ sortBy: 'roi' });

        expect(result.leaderboard[0].clerkId).toBe('u2');
    });

    it('should sort by roi with tie-breaker (biscuits)', async () => {
      calculateROI.mockReturnValue(25); // Equal ROI

      User.find.mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(mockUsers)
      });
      User.countDocuments.mockResolvedValue(2);

      const result = await StatisticsService.getLeaderboard({ sortBy: 'roi' });

      expect(result.leaderboard[0].clerkId).toBe('u1');
      expect(result.leaderboard[1].clerkId).toBe('u2');
    });

    it('should sort by totalBets', async () => {
      // Mock different behavior for totalBets sort if needed, but it uses DB sort mostly
      User.find.mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue(mockUsers)
      });
      User.countDocuments.mockResolvedValue(2);

      const result = await StatisticsService.getLeaderboard({ sortBy: 'totalBets' });
      
      // Default mock behavior is to return mockUsers as is (u1 first)
      // Logic inside service just sets sortField for mongo
      expect(result.leaderboard).toHaveLength(2);
    });
  });

  describe('getUserRank', () => {
    it('should return user rank based on biscuits', async () => {
      const mockUser = { clerkId: 'u1', biscuits: 500 };
      User.findOne.mockResolvedValue(mockUser);
      User.countDocuments.mockResolvedValue(4); // 4 users ahead

      const result = await StatisticsService.getUserRank('u1', 'biscuits');

      expect(result.rank).toBe(5); // 4 + 1
      expect(User.countDocuments).toHaveBeenCalledWith(expect.objectContaining({
        biscuits: { $gt: 500 }
      }));
    });

    it('should return user rank based on totalBets', async () => {
        const mockUser = { clerkId: 'u1', biscuits: 500, totalBets: 10 };
        User.findOne.mockResolvedValue(mockUser);
        User.countDocuments.mockResolvedValue(2);
  
        const result = await StatisticsService.getUserRank('u1', 'totalBets');
  
        expect(result.rank).toBe(3);
        // Verify complex query structure roughly
        expect(User.countDocuments).toHaveBeenCalledWith(expect.objectContaining({
            $or: expect.any(Array)
        }));
      });

    it('should throw if user not found', async () => {
        User.findOne.mockResolvedValue(null);
        await expect(StatisticsService.getUserRank('u1')).rejects.toThrow('User not found');
    });
  });

  describe('getGlobalStats', () => {
    it('should return valid global stats', async () => {
      User.countDocuments
        .mockResolvedValueOnce(100) // total users
        .mockResolvedValueOnce(50); // active bettors
      
      User.aggregate.mockResolvedValue([{
        totalBets: 1000,
        totalWagered: 50000,
        totalWon: 45000,
        totalLost: 5000,
        totalBiscuits: 100000
      }]);

      const result = await StatisticsService.getGlobalStats();

      expect(result.users.total).toBe(100);
      expect(result.users.activeBettors).toBe(50);
      expect(result.bets.totalPlaced).toBe(1000);
      expect(result.economy.averageBiscuitsPerUser).toBe(1000); // 100000 / 100
    });

    it('should handle empty DB gracefully', async () => {
        User.countDocuments.mockResolvedValue(0);
        User.aggregate.mockResolvedValue([]);
  
        const result = await StatisticsService.getGlobalStats();
  
        expect(result.users.total).toBe(0);
        expect(result.economy.averageBiscuitsPerUser).toBe(0);
      });
  });
});
