import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, Tag, ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import { models } from '../data/models';
import type { Model, Outfit, HotspotPosition } from '../types';

const panelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

interface HotspotDotProps {
  hotspot: HotspotPosition;
  onSelect: (productId: string) => void;
}

const HotspotDot: React.FC<HotspotDotProps> = ({ hotspot, onSelect }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="absolute z-20 group"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.25 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelect(hotspot.productId)}
        className="relative flex items-center justify-center p-2 cursor-pointer focus:outline-none"
        aria-label={`View ${hotspot.label}`}
      >
        {/* Outer pulse */}
        <span className="absolute h-9 w-9 rounded-full bg-white/30 animate-ping opacity-75" />

        {/* Halo */}
        <span className="absolute h-6 w-6 rounded-full bg-white/40 backdrop-blur-sm shadow-md" />

        {/* Center dot */}
        <span className="relative h-3 w-3 rounded-full bg-white border border-neutral-900 shadow-lg" />
      </motion.button>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-neutral-900/95 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-white shadow-xl flex items-center gap-1.5"
          >
            <Tag size={12} className="text-amber-300" />
            <span>{hotspot.label}</span>
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ModelShowroom: React.FC = () => {
  const selectedModelId = useStore((s) => s.selectedModelId);
  const currentOutfitIndices = useStore((s) => s.currentOutfitIndices);
  const clearSelection = useStore((s) => s.clearSelection);
  const nextOutfit = useStore((s) => s.nextOutfit);
  const prevOutfit = useStore((s) => s.prevOutfit);
  const selectProduct = useStore((s) => s.selectProduct);
  const formatPrice = useStore((s) => s.formatPrice);
  const language = useStore((s) => s.language);
  const t = translations[language].showroom;

  const model: Model | undefined = models.find((m) => m.id === selectedModelId);

  if (!model) return null;

  const currentOutfitIndex = currentOutfitIndices[model.id] ?? 0;
  const outfit: Outfit = model.outfits[currentOutfitIndex] || model.outfits[0];
  const totalOutfits = model.outfits.length;

  const handleNextOutfit = () => {
    nextOutfit(model.id, totalOutfits);
  };

  const handlePrevOutfit = () => {
    prevOutfit(model.id, totalOutfits);
  };

  const outfitImage = outfit.image || model.image;

  return (
    <motion.section
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-40 bg-[#FAFAF8] overflow-y-auto pt-16 md:pt-20"
    >
      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        <button
          onClick={clearSelection}
          className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{t.back}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs tracking-[0.2em] uppercase text-neutral-400">
            {t.mode}
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <button
          onClick={clearSelection}
          className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          aria-label="Close showroom"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
        {/* Left Side: Model Studio Shot & Interactive Hotspots */}
        <div className="relative w-full lg:w-[58%] min-h-[580px] lg:min-h-full bg-neutral-100 flex items-center justify-center p-4 md:p-8 overflow-hidden select-none">
          <div className="relative w-full max-w-xl aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white">
            {/* Model Image with outfit transition */}
            <AnimatePresence mode="wait">
              <motion.img
                key={`${model.id}-${currentOutfitIndex}`}
                src={outfitImage}
                alt={`${model.name} wearing ${outfit.name}`}
                className="h-full w-full object-cover object-top"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </AnimatePresence>

            {/* Hotspots layer */}
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hotspot-group-${currentOutfitIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  {outfit.hotspots &&
                    outfit.hotspots.map((hotspot) => (
                      <HotspotDot
                        key={hotspot.productId}
                        hotspot={hotspot}
                        onSelect={selectProduct}
                      />
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Instruction pill at top */}
            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2">
              <Sparkles size={12} className="text-amber-300" />
              <span className="text-[10px] tracking-[0.15em] uppercase text-white font-medium">
                {t.hotspotsNotice}
              </span>
            </div>

            {/* Bottom outfit switch controls */}
            <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handlePrevOutfit}
                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-neutral-800 hover:bg-white transition-colors cursor-pointer"
                aria-label="Previous outfit"
              >
                <ChevronLeft size={18} />
              </motion.button>

              <div className="bg-neutral-950/80 backdrop-blur-md px-5 py-2.5 rounded-full text-white text-xs tracking-[0.2em] uppercase font-light shadow-lg">
                {t.look} {currentOutfitIndex + 1} {t.outfitOf} {totalOutfits} : {outfit.name}
              </div>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleNextOutfit}
                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-neutral-800 hover:bg-white transition-colors cursor-pointer"
                aria-label="Next outfit"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Side: Outfit Details & Complete Look Breakdown */}
        <div className="w-full lg:w-[42%] bg-white p-6 md:p-12 lg:p-14 flex flex-col justify-between border-l border-neutral-100">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] tracking-[0.35em] uppercase text-neutral-400 font-medium">
                Editorial • {model.name}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded">
                {outfit.season || '2026 Collection'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900">
              {outfit.name}
            </h1>

            <p className="mt-4 text-sm text-neutral-500 leading-relaxed font-light">
              {outfit.description}
            </p>

            <div className="my-8 h-[1px] w-full bg-neutral-100" />

            {/* Outfit Products Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-900">
                  {language === 'fr' ? 'Pièces de cet ensemble' : 'Pieces in this Look'} ({outfit.products.length})
                </h2>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Total : {formatPrice(outfit.products.reduce((acc, p) => acc + p.price, 0))}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {outfit.products.map((product) => {
                  const pName = language === 'fr' && product.nameFr ? product.nameFr : product.name;
                  return (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      onClick={() => selectProduct(product.id)}
                      className="flex gap-3 p-3 rounded-lg border border-neutral-100 hover:border-neutral-300 bg-neutral-50/50 hover:bg-white transition-all cursor-pointer shadow-sm group"
                    >
                      <div className="h-18 w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-200">
                        <img
                          src={product.image}
                          alt={pName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          <span className="text-[9px] tracking-wider uppercase text-neutral-400 block truncate">
                            {product.category}
                          </span>
                          <h3 className="text-xs font-medium text-neutral-800 group-hover:text-neutral-950 truncate mt-0.5">
                            {pName}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-neutral-900">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-[10px] text-neutral-400 group-hover:text-neutral-900 transition-colors uppercase tracking-wider">
                            {language === 'fr' ? 'Voir →' : 'View →'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick complete look action */}
          <div className="mt-10 pt-6 border-t border-neutral-100">
            <button
              onClick={() => {
                if (outfit.products[0]) {
                  selectProduct(outfit.products[0].id);
                }
              }}
              className="w-full py-4 bg-neutral-900 hover:bg-black text-white text-xs font-medium tracking-[0.25em] uppercase rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>{language === 'fr' ? 'Inspecter les pièces de ce look' : 'Explore Items in this Look'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ModelShowroom;

