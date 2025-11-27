'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import TeamLogo from '../shared/TeamLogo';

/**
 * Displays team information with logo, name, and optional score
 * @param {Object} props
 * @param {string} props.teamName - Team name
 * @param {string} props.teamLogo - Team logo URL
 * @param {number} props.score - Team score (optional)
 * @param {Object} props.topPlayer - Top player object (optional)
 * @param {boolean} props.isUW - Whether this is UW team
 * @param {boolean} props.isWinner - Whether team won (for styling)
 * @param {string} props.variant - Display variant ('full', 'compact')
 * @param {boolean} props.showScore - Whether to show score
 */
export default function TeamDisplay({
  teamName,
  teamLogo,
  score,
  topPlayer,
  isUW = false,
  isWinner = false,
  variant = 'full',
  showScore = false,
}) {
  const bgColor = isUW
    ? 'bg-uw-purple-50 dark:bg-uw-purple-900/20'
    : 'bg-gray-50 dark:bg-gray-800';

  const textColor = isUW
    ? 'text-uw-purple-900 dark:text-uw-purple-100'
    : 'text-gray-900 dark:text-gray-100';

  const scoreColor = isWinner
    ? 'text-green-600 dark:text-green-400'
    : 'text-gray-600 dark:text-gray-400';

  return (
    <div className={`flex items-center justify-between p-3 ${bgColor} rounded-lg`}>
      <div className="flex items-center gap-3 flex-1">
        {teamLogo ? (
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={teamLogo}
              alt={teamName}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <TeamLogo
            src={teamLogo}
            alt={teamName}
            size="md"
            fallback={isUW ? '🐾' : '🏈'}
          />
        )}
        <div className="flex-1">
          <div className={`font-bold ${textColor} ${showScore && isWinner ? 'text-lg' : ''}`}>
            {teamName}
          </div>
          {topPlayer && variant === 'full' && (
            <>
              <div className={`text-xs ${isUW ? 'text-uw-purple-700 dark:text-uw-purple-300' : 'text-gray-700 dark:text-gray-300'} flex items-center gap-1`}>
                <User className="w-3 h-3" />
                <span className="font-semibold">{topPlayer.name}</span>
                <span className="text-gray-600 dark:text-gray-400">• {topPlayer.position}</span>
              </div>
              {topPlayer.stats && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {topPlayer.stats}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showScore && typeof score === 'number' && (
        <span className={`text-3xl font-bold ${scoreColor}`}>
          {score}
        </span>
      )}
    </div>
  );
}
