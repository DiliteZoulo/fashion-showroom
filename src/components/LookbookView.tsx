import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Eye, Layers } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import { getAllOutfits } from '../data/models';
import type { Outfit, Model } from '../types';

const seasonOptions = ['All Seasons', 'Fall/Winter', 'Spring/Summer'] as const;

const LookbookView: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('All Seasons');
  const navigateToLook = useStore((s) => s.navigateToLook);
  const selectProduct = useStore((s) => s.selectProduct);
  const formatPrice = useStore((s) => s.formatPrice);
  const language = useStore((s) => s.language);

  const t = translations[language].lookbook;
  const allOutfits = getAllOutfits();

  const filteredOutfits = allOutfits.filter((outfit) => {
    if (selectedSeason === 'All Seasons') return true;
    return outfit.season === selectedSeason;
  });

  const getSeasonLabel = (seasonKey: string) => {
    if (seasonKey === 'All Seasons') return t.allSeasons;
    if (seasonKey === 'Fall/Winter') return t.fallWinter;
    if (seasonKey === 'Spring/Summer') return t.springSummer;
    return seasonKey;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-28 md:pt-36 pb-24 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1440px] mx-auto">
        {/* Editorial Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/5 text-neutral-600 text-[11px] tracking-[0.25em] uppercase mb-4 font-medium">
            <Sparkles size={12} className="text-amber-600" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.25em] text-neutral-900 uppercase">
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-xs md:text-sm text-neutral-500 font-light tracking-wider leading-relaxed">
            {t.description}
          </p>
          <div className="mx-auto mt-6 h-[1px] w-16 bg-neutral-300" />

          {/* Season filters */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {seasonOptions.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s)}
                className={`text-xs px-5 py-2 rounded-full tracking-wider uppercase font-medium transition-all duration-300 cursor-pointer ${
                  selectedSeason === s
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-black'
                }`}
              >
                {getSeasonLabel(s)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Editorial Outfits Showcase */}
        <div className="space-y-24">
          {filteredOutfits.map((outfitItem, index) => {
            const isReversed = index % 2 === 1;
            const modelOutfitIndex = outfitItem.model.outfits.findIndex((o) => o.id === outfitItem.id);
            const activeIndex = modelOutfitIndex !== -1 ? modelOutfitIndex : 0;

            return (
              <motion.div
                key={outfitItem.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-neutral-200/60 flex flex-col ${
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}
              >
                {/* Visual Editorial Column */}
                <div className="relative lg:w-1/2 aspect-[3/4] lg:aspect-auto overflow-hidden bg-neutral-900 group">
                  <img
                    src={outfitItem.image || outfitItem.model.image}
                    alt={outfitItem.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md text-[10px] tracking-[0.25em] font-medium uppercase px-3 py-1.5 rounded text-neutral-900 shadow">
                      {t.lookNumber} {index + 1 < 10 ? `0${index + 1}` : index + 1} • {getSeasonLabel(outfitItem.season)}
                    </span>
                  </div>

                  {/* Overlay Action */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-[11px] tracking-[0.2em] uppercase font-light">
                        {t.muse}
                      </p>
                      <h4 className="text-white text-lg tracking-[0.15em] uppercase font-light">
                        {outfitItem.model.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => navigateToLook(outfitItem.model.id, activeIndex)}
                      className="px-4 py-2.5 bg-white text-neutral-900 rounded-sm text-xs tracking-[0.2em] uppercase font-medium hover:bg-neutral-100 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Layers size={14} />
                      <span>{t.interactiveBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Ensemble Narrative & Wardrobe Breakdown */}
                <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-neutral-400 uppercase font-medium">
                      <span>{t.curatedLook}</span>
                      <span>•</span>
                      <span>{outfitItem.products.length} {t.garments}</span>
                    </div>

                    <h2 className="mt-2 text-3xl md:text-4xl font-light tracking-[0.2em] text-neutral-900 uppercase">
                      {outfitItem.name}
                    </h2>

                    <p className="mt-4 text-xs md:text-sm text-neutral-600 font-light leading-relaxed">
                      {outfitItem.description}
                    </p>

                    {/* Pieces included in this look */}
                    <div className="mt-8 pt-8 border-t border-neutral-100">
                      <h4 className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium mb-4">
                        {t.piecesIncluded}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {outfitItem.products.map((p) => {
                          const pName = language === 'fr' && p.nameFr ? p.nameFr : p.name;
                          return (
                            <div
                              key={p.id}
                              onClick={() => selectProduct(p.id)}
                              className="group/item flex items-center gap-3 p-2.5 rounded-lg border border-neutral-200/70 hover:border-neutral-900 bg-neutral-50/50 hover:bg-white transition-all cursor-pointer"
                            >
                              <img
                                src={p.image}
                                alt={pName}
                                className="w-12 h-14 object-cover rounded bg-neutral-100 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                  {p.category}
                                </p>
                                <h5 className="text-xs font-medium text-neutral-800 truncate group-hover/item:text-black">
                                  {pName}
                                </h5>
                                <p className="text-xs font-semibold text-neutral-900 mt-0.5">
                                  {formatPrice(p.price)}
                                </p>
                              </div>
                              <Eye size={14} className="text-neutral-400 group-hover/item:text-black flex-shrink-0 mr-1" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="mt-10 pt-6 border-t border-neutral-100 flex items-center justify-between">
                    <button
                      onClick={() => navigateToLook(outfitItem.model.id, activeIndex)}
                      className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase font-medium text-neutral-900 hover:text-black group/btn cursor-pointer"
                    >
                      <span>{t.exploreShowroom}</span>
                      <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>

                    <span className="text-[11px] tracking-wider text-neutral-400">
                      {outfitItem.hotspots.length} {t.hotspotsCount}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LookbookView;
