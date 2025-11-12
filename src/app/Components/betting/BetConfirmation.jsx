'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function BetConfirmation({ isVisible, betDetails, onClose }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);

      // Trigger confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#4B2E83', '#E8D21D', '#FFFFFF'],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#4B2E83', '#E8D21D', '#FFFFFF'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 3000);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-br from-uw-purple-600 to-uw-purple-800 dark:from-uw-purple-700 dark:to-uw-purple-900 text-white rounded-3xl p-12 shadow-2xl max-w-md pointer-events-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="text-5xl"
                >
                  ✓
                </motion.div>
              </div>

              <h2 className="text-4xl font-black mb-4">Bet Placed!</h2>
              <p className="text-xl mb-2">{betDetails?.amount} biscuits</p>
              <p className="text-lg opacity-90">on {betDetails?.team}</p>
              <p className="text-2xl font-bold mt-4">
                Potential Win: {betDetails?.potentialWin}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
