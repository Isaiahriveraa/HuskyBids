'use client';

/**
 * PlayerStatCard Component
 * Displays player statistics in a compact, consistent card format
 *
 * @param {Object} player - Player data object
 * @param {string} player.name - Player's name
 * @param {string} player.position - Player's position (QB, RB, WR, etc.)
 * @param {string} player.stats - Player's stats (e.g., "245 YDS, 2 TD")
 * @param {boolean} isUW - Whether this is a UW player (affects styling)
 * @param {string} opponentAbbrev - Abbreviated opponent name for non-UW players
 */
export default function PlayerStatCard({
  player,
  isUW = false,
  opponentAbbrev = 'OPP'
}) {
  if (!player) {
    return null;
  }

  // Styling based on team
  const bgClass = isUW
    ? 'bg-gradient-to-br from-uw-purple-100 to-uw-purple-50'
    : 'bg-gradient-to-br from-gray-100 to-gray-50';

  const nameClass = isUW
    ? 'text-uw-purple-900'
    : 'text-gray-900';

  const positionClass = isUW
    ? 'text-uw-purple-600'
    : 'text-gray-600';

  const statsClass = isUW
    ? 'text-uw-purple-900'
    : 'text-gray-900';

  return (
    <div className={`${bgClass} rounded-lg p-2`}>
      <div className={`font-bold ${nameClass} text-xs truncate`}>
        {player.name}
      </div>
      <div className={`text-xs ${positionClass} font-semibold`}>
        {player.position || 'Player'}
      </div>
      <div className={`text-xs font-black ${statsClass} mt-0.5`}>
        {player.stats || '-'}
      </div>
    </div>
  );
}
