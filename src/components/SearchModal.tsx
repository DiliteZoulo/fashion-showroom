import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import { getAllProducts } from '../data/models';

const SearchModal: React.FC = () => {
  const isSearchOpen = useStore((s) => s.isSearchOpen);
  const toggleSearch = useStore((s) => s.toggleSearch);
  const selectProduct = useStore((s) => s.selectProduct);
  const formatPrice = useStore((s) => s.formatPrice);
  const language = useStore((s) => s.language);

  const t = translations[language].search;

  const quickTags = language === 'fr'
    ? ['Manteau', 'Blazer', 'Soie', 'Lin', 'Bottes', 'Pantalon', 'Escarpins', 'Robe']
    : ['Outerwear', 'Blazer', 'Silk', 'Linen', 'Boots', 'Trousers', 'Pumps', 'Dress'];

  const [query, setQuery] = useState('');
  const allProducts = useMemo(() => getAllProducts(), []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.nameFr && p.nameFr.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        (p.categoryFr && p.categoryFr.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.materialFr && p.materialFr.toLowerCase().includes(q)) ||
        (p.modelName && p.modelName.toLowerCase().includes(q))
    );
  }, [allProducts, query]);

  if (!isSearchOpen) return null;

  const handleSelect = (productId: string) => {
    selectProduct(productId);
    toggleSearch();
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleSearch}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="min-h-full flex items-start justify-center p-4 md:p-8 pt-20 md:pt-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
            <Search size={20} className="text-neutral-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 text-sm bg-transparent border-none outline-none text-neutral-900 placeholder-neutral-400 font-light"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={toggleSearch}
              className="text-xs tracking-wider uppercase font-medium text-neutral-500 hover:text-neutral-900 ml-2 cursor-pointer"
            >
              {t.cancel}
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="px-6 py-3 bg-neutral-50/80 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1 flex-shrink-0">
              <Sparkles size={11} className="text-amber-500" /> {t.quickTags}
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-neutral-200/80 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results Area */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {!query.trim() ? (
              <div className="text-center py-12 text-neutral-400 space-y-2">
                <Search size={36} className="mx-auto text-neutral-300 stroke-1" />
                <p className="text-xs uppercase tracking-[0.2em]">
                  {t.emptyStateTitle}
                </p>
                <p className="text-[11px] text-neutral-400 font-light">
                  {t.emptyStateSub}
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                  {t.noMatch} "{query}"
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  {t.noMatchSub}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium mb-3">
                  {searchResults.length} {searchResults.length > 1 ? t.founds : t.found}
                </p>
                {searchResults.map((product) => {
                  const pName = language === 'fr' && product.nameFr ? product.nameFr : product.name;
                  const pCat = language === 'fr' && product.categoryFr ? product.categoryFr : product.category;
                  const pMat = language === 'fr' && product.materialFr ? product.materialFr : product.material;
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="flex items-center gap-4 p-3 rounded-xl border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 transition-all cursor-pointer group"
                    >
                      <img
                        src={product.image}
                        alt={pName}
                        className="w-14 h-16 object-cover rounded-md bg-neutral-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                            {pCat}
                          </span>
                          {product.modelName && (
                            <span className="text-[10px] text-neutral-400">
                              • {product.modelName}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-medium text-neutral-900 group-hover:text-black truncate mt-0.5">
                          {pName}
                        </h4>
                        {pMat && (
                          <p className="text-[11px] text-neutral-500 font-light truncate">
                            {pMat}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-semibold text-neutral-900">
                          {formatPrice(product.price)}
                        </p>
                        <ArrowRight size={14} className="text-neutral-400 group-hover:text-neutral-900 ml-auto mt-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchModal;
