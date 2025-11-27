'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp } from '@components/animation/variants';

export default function FadeInView({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}
