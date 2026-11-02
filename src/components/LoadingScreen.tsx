import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

const brandName = 'MAISON';
const subtitle = 'FASHION EXPERIENCE';

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.08,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const duration = 2500;
    const interval = 16;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(onComplete, 400);
      }
      setProgress(current);
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Top half */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ backgroundColor: '#1A1A1A' }}
            exit={{
              clipPath: 'inset(0 0 50% 0)',
            }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          >
            {/* Letter-by-letter brand name */}
            <div className="flex items-center gap-[0.15em] mb-6">
              {brandName.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-white text-5xl md:text-7xl font-extralight tracking-[0.3em] select-none"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
              className="text-neutral-500 text-[11px] tracking-[0.5em] uppercase mb-12"
            >
              {subtitle}
            </motion.p>

            {/* Progress bar */}
            <div className="w-48 md:w-64 h-[1px] bg-neutral-700 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>

            {/* Progress percentage */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-neutral-600 text-[10px] tracking-[0.3em] mt-4 tabular-nums font-light"
            >
              {Math.round(progress)}%
            </motion.span>
          </motion.div>

          {/* Bottom half overlay (for split animation) */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: '#1A1A1A' }}
            initial={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{
              clipPath: 'inset(50% 0 0 0)',
            }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
