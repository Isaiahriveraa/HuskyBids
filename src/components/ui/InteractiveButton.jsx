'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function InteractiveButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl font-semibold
        ${variant === 'primary'
          ? 'bg-gradient-to-r from-uw-purple-600 to-uw-purple-700 text-white'
          : 'bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white'
        }
        ${className}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Ripple effect on click */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
