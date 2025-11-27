'use client';

import { User } from 'lucide-react';

/**
 * Displays top player statistics
 * @param {Object} props
 * @param {Object} props.player - Player object with name, position, stats
 * @param {boolean} props.isUW - Whether this is a UW player
 * @param {string} props.opponentAbbrev - Opponent abbreviation
 */
export default function PlayerStat({ player, isUW = false, opponentAbbrev = 'OPP' }) {
  if (!player) return null;

  return (
    <div className={`rounded p-2 ${isUW ? 'bg-purple-50' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
            ${isUW ? 'bg-purple-600' : 'bg-gray-600'}
          `}>
            {isUW ? 'UW' : opponentAbbrev}
          </div>
          <div>
            <div className={`font-semibold text-sm ${isUW ? 'text-purple-900' : 'text-gray-900'}`}>
              {player.name}
            </div>
            <div className={`text-xs ${isUW ? 'text-purple-600' : 'text-gray-600'}`}>
              {player.position}
            </div>
          </div>
        </div>
        {player.stats && (
          <div className={`text-xs font-bold ${isUW ? 'text-purple-700' : 'text-gray-700'}`}>
            {player.stats}
          </div>
        )}
      </div>
    </div>
  );
}
