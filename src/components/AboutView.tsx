import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Truck, ShieldCheck, CreditCard, Gift, MessageCircle, PackageCheck, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';

const AboutView: React.FC = () => {
  const setActiveTab = useStore((s) => s.setActiveTab);
  const language = useStore((s) => s.language);
  const t = translations[language].about;

  const pillarIcons = [Truck, CreditCard, ShieldCheck];
  const serviceIcons = [Gift, MessageCircle, PackageCheck];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 pb-24 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
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
          <p className="mt-4 max-w-2xl mx-auto text-xs md:text-sm text-neutral-600 font-light tracking-wider leading-relaxed">
            {t.subtitle}
          </p>
          <div className="mx-auto mt-6 h-[1px] w-16 bg-neutral-300" />
        </motion.div>

        {/* Narrative Section - E-Commerce Pure Player */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-neutral-700 font-light leading-relaxed"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
              {t.manifestoBadge}
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-neutral-900 uppercase leading-snug">
              {t.manifestoTitle}
            </h2>
            <p className="text-sm text-neutral-600">
              {t.manifestoP1}
            </p>
            <p className="text-sm text-neutral-600">
              {t.manifestoP2}
            </p>
            <div className="pt-4">
              <button
                onClick={() => setActiveTab('collection')}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-neutral-900 text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-black transition-colors rounded-sm cursor-pointer shadow-md"
              >
                <span>{t.discoverBtn}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=85"
              alt="Maison Atelier & E-Commerce"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/70">
                100% E-Commerce • Direct Atelier
              </p>
              <p className="text-sm font-light tracking-wider">
                Livraison express & scellée • BaridiMob & CCP acceptés
              </p>
            </div>
          </motion.div>
        </div>

        {/* E-Commerce Commitments Pillars */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
              Garanties Boutique
            </span>
            <h3 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-neutral-900 uppercase mt-1">
              {t.pillarsTitle}
            </h3>
            <p className="text-xs text-neutral-500 font-light tracking-wider mt-2">
              {t.pillarsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.pillars.map((pillar, i) => {
              const Icon = pillarIcons[i] || ShieldCheck;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="bg-white rounded-xl p-8 border border-neutral-200/70 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-6">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-sm font-semibold tracking-[0.15em] uppercase text-neutral-900 mb-3">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Digital Shopping Experience Highlights */}
        <div>
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
              Services Exclusifs
            </span>
            <h3 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-neutral-900 uppercase mt-1">
              {t.onlineFeaturesTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.onlineFeatures.map((feature, i) => {
              const Icon = serviceIcons[i] || Gift;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="bg-neutral-50 rounded-xl p-7 border border-neutral-200/60 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-4">
                      <Icon size={20} />
                    </div>
                    <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
