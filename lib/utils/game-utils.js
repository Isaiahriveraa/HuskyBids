/**
 * Game Utility Functions
 * Consolidates game-related logic used across multiple components
 */

/**
 * Determines team positions for UW games
 * @param {Object} game - Game object
 * @returns {Object} Team position information
 */
export function getTeamPositions(game) {
  const isUWHome = game.homeTeam === 'Washington Huskies' ||
                    game.homeTeam?.includes('Washington');

  return {
    isUWHome,
    uwTeam: isUWHome ? 'home' : 'away',
    opponentTeam: isUWHome ? 'away' : 'home',
    uwScore: isUWHome ? game.homeScore : game.awayScore,
    opponentScore: isUWHome ? game.awayScore : game.homeScore,
    uwName: isUWHome ? game.homeTeam : game.awayTeam,
    opponentName: isUWHome ? game.awayTeam : game.homeTeam,
    uwLogo: isUWHome ? game.homeTeamLogo : game.awayTeamLogo,
    opponentLogo: isUWHome ? game.awayTeamLogo : game.homeTeamLogo,
  };
}

/**
 * Gets the badge variant for a game status
 * @param {string} status - Game status
 * @returns {string} Badge variant
 */
export function getStatusBadgeVariant(status) {
  const variants = {
    scheduled: 'info',
    live: 'success',
    completed: 'secondary',
    cancelled: 'danger',
    postponed: 'warning',
  };
  return variants[status] || 'secondary';
}

/**
 * Checks if a team name is UW/Washington
 * @param {string} teamName - Team name to check
 * @returns {boolean} True if UW team
 */
export function isUWTeam(teamName) {
  if (!teamName) return false;
  return teamName === 'Washington Huskies' ||
         teamName.includes('Washington') ||
         teamName.includes('UW');
}

/**
 * Formats game date and time
 * @param {Date|string} gameDate - Game date
 * @returns {Object} Formatted date and time
 */
export function formatGameDateTime(gameDate) {
  const date = new Date(gameDate);

  return {
    date: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
    full: date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  };
}

/**
 * Determines the winner of a completed game
 * @param {Object} game - Game object with scores
 * @returns {string|null} 'home', 'away', 'tie', or null if not determined
 */
export function determineWinner(game) {
  if (game.status !== 'completed' ||
      game.homeScore === null ||
      game.awayScore === null) {
    return null;
  }

  if (game.homeScore > game.awayScore) return 'home';
  if (game.awayScore > game.homeScore) return 'away';
  return 'tie';
}

/**
 * Checks if betting is allowed for a game
 * @param {Object} game - Game object
 * @returns {boolean} True if betting is allowed
 */
export function canBetOnGame(game) {
  if (game.status !== 'scheduled') return false;
  if (game.bettingOpen === false) return false;

  const now = new Date();
  const gameDate = new Date(game.gameDate);

  return gameDate > now;
}
