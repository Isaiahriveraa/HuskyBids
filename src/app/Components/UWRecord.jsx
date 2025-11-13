'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * UW Record Display Component
 * Shows Washington's win-loss record in W-L format
 * Optionally breaks down by sport if multiple sports are present
 */
export default function UWRecord({ games, sport }) {
  // Calculate overall record for current season only
  const calculateRecord = (gamesArray, sportFilter = null) => {
    // Determine current season
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    // For football: Season year is when it starts (Aug 2024 = 2024 season, Aug 2025 = 2025 season)
    // Since we're in November 2025, we're in the 2025 season
    // BUT completed games from Sept-Dec 2024 are from 2024 season
    const currentSeason = currentMonth >= 7 ? currentYear : currentYear - 1;

    console.log('🏈 UWRecord - Current Season:', currentSeason);
    console.log('📅 UWRecord - Total games received:', gamesArray.length);

    // Filter by sport if specified
    let filteredGames = sportFilter && sportFilter !== 'all'
      ? gamesArray.filter(g => g.sport === sportFilter)
      : gamesArray;

    console.log('🏀 UWRecord - After sport filter:', filteredGames.length, 'sport:', sportFilter);

    // Filter by current season only
    filteredGames = filteredGames.filter(g => {
      // Use season field if available
      if (g.season) {
        const gameSeason = parseInt(g.season);
        const matches = gameSeason === currentSeason;
        if (!matches) {
          console.log(`Game season ${gameSeason} != current ${currentSeason}, filtering out game from ${g.gameDate}`);
        }
        return matches;
      }
      // Fallback: calculate season from game date
      const gameDate = new Date(g.gameDate);
      const gameYear = gameDate.getFullYear();
      const gameMonth = gameDate.getMonth();
      const gameSeason = gameMonth >= 7 ? gameYear : gameYear - 1;
      const matches = gameSeason === currentSeason;
      if (!matches) {
        console.log(`Calculated season ${gameSeason} != current ${currentSeason}, filtering out game from ${g.gameDate}`);
      }
      return matches;
    });

    console.log('✅ UWRecord - After season filter:', filteredGames.length);

    // Fix: Check if UW won based on home/away status and winner field
    const wins = filteredGames.filter(g => {
      // Check if UW is home team (handle variations: "Washington", "Washington Huskies", etc.)
      const isUWHome = g.homeTeam?.toLowerCase().includes('washington') &&
                       !g.homeTeam?.toLowerCase().includes('state');
      return (isUWHome && g.winner === 'home') || (!isUWHome && g.winner === 'away');
    }).length;

    const losses = filteredGames.length - wins;

    return { wins, losses, total: filteredGames.length };
  };

  const overallRecord = calculateRecord(games);

  // If no games, don't show anything
  if (games.length === 0 || overallRecord.total === 0) {
    return null;
  }

  // Calculate win percentage for styling
  const winPercentage = overallRecord.total > 0
    ? (overallRecord.wins / overallRecord.total) * 100
    : 0;

  // Determine color based on win percentage
  const getRecordColor = () => {
    if (winPercentage >= 70) return 'text-green-700';
    if (winPercentage >= 50) return 'text-uw-purple-700';
    return 'text-gray-700';
  };

  // Get breakdown by sport if "all sports" is selected and multiple sports exist
  const footballGames = games.filter(g => g.sport === 'football');
  const basketballGames = games.filter(g => g.sport === 'basketball');
  const hasMultipleSports = footballGames.length > 0 && basketballGames.length > 0;
  const showBreakdown = sport === 'all' && hasMultipleSports;

  const footballRecord = showBreakdown ? calculateRecord(games, 'football') : null;
  const basketballRecord = showBreakdown ? calculateRecord(games, 'basketball') : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-uw-purple-50 via-white to-uw-gold-50 rounded-lg shadow-md p-4 border border-uw-purple-200"
    >
      <div className="flex items-center justify-center gap-3">
        <Trophy className="w-6 h-6 text-uw-gold-500" />
        <div className="text-center">
          <h3 className="text-lg font-black text-uw-purple-900 mb-1">
            UW HUSKIES RECORD
          </h3>
          <div className={`text-3xl font-black ${getRecordColor()}`}>
            {overallRecord.wins}-{overallRecord.losses}
          </div>

          {/* Sport Breakdown */}
          {showBreakdown && (
            <div className="mt-2 flex items-center justify-center gap-4 text-sm">
              {footballRecord && footballRecord.total > 0 && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-600">Football:</span>
                  <span className="font-bold text-gray-800">
                    {footballRecord.wins}-{footballRecord.losses}
                  </span>
                </div>
              )}
              {basketballRecord && basketballRecord.total > 0 && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-600">Basketball:</span>
                  <span className="font-bold text-gray-800">
                    {basketballRecord.wins}-{basketballRecord.losses}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
