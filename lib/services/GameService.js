import Game from '../../models/Game';
import BettingService from './BettingService';
import { calculateOdds } from '../odds-calculator';

/**
 * GameService
 *
 * Centralized service for game management, updates, and finalization.
 * Coordinates with BettingService for automatic bet settlement.
 *
 * Methods:
 * - updateGameFromESPN: Update game data from ESPN API
 * - closeGameBetting: Close betting for a game
 * - finalizeGame: Mark game as completed and settle all bets
 * - cancelGame: Cancel game and refund all bets
 * - recalculateGameOdds: Manually recalculate odds for a game
 */
class GameService {
  /**
   * Update game data from ESPN API response
   *
   * @param {Object} espnData - Raw ESPN API game data
   * @returns {Promise<Object>} Updated or created game
   */
  async updateGameFromESPN(espnData) {
    try {
      const gameData = this._transformESPNData(espnData);

      // Find existing game by ESPN API ID
      let game = await Game.findOne({ apiGameId: gameData.apiGameId });

      if (game) {
        // Update existing game
        Object.assign(game, gameData);

        // If game just completed, finalize it
        if (game.status === 'completed' && game.winner === null) {
          await this.finalizeGame(game._id, game.homeScore, game.awayScore);
        }

        await game.save();
        console.log(`✅ Updated game: ${game.homeTeam} vs ${game.awayTeam} (${game.status})`);
      } else {
        // Create new game
        game = new Game(gameData);

        // Calculate initial odds
        const initialOdds = calculateOdds(0, 0, 0, 0);
        game.homeOdds = initialOdds.homeOdds;
        game.awayOdds = initialOdds.awayOdds;

        await game.save();
        console.log(`✅ Created game: ${game.homeTeam} vs ${game.awayTeam}`);
      }

      return game;
    } catch (error) {
      console.error('❌ Failed to update game from ESPN:', error.message);
      throw error;
    }
  }

  /**
   * Transform ESPN API data to our Game schema format
   * @private
   */
  _transformESPNData(espnData) {
    const competition = espnData.competitions?.[0];
    const competitors = competition?.competitors || [];

    const homeTeam = competitors.find(c => c.homeAway === 'home');
    const awayTeam = competitors.find(c => c.homeAway === 'away');

    // Map ESPN status to our status
    const statusMap = {
      'STATUS_SCHEDULED': 'scheduled',
      'STATUS_IN_PROGRESS': 'live',
      'STATUS_FINAL': 'completed',
      'STATUS_POSTPONED': 'postponed',
      'STATUS_CANCELED': 'cancelled',
      'STATUS_CANCELLED': 'cancelled',
    };

    const espnStatus = espnData.status?.type?.name || 'STATUS_SCHEDULED';
    const status = statusMap[espnStatus] || 'scheduled';

    return {
      apiGameId: espnData.id,
      sport: espnData.sport || 'football',
      season: espnData.season?.year,
      homeTeam: homeTeam?.team?.displayName || 'Unknown',
      awayTeam: awayTeam?.team?.displayName || 'Unknown',
      homeTeamLogo: homeTeam?.team?.logo,
      awayTeamLogo: awayTeam?.team?.logo,
      homeScore: parseInt(homeTeam?.score) || 0,
      awayScore: parseInt(awayTeam?.score) || 0,
      gameDate: new Date(espnData.date),
      venue: competition?.venue?.fullName,
      status,
      espnUrl: espnData.links?.[0]?.href,
    };
  }

  /**
   * Close betting for a game (usually when game starts)
   *
   * @param {string} gameId - Game MongoDB ID
   * @returns {Promise<Object>} Updated game
   */
  async closeGameBetting(gameId) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');

    if (game.bettingOpen === false) {
      console.log(`ℹ️ Betting already closed for ${game.homeTeam} vs ${game.awayTeam}`);
      return game;
    }

    game.bettingOpen = false;
    await game.save();

    console.log(`🔒 Betting closed for ${game.homeTeam} vs ${game.awayTeam}`);
    return game;
  }

  /**
   * Finalize a completed game and settle all bets
   *
   * @param {string} gameId - Game MongoDB ID
   * @param {number} homeScore - Final home team score
   * @param {number} awayScore - Final away team score
   * @returns {Promise<Object>} Game and settlement results
   */
  async finalizeGame(gameId, homeScore, awayScore) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');

    // Update game scores and status
    game.homeScore = homeScore;
    game.awayScore = awayScore;
    game.status = 'completed';
    game.bettingOpen = false;

    // Determine winner
    let winner;
    if (homeScore > awayScore) {
      winner = 'home';
    } else if (awayScore > homeScore) {
      winner = 'away';
    } else {
      winner = 'tie';
    }
    game.winner = winner;

    await game.save();

    console.log(`🏁 Game finalized: ${game.homeTeam} ${homeScore} - ${awayScore} ${game.awayTeam} (Winner: ${winner})`);

    // Settle all bets for this game
    let settlementResult;
    if (winner === 'tie') {
      // Refund all bets on tie
      settlementResult = await BettingService.refundBetsForGame(
        gameId,
        'Game ended in a tie'
      );
    } else {
      // Settle bets normally
      settlementResult = await BettingService.settleBetsForGame(gameId, winner);
    }

    return {
      game: game.toObject(),
      settlement: settlementResult,
    };
  }

  /**
   * Cancel a game and refund all bets
   *
   * @param {string} gameId - Game MongoDB ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Game and refund results
   */
  async cancelGame(gameId, reason = 'Game cancelled') {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');

    game.status = 'cancelled';
    game.bettingOpen = false;
    await game.save();

    console.log(`❌ Game cancelled: ${game.homeTeam} vs ${game.awayTeam}. Reason: ${reason}`);

    // Refund all pending bets
    const refundResult = await BettingService.refundBetsForGame(gameId, reason);

    return {
      game: game.toObject(),
      refund: refundResult,
    };
  }

  /**
   * Postpone a game (does not refund bets immediately)
   *
   * @param {string} gameId - Game MongoDB ID
   * @param {Date} newDate - New game date (optional)
   * @returns {Promise<Object>} Updated game
   */
  async postponeGame(gameId, newDate = null) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');

    game.status = 'postponed';
    game.bettingOpen = false;

    if (newDate) {
      game.gameDate = new Date(newDate);
    }

    await game.save();

    console.log(`⏸️ Game postponed: ${game.homeTeam} vs ${game.awayTeam}${newDate ? ` to ${newDate}` : ''}`);

    return game;
  }

  /**
   * Manually recalculate odds for a game based on current bets
   *
   * @param {string} gameId - Game MongoDB ID
   * @returns {Promise<Object>} Updated game with new odds
   */
  async recalculateGameOdds(gameId) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');

    const newOdds = calculateOdds(
      game.homeBets || 0,
      game.awayBets || 0,
      game.homeBiscuitsWagered || 0,
      game.awayBiscuitsWagered || 0
    );

    game.homeOdds = newOdds.homeOdds;
    game.awayOdds = newOdds.awayOdds;

    await game.save();

    console.log(`📊 Recalculated odds for ${game.homeTeam} vs ${game.awayTeam}: Home ${newOdds.homeOdds}x, Away ${newOdds.awayOdds}x`);

    return {
      game: game.toObject(),
      odds: newOdds,
    };
  }

  /**
   * Get games by status with optional sport filter
   *
   * @param {string} status - 'scheduled' | 'live' | 'completed' | 'cancelled' | 'postponed'
   * @param {string} sport - Optional sport filter
   * @param {number} limit - Max number of games to return
   * @returns {Promise<Array>} Array of games
   */
  async getGamesByStatus(status, sport = null, limit = 50) {
    const query = { status };
    if (sport) {
      query.sport = sport;
    }

    const games = await Game.find(query)
      .sort({ gameDate: status === 'completed' ? -1 : 1 })
      .limit(limit)
      .lean();

    return games;
  }

  /**
   * Get upcoming games that need betting closed (game started)
   *
   * @returns {Promise<Array>} Games that started but betting is still open
   */
  async getGamesNeedingBettingClosed() {
    const now = new Date();

    const games = await Game.find({
      status: { $in: ['scheduled', 'live'] },
      bettingOpen: true,
      gameDate: { $lte: now },
    }).lean();

    return games;
  }

  /**
   * Get completed games that haven't been finalized
   *
   * @returns {Promise<Array>} Completed games with null winner
   */
  async getGamesNeedingFinalization() {
    const games = await Game.find({
      status: 'completed',
      winner: null,
    }).lean();

    return games;
  }

  /**
   * Auto-close betting for games that have started
   *
   * @returns {Promise<Object>} Results of auto-close operation
   */
  async autoCloseBetting() {
    const games = await this.getGamesNeedingBettingClosed();

    let closedCount = 0;
    for (const game of games) {
      try {
        await this.closeGameBetting(game._id);
        closedCount++;
      } catch (error) {
        console.error(`❌ Failed to close betting for game ${game._id}:`, error.message);
      }
    }

    console.log(`🔒 Auto-closed betting for ${closedCount} games`);

    return {
      checked: games.length,
      closed: closedCount,
    };
  }

  /**
   * Auto-finalize completed games
   *
   * @returns {Promise<Object>} Results of auto-finalize operation
   */
  async autoFinalizeGames() {
    const games = await this.getGamesNeedingFinalization();

    let finalizedCount = 0;
    let errors = [];

    for (const game of games) {
      try {
        await this.finalizeGame(game._id, game.homeScore, game.awayScore);
        finalizedCount++;
      } catch (error) {
        console.error(`❌ Failed to finalize game ${game._id}:`, error.message);
        errors.push({ gameId: game._id, error: error.message });
      }
    }

    console.log(`🏁 Auto-finalized ${finalizedCount} games`);

    return {
      checked: games.length,
      finalized: finalizedCount,
      errors,
    };
  }
}

// Export singleton instance
export default new GameService();
