import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X, Check, Minus, Plus, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import { models } from '../data/models';
import type { Product } from '../types';

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const panelVariants: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 28, stiffness: 260 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

function findProductById(productId: string): Product | undefined {
  for (const model of models) {
    for (const outfit of model.outfits) {
      const found = outfit.products.find((p) => p.id === productId);
      if (found) {
        return {
          ...found,
          lookId: outfit.id,
          lookName: outfit.name,
          modelId: model.id,
          modelName: model.name,
        };
      }
    }
  }
  return undefined;
}

const ProductDetail: React.FC = () => {
  const selectedProductId = useStore((s) => s.selectedProductId);
  const clearProduct = useStore((s) => s.clearProduct);
  const addToCart = useStore((s) => s.addToCart);
  const formatPrice = useStore((s) => s.formatPrice);
  const language = useStore((s) => s.language);
  const navigateToLook = useStore((s) => s.navigateToLook);

  const t = translations[language].product;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = selectedProductId ? findProductById(selectedProductId) : undefined;

  useEffect(() => {
    setSelectedColorIndex(0);
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize('M');
    }
    setQuantity(1);
    setAddedToCart(false);
  }, [selectedProductId, product]);

  if (!product) return null;

  const pName = language === 'fr' && product.nameFr ? product.nameFr : product.name;
  const pCat = language === 'fr' && product.categoryFr ? product.categoryFr : product.category;
  const pMaterial = language === 'fr' && product.materialFr ? product.materialFr : product.material;
  const pOrigin = language === 'fr' && product.originFr ? product.originFr : product.origin;
  const pCare = language === 'fr' && product.careFr ? product.careFr : product.care;

  const activeColor = product.colors?.[selectedColorIndex]?.name ?? 'Standard';

  const handleAddToCart = () => {
    if (!product) return;
    const finalSize = selectedSize || product.sizes?.[0] || 'One Size';
    for (let i = 0; i < quantity; i++) {
      addToCart(product, activeColor, finalSize);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={clearProduct}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Slide-in Panel */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-y-auto"
      >
        {/* Header / Close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/90 backdrop-blur-md px-6 py-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
            {t.showcase}
          </span>
          <button
            onClick={clearProduct}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Main Product Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100 shadow-inner">
            <img
              src={product.image}
              alt={pName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Title & Price */}
          <div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
              {pCat}
            </span>
            <h1 className="mt-1 text-2xl font-light tracking-tight text-neutral-900">
              {pName}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xl font-medium text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Color Picker */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                  {t.color}
                </span>
                <span className="text-xs text-neutral-600 font-medium">
                  {product.colors[selectedColorIndex]?.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`relative h-7 w-7 rounded-full border transition-all cursor-pointer ${
                      selectedColorIndex === idx
                        ? 'ring-2 ring-neutral-900 ring-offset-2'
                        : 'border-neutral-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Picker */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                  {t.size}
                </span>
                <span className="text-[10px] tracking-wider text-neutral-400 uppercase">
                  {t.trueToSize}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] py-2 px-3 text-xs tracking-wider uppercase transition-all rounded-sm border cursor-pointer ${
                      selectedSize === size
                        ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium block mb-2">
              {t.qty}
            </span>
            <div className="inline-flex items-center rounded-sm border border-neutral-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-10 text-center text-xs font-medium text-neutral-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Add to Bag Button */}
          <div className="pt-2 space-y-2.5">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={addedToCart}
              className={`w-full py-4 text-xs tracking-[0.25em] uppercase font-semibold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-black'
              }`}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} />
                    {t.added}
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {t.addToBag} — {formatPrice(product.price * quantity)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Connected Showroom Look Link */}
          {product.lookName && product.modelId && (
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                  {t.completeEnsemble}
                </p>
                <p className="text-xs font-medium text-neutral-800 mt-0.5">
                  {t.look} <span className="text-neutral-950 font-semibold">{product.lookName}</span>
                  {product.modelName && <span> • {product.modelName}</span>}
                </p>
              </div>
              <button
                onClick={() => {
                  clearProduct();
                  const modelIndex = product.lookId?.includes('b') ? 1 : 0;
                  navigateToLook(product.modelId!, modelIndex);
                }}
                className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-900 hover:text-black underline underline-offset-4 cursor-pointer"
              >
                {t.viewInShowroom}
              </button>
            </div>
          )}

          {/* Description */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
              {t.notes}
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600 font-light">
              {product.description}
            </p>
          </div>

          {/* Provenance & Materials Specs */}
          {(pMaterial || pOrigin || pCare) && (
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <h3 className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
                {t.atelierSpecs}
              </h3>
              <div className="space-y-2 text-xs">
                {pMaterial && (
                  <div className="flex justify-between py-1 border-b border-neutral-50">
                    <span className="text-neutral-400">{t.composition}</span>
                    <span className="text-neutral-800 font-medium text-right max-w-[240px]">
                      {pMaterial}
                    </span>
                  </div>
                )}
                {pOrigin && (
                  <div className="flex justify-between py-1 border-b border-neutral-50">
                    <span className="text-neutral-400">{t.provenance}</span>
                    <span className="text-neutral-800 font-medium text-right">
                      {pOrigin}
                    </span>
                  </div>
                )}
                {pCare && (
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">{t.care}</span>
                    <span className="text-neutral-800 font-medium text-right max-w-[240px]">
                      {pCare}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guarantees */}
          <div className="pt-4 border-t border-neutral-100 text-[10px] text-neutral-400 tracking-wider uppercase space-y-1">
            {t.guarantees.map((g, idx) => (
              <p key={idx}>{g}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
