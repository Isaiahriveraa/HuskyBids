'use client';

/**
 * PlaceholderCard Component
 * Displays a placeholder when player data is unavailable
 * Maintains same dimensions as PlayerStatCard for consistent card heights
 *
 * @param {boolean} isUW - Whether this placeholder is for UW (affects styling)
 * @param {string} team - Team name for context ("UW" or opponent name)
 */
export default function PlaceholderCard({ isUW = false, team = 'Team' }) {
  // Match PlayerStatCard styling but with reduced opacity
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
    <div className={`${bgClass} rounded-lg p-2 opacity-50`}>
      <div className={`font-bold ${nameClass} text-xs`}>
        No Data
      </div>
      <div className={`text-xs ${positionClass} font-semibold`}>
        -
      </div>
      <div className={`text-xs font-black ${statsClass} mt-0.5`}>
        -
      </div>
    </div>
  );
}
