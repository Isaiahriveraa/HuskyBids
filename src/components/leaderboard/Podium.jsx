'use client';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import Image from 'next/image';

export default function Podium({ topThree }) {
  const [first, second, third] = topThree;

  const positions = [
    { user: second, rank: 2, height: 'h-64', icon: Medal, color: 'from-gray-300 to-gray-500', delay: 0.2 },
    { user: first, rank: 1, height: 'h-80', icon: Trophy, color: 'from-uw-gold-400 to-uw-gold-600', delay: 0 },
    { user: third, rank: 3, height: 'h-56', icon: Award, color: 'from-orange-300 to-orange-500', delay: 0.4 },
  ];

  return (
    <div className="relative mb-12">
      {/* Confetti background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-uw-gold-400 dark:bg-uw-gold-500 rounded-full"
            initial={{ y: -20, x: `${Math.random() * 100}%`, rotate: 0, opacity: 0 }}
            animate={{
              y: 400,
              rotate: 360,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Podium */}
      <div className="relative flex items-end justify-center gap-4 px-4">
        {positions.map((pos, idx) => pos.user && (
          <motion.div
            key={pos.rank}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: pos.delay, ease: [0.22, 1, 0.36, 1] }}
            className={`flex-1 max-w-xs ${pos.height} flex flex-col`}
          >
            {/* User card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl border-2 border-gray-200 dark:border-slate-700 mb-4"
            >
              {/* Rank badge */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${pos.color} flex items-center justify-center shadow-lg`}>
                <pos.icon className="w-6 h-6 text-white" />
              </div>

              {/* Avatar */}
              <div className="mt-4 mb-4">
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-gray-200 dark:border-slate-700">
                  <Image
                    src={pos.user.imageUrl || '/default-avatar.png'}
                    alt={pos.user.username}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Username */}
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                {pos.user.username}
              </h3>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Balance:</span>
                  <span className="font-bold text-uw-purple-600 dark:text-uw-purple-400">
                    {pos.user.biscuits?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {pos.user.winRate?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Podium stand */}
            <div className={`flex-1 bg-gradient-to-br ${pos.color} rounded-t-2xl flex items-center justify-center`}>
              <span className="text-6xl font-black text-white opacity-30">
                #{pos.rank}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
