import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, ArrowUpDown, Eye, ShoppingBag, Sparkles, X } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import { getAllProducts } from '../data/models';
import type { Product } from '../types';

const categoryKeys = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'] as const;
const seasonKeys = ['All Seasons', 'Fall/Winter', 'Spring/Summer'] as const;

type SortOption = 'curated' | 'price-asc' | 'price-desc' | 'name';

const CollectionCatalog: React.FC = () => {
  const selectProduct = useStore((s) => s.selectProduct);
  const addToCart = useStore((s) => s.addToCart);
  const formatPrice = useStore((s) => s.formatPrice);
  const language = useStore((s) => s.language);

  const t = translations[language].collection;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedSeason, setSelectedSeason] = useState<string>('All Seasons');
  const [sortOption, setSortOption] = useState<SortOption>('curated');
  const [searchFilter, setSearchFilter] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const allProducts = useMemo(() => getAllProducts(), []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (activeCategory !== 'All' && product.category !== activeCategory) {
        return false;
      }
      // Season filter
      if (selectedSeason !== 'All Seasons') {
        const isFW = product.lookId?.includes('a');
        if (selectedSeason === 'Fall/Winter' && !isFW) return false;
        if (selectedSeason === 'Spring/Summer' && isFW) return false;
      }
      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q) || (product.nameFr && product.nameFr.toLowerCase().includes(q));
        const matchesCat = product.category.toLowerCase().includes(q) || (product.categoryFr && product.categoryFr.toLowerCase().includes(q));
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesModel = product.modelName?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc && !matchesModel) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [allProducts, activeCategory, selectedSeason, sortOption, searchFilter]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultColor = product.colors?.[0]?.name || 'Standard';
    const defaultSize = product.sizes?.[0] || 'M';
    addToCart(product, defaultColor, defaultSize);
    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 pb-24 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1440px] mx-auto">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/5 text-neutral-600 text-[11px] tracking-[0.25em] uppercase mb-4">
            <Sparkles size={12} className="text-amber-600" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] text-neutral-900 uppercase">
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-xs md:text-sm text-neutral-500 font-light tracking-wider leading-relaxed">
            {t.description}
          </p>
          <div className="mx-auto mt-6 h-[1px] w-16 bg-neutral-300" />
        </motion.div>

        {/* Filter Controls Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-sm border border-neutral-200/60 mb-10 space-y-4">
          {/* Top row: Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400 flex items-center gap-1.5 mr-2 flex-shrink-0">
              <Filter size={13} /> {t.categoryLabel}
            </span>
            {categoryKeys.map((catKey) => {
              const label = t.categories[catKey as keyof typeof t.categories] || catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategory(catKey)}
                  className={`text-xs px-4 py-2 rounded-full transition-all duration-300 tracking-wider whitespace-nowrap uppercase font-medium cursor-pointer ${
                    activeCategory === catKey
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Bottom row: Seasons, Search & Sorting */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-3 border-t border-neutral-100">
            {/* Season buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400 flex items-center gap-1.5 mr-1">
                <SlidersHorizontal size={13} /> {t.seasonLabel}
              </span>
              {seasonKeys.map((seasonKey) => {
                const label = t.seasons[seasonKey as keyof typeof t.seasons] || seasonKey;
                return (
                  <button
                    key={seasonKey}
                    onClick={() => setSelectedSeason(seasonKey)}
                    className={`text-[11px] px-3 py-1.5 rounded-md transition-colors uppercase tracking-wider cursor-pointer ${
                      selectedSeason === seasonKey
                        ? 'bg-neutral-800 text-white font-medium'
                        : 'bg-transparent text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Right side: Search & Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-56">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={t.filterPlaceholder}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg px-3 py-2 pl-3 pr-7 focus:outline-none focus:border-neutral-900 transition-colors"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <ArrowUpDown size={13} className="text-neutral-400" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-900 text-neutral-700 cursor-pointer font-medium"
                >
                  <option value="curated">{t.sort.curated}</option>
                  <option value="price-asc">{t.sort['price-asc']}</option>
                  <option value="price-desc">{t.sort['price-desc']}</option>
                  <option value="name">{t.sort.name}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-medium">
            {t.showing} <span className="font-bold text-neutral-900">{filteredProducts.length}</span> {t.pieces}
            {activeCategory !== 'All' && (
              <span> {t.inCategory} {t.categories[activeCategory as keyof typeof t.categories] || activeCategory}</span>
            )}
          </p>
          {(activeCategory !== 'All' || selectedSeason !== 'All Seasons' || searchFilter) && (
            <button
              onClick={() => {
                setActiveCategory('All');
                setSelectedSeason('All Seasons');
                setSearchFilter('');
              }}
              className="text-xs tracking-wider text-neutral-500 hover:text-neutral-900 underline underline-offset-4 cursor-pointer"
            >
              {t.resetFilters}
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center max-w-md mx-auto">
            <ShoppingBag size={48} className="mx-auto text-neutral-300 mb-4 stroke-1" />
            <h3 className="text-base font-light tracking-[0.15em] uppercase text-neutral-800">
              {t.noResults}
            </h3>
            <p className="mt-2 text-xs text-neutral-400">
              {t.noResultsSub}
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSelectedSeason('All Seasons');
                setSearchFilter('');
              }}
              className="mt-6 px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-colors cursor-pointer"
            >
              {t.showAll}
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const displayName = language === 'fr' && product.nameFr ? product.nameFr : product.name;
                const displayCategory = language === 'fr'
                  ? (t.categories[product.category as keyof typeof t.categories] || product.category)
                  : product.category;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => selectProduct(product.id)}
                    className="group bg-white rounded-xl overflow-hidden border border-neutral-200/70 hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                      <img
                        src={product.image}
                        alt={displayName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="bg-white/90 backdrop-blur-md text-[10px] tracking-[0.2em] font-medium uppercase px-2.5 py-1 rounded text-neutral-800 shadow-sm">
                          {displayCategory}
                        </span>
                        {product.originalPrice && (
                          <span className="bg-neutral-900 text-white text-[9px] tracking-[0.15em] font-medium uppercase px-2 py-0.5 rounded shadow-sm">
                            Exclusive
                          </span>
                        )}
                      </div>

                      {/* Provenance Tag on Model Look */}
                      {product.modelName && product.lookName && (
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-block bg-black/75 backdrop-blur-md text-[10px] text-white/90 px-2.5 py-1 rounded tracking-wide truncate max-w-full">
                            {product.modelName} • {product.lookName}
                          </span>
                        </div>
                      )}

                      {/* Quick Action Floating Overlay */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectProduct(product.id);
                          }}
                          className="p-2.5 bg-white text-neutral-800 rounded-full shadow-md hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                          title="Inspect"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`p-2.5 rounded-full shadow-md transition-colors cursor-pointer ${
                            justAddedId === product.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-neutral-800 hover:bg-neutral-900 hover:text-white'
                          }`}
                          title="Add to Bag"
                        >
                          <ShoppingBag size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Color swatches */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex items-center gap-1.5 mb-2.5">
                            {product.colors.map((c) => (
                              <span
                                key={c.name}
                                className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                            <span className="text-[10px] text-neutral-400 ml-1">
                              {product.colors.length} {language === 'fr' ? 'teintes' : 'shades'}
                            </span>
                          </div>
                        )}

                        <h3 className="text-sm font-medium tracking-wide text-neutral-900 group-hover:text-black transition-colors line-clamp-1">
                          {displayName}
                        </h3>

                        {product.material && (
                          <p className="mt-1 text-[11px] text-neutral-500 font-light truncate">
                            {language === 'fr' && product.materialFr ? product.materialFr : product.material}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectProduct(product.id);
                          }}
                          className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                        >
                          {t.explore} &rarr;
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollectionCatalog;
