'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function PremiumGameCard({ game, onBetClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const isLive = game.status === 'live';
  const isUpcoming = game.status === 'scheduled';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {/* Glass card with gradient border */}
      <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-2xl">
        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
            >
              <Zap className="w-3 h-3" />
              LIVE
            </motion.div>
          </div>
        )}

        {/* Teams section */}
        <div className="p-6">
          {/* Home Team (UW) */}
          <div className="flex items-center justify-between mb-4 p-4 bg-uw-purple-50 dark:bg-uw-purple-900/20 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <Image
                  src={game.homeTeam.logo}
                  alt={game.homeTeam.name}
                  fill
                  className="object-contain"
                  quality={85}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {game.homeTeam.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {game.homeTeam.record}
                </p>
              </div>
            </div>

            {isLive && (
              <div className="text-4xl font-black text-uw-purple-600 dark:text-uw-purple-400">
                {game.homeTeam.score}
              </div>
            )}
          </div>

          {/* VS divider */}
          <div className="flex items-center justify-center my-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent" />
            <span className="px-4 text-sm font-bold text-gray-500 dark:text-gray-400">
              VS
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent" />
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <Image
                  src={game.awayTeam.logo}
                  alt={game.awayTeam.name}
                  fill
                  className="object-contain"
                  quality={85}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {game.awayTeam.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {game.awayTeam.record}
                </p>
              </div>
            </div>

            {isLive && (
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                {game.awayTeam.score}
              </div>
            )}
          </div>

          {/* Game info */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {new Date(game.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              {game.totalBets || 0} bets
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              {game.totalWagered?.toLocaleString() || 0} biscuits
            </div>
          </div>
        </div>

        {/* Odds section */}
        {isUpcoming && (
          <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gradient-to-b from-transparent to-gray-50 dark:to-slate-900/50">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onBetClick(game, 'home')}
                className="group relative overflow-hidden bg-gradient-to-br from-uw-purple-500 to-uw-purple-700 dark:from-uw-purple-400 dark:to-uw-purple-600 text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative z-10">
                  <p className="text-sm font-medium mb-1">UW Huskies</p>
                  <p className="text-3xl font-black">{game.homeOdds?.toFixed(2) || '2.00'}x</p>
                </div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: isHovered ? '100%' : '-100%' }}
                  transition={{ duration: 0.6 }}
                />
              </button>

              <button
                onClick={() => onBetClick(game, 'away')}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-500 dark:to-gray-700 text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative z-10">
                  <p className="text-sm font-medium mb-1">{game.awayTeam.name}</p>
                  <p className="text-3xl font-black">{game.awayOdds?.toFixed(2) || '2.00'}x</p>
                </div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: isHovered ? '100%' : '-100%' }}
                  transition={{ duration: 0.6 }}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
