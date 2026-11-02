import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import { models } from '../data/models';
import type { Model } from '../types';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.12,
      duration: 0.7,
      ease: 'easeOut',
    },
  }),
};

const HeroSection: React.FC = () => {
  const selectedModelId = useStore((s) => s.selectedModelId);
  const selectModel = useStore((s) => s.selectModel);
  const language = useStore((s) => s.language);
  const t = translations[language].hero;

  return (
    <section className="relative min-h-screen pt-28 md:pt-36 pb-20 px-6 md:px-12 lg:px-16 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[#FAFAF8]" />

      <div className="relative max-w-[1440px] mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-[12vw] md:text-[8vw] font-light tracking-tight text-neutral-900 leading-[0.9] select-none">
            {t.headline}
          </h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className="text-[11px] md:text-xs tracking-[0.4em] text-neutral-400 uppercase mt-4 md:mt-6"
          >
            {t.season}
          </motion.p>
        </motion.div>

        {/* Model cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            layout
            className="flex gap-4 md:gap-5 overflow-x-auto pb-6 scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {models.map((model: Model, i: number) => {
              const isSelected = selectedModelId === model.id;
              const hasSelection = selectedModelId !== null;
              const isOther = hasSelection && !isSelected;

              return (
                <motion.div
                  key={model.id}
                  layoutId={`model-card-${model.id}`}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => selectModel(model.id)}
                  className={`relative cursor-pointer group flex-shrink-0 rounded-lg overflow-hidden transition-all duration-500 ${
                    isSelected
                      ? 'w-[55vw] md:w-[45vw] lg:w-[40vw]'
                      : isOther
                        ? 'w-[18vw] md:w-[12vw] lg:w-[10vw]'
                        : 'w-[42vw] md:w-[24vw] lg:w-[22vw]'
                  }`}
                  style={{ aspectRatio: '3/4' }}
                  whileHover={!hasSelection ? { scale: 1.02 } : undefined}
                  transition={{
                    layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.4, ease: 'easeOut' },
                  }}
                >
                  {/* Model image */}
                  <motion.img
                    src={model.image}
                    alt={model.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{
                      scale: isSelected ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />

                  {/* Gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                    animate={{
                      opacity: isOther ? 0.6 : 1,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Darkening overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                  {/* Model info */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
                    animate={{
                      opacity: isOther ? 0 : 1,
                      y: isOther ? 10 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-white text-sm md:text-base font-light tracking-[0.2em] uppercase">
                      {model.name}
                    </h3>
                    {isSelected && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-white/60 text-[11px] tracking-[0.15em] uppercase mt-1"
                      >
                        {model.outfits.length} {t.looksAvailable}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Selected indicator line */}
                  {isSelected && (
                    <motion.div
                      layoutId="selected-indicator"
                      className="absolute top-0 left-0 right-0 h-[2px] bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Scroll hint - only when no selection */}
        {!selectedModelId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex items-center gap-3 mt-8"
          >
            <div className="w-8 h-[1px] bg-neutral-300" />
            <p className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
              {t.selectPrompt}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
