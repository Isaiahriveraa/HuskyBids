'use client';
import { motion } from 'framer-motion';
import { cardHover } from '../../../lib/animations/variants';

export default function AnimatedCard({ children, className = '', onClick }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
