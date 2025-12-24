'use client';

import BiscuitIcon from '../icons/BiscuitIcon';

/**
 * Displays betting odds for both teams
 * @param {Object} props
 * @param {number} props.uwOdds - UW odds multiplier
 * @param {number} props.opponentOdds - Opponent odds multiplier
 * @param {string} props.opponentName - Opponent team name
 * @param {number} props.totalBets - Total number of bets placed (optional)
 * @param {number} props.totalWagered - Total biscuits wagered (optional)
 * @param {boolean} props.showStats - Whether to show betting stats
 */
export default function OddsDisplay({
  uwOdds,
  opponentOdds,
  opponentName,
  totalBets,
  totalWagered,
  showStats = true,
}) {
  const opponentShortName = opponentName?.split(' ')[0] || 'Opponent';

  return (
    <div className="mt-3 pt-3 border-t dark:border-gray-700">
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        HuskyBids Odds (Payout Multiplier)
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-uw-purple-50 dark:bg-uw-purple-900/20 p-2 rounded text-center">
          <div className="text-xs text-uw-purple-700 dark:text-uw-purple-300 font-semibold">
            Washington
          </div>
          <div className="font-bold text-uw-purple-900 dark:text-uw-purple-100">
            {uwOdds?.toFixed(2) || '2.00'}x
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-center">
          <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold">
            {opponentShortName}
          </div>
          <div className="font-bold text-gray-900 dark:text-gray-100">
            {opponentOdds?.toFixed(2) || '2.00'}x
          </div>
        </div>
      </div>

      {showStats && (totalBets > 0 || totalWagered > 0) && (
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">Total Bets</div>
            <div className="font-semibold text-uw-purple-900 dark:text-uw-purple-100">
              {totalBets || 0}
            </div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">Total Wagered</div>
            <div className="font-semibold text-uw-purple-900 dark:text-uw-purple-100 flex items-center gap-1">
              <BiscuitIcon size={14} />
              {(totalWagered || 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
