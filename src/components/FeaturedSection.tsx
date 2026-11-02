import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Plus } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import { models } from '../data/models';
import type { Product } from '../types';

const getFeaturedProducts = (): Product[] => {
  const allProducts: Product[] = [];
  models.forEach((model) => {
    model.outfits.forEach((outfit) => {
      outfit.products.forEach((product) => {
        if (!allProducts.find((p) => p.id === product.id)) {
          allProducts.push(product);
        }
      });
    });
  });
  return allProducts.slice(0, 8);
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const FeaturedSection: React.FC = () => {
  const selectProduct = useStore((s) => s.selectProduct);
  const formatPrice = useStore((s) => s.formatPrice);
  const language = useStore((s) => s.language);
  const t = translations[language].featured;

  const featured = getFeaturedProducts();

  return (
    <section className="bg-white py-24 border-t border-neutral-100">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-14 px-8 text-center"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium">
          {t.badge}
        </span>
        <h2 className="text-3xl font-light tracking-[0.25em] text-neutral-900 md:text-4xl mt-2 uppercase">
          {t.title}
        </h2>
        <div className="mx-auto mt-4 h-[1px] w-12 bg-neutral-300" />
      </motion.div>

      {/* Scrollable Row */}
      <div className="overflow-x-auto px-6 md:px-12 scrollbar-hide pb-4">
        <div className="flex gap-6 pb-2" style={{ minWidth: 'max-content' }}>
          {featured.map((product, index) => {
            const pName = language === 'fr' && product.nameFr ? product.nameFr : product.name;
            return (
              <motion.div
                key={product.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="group relative w-64 md:w-72 flex-shrink-0 cursor-pointer"
                onClick={() => selectProduct(product.id)}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-neutral-100 shadow-sm">
                  <motion.img
                    src={product.image}
                    alt={pName}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 pb-4 pt-10">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectProduct(product.id);
                        }}
                        className="flex w-full items-center justify-center gap-2 border border-white/80 bg-white/20 py-2.5 text-[11px] font-medium tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-neutral-900 rounded-sm cursor-pointer"
                      >
                        <Plus size={14} />
                        {t.viewItem}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-4 space-y-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
                    {product.category}
                  </p>
                  <h3 className="text-xs font-medium tracking-wide text-neutral-800 line-clamp-1 group-hover:text-neutral-950 transition-colors">
                    {pName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-neutral-900">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-neutral-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
