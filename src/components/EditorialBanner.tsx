import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';

const EditorialBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const language = useStore((s) => s.language);
  const t = translations[language].banner;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ minHeight: '60vh' }}
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY }}
      >
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80"
          alt="Editorial fashion"
          className="h-[120%] w-full object-cover"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative flex min-h-[60vh] flex-col items-center justify-center px-8 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4 text-[11px] tracking-[0.4em] text-white/70"
        >
          {t.season}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl font-light tracking-[0.3em] text-white md:text-7xl lg:text-8xl"
        >
          {t.headlinePart1}
          <br />
          {t.headlinePart2}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,1)', color: '#000' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('collection')}
            transition={{ duration: 0.3 }}
            className="border border-white/60 bg-transparent px-10 py-3.5 text-[11px] font-semibold tracking-[0.3em] text-white backdrop-blur-sm cursor-pointer"
          >
            {t.button}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EditorialBanner;
