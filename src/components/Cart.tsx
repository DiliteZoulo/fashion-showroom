import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.05 + i * 0.05,
      duration: 0.35,
      ease: 'easeOut',
    },
  }),
  exit: {
    opacity: 0,
    x: 30,
    transition: { duration: 0.2 },
  },
};

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, toggleCart, openCheckout, formatPrice, language } = useStore();
  const t = translations[language].cart;

  const subtotalUSD = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={toggleCart}
      />

      {/* Slide-out Panel */}
      <motion.div
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium tracking-[0.2em] text-neutral-900 uppercase">
              {t.title}
            </h2>
            <span className="text-xs text-neutral-400">({totalItems})</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCart}
            className="p-1.5 text-neutral-500 transition-colors hover:text-neutral-900 rounded-full hover:bg-neutral-100 cursor-pointer"
            aria-label="Close cart"
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-20 text-neutral-400">
              <ShoppingBag size={44} strokeWidth={1} className="mb-4 text-neutral-300" />
              <p className="text-sm font-light tracking-[0.15em] uppercase text-neutral-600">
                {t.emptyTitle}
              </p>
              <p className="mt-2 text-xs text-neutral-400 max-w-[240px]">
                {t.emptySub}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => {
                const pName = language === 'fr' && item.product.nameFr ? item.product.nameFr : item.product.name;
                return (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="flex gap-4 border-b border-neutral-100 py-4 last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                      <img
                        src={item.product.image}
                        alt={pName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-xs font-medium tracking-wide text-neutral-900 line-clamp-1">
                            {pName}
                          </h3>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              removeFromCart(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize
                              )
                            }
                            className="p-1 text-neutral-300 transition-colors hover:text-red-500 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                          </motion.button>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full border border-neutral-300"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                          <span className="text-[11px] text-neutral-500">
                            {item.selectedSize}
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-semibold text-neutral-800">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2.5">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity - 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </motion.button>
                        <span className="min-w-[16px] text-center text-xs font-medium text-neutral-900">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity + 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-neutral-100 px-6 py-5 bg-neutral-50/50">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs tracking-[0.15em] uppercase text-neutral-500">
                {t.subtotal}
              </span>
              <span className="text-sm font-semibold text-neutral-900">
                {formatPrice(subtotalUSD)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCheckout}
              className="w-full bg-neutral-900 py-3.5 text-xs font-medium tracking-[0.25em] uppercase text-white transition-colors hover:bg-black rounded-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.checkoutBtn}</span>
              <span>&bull;</span>
              <span>{formatPrice(subtotalUSD)}</span>
            </motion.button>
            <p className="mt-2 text-center text-[10px] text-neutral-400 tracking-wider">
              {t.shippingNotice}
            </p>
            <p className="mt-1 text-center text-[9px] text-amber-700/80 tracking-wider uppercase font-medium">
              {t.promoHint}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
