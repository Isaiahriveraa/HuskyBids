'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Trophy, Target, BarChart3 } from 'lucide-react';
import { staggerContainer, fadeInUp } from '../../../../lib/animations/variants';

export default function StatsGrid({ stats }) {
  const statCards = [
    {
      label: 'Biscuit Balance',
      value: stats.balance?.toLocaleString() || 0,
      icon: Wallet,
      gradient: 'from-uw-purple-500 to-uw-purple-700 dark:from-uw-purple-400 dark:to-uw-purple-600',
      trend: null,
    },
    {
      label: 'Total Wagered',
      value: stats.totalWagered?.toLocaleString() || 0,
      icon: Target,
      gradient: 'from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600',
      trend: stats.totalWageredChange,
    },
    {
      label: 'Total Won',
      value: stats.totalWon?.toLocaleString() || 0,
      icon: Trophy,
      gradient: 'from-green-500 to-green-700 dark:from-green-400 dark:to-green-600',
      trend: stats.totalWonChange,
    },
    {
      label: 'Profit/Loss',
      value: stats.profitLoss || 0,
      icon: stats.profitLoss >= 0 ? TrendingUp : TrendingDown,
      gradient: stats.profitLoss >= 0
        ? 'from-green-500 to-green-700 dark:from-green-400 dark:to-green-600'
        : 'from-red-500 to-red-700 dark:from-red-400 dark:to-red-600',
      trend: stats.profitLossChange,
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate?.toFixed(1) || 0}%`,
      icon: BarChart3,
      gradient: 'from-uw-gold-500 to-uw-gold-700 dark:from-uw-gold-400 dark:to-uw-gold-600',
      trend: stats.winRateChange,
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
    >
      {statCards.map((card, index) => (
        <StatCard key={card.label} {...card} delay={index * 0.1} />
      ))}
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, gradient, trend, delay }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden"
    >
      {/* Glass card background */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
        {/* Gradient accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

        {/* Icon with gradient background */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Label */}
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {label}
        </p>

        {/* Value */}
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>

          {/* Trend indicator */}
          {trend !== null && trend !== undefined && (
            <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
