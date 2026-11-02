import { create } from 'zustand';
import type { CartItem, Product, NavTab, OrderReceipt, Language, Currency } from '../types';

interface StoreState {
  language: Language;
  currency: Currency;
  activeTab: NavTab;
  selectedModelId: string | null;
  selectedProductId: string | null;
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isSearchOpen: boolean;
  isAccountOpen: boolean;
  isProductDetailOpen: boolean;
  isLoading: boolean;
  currentOutfitIndices: Record<string, number>;
  selectedCategory: string;
  lastOrder: OrderReceipt | null;

  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceUSD: number) => string;
  setActiveTab: (tab: NavTab) => void;
  selectModel: (modelId: string) => void;
  clearSelection: () => void;
  selectProduct: (productId: string) => void;
  clearProduct: () => void;
  addToCart: (product: Product, selectedColor: string, selectedSize: string) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedColor: string, selectedSize: string, quantity: number) => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  toggleSearch: () => void;
  toggleAccount: () => void;
  setSelectedCategory: (category: string) => void;
  setLastOrder: (order: OrderReceipt | null) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  nextOutfit: (modelId: string, totalOutfits: number) => void;
  prevOutfit: (modelId: string, totalOutfits: number) => void;
  navigateToLook: (modelId: string, outfitIndex: number) => void;
}

const useStore = create<StoreState>((set, get) => ({
  language: 'fr',
  currency: 'DZD',
  activeTab: 'home',
  selectedModelId: null,
  selectedProductId: null,
  cart: [],
  isCartOpen: false,
  isCheckoutOpen: false,
  isSearchOpen: false,
  isAccountOpen: false,
  isProductDetailOpen: false,
  isLoading: false,
  currentOutfitIndices: {},
  selectedCategory: 'All',
  lastOrder: null,

  setLanguage: (lang) =>
    set({ language: lang }),

  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'fr' ? 'en' : 'fr' })),

  setCurrency: (currency) =>
    set({ currency }),

  formatPrice: (priceUSD) => {
    const { currency, language } = get();
    if (currency === 'DZD') {
      const dzd = priceUSD * 150; // standard conversion: 1 USD ~ 150 DZD
      return language === 'fr'
        ? `${dzd.toLocaleString('fr-FR')} DA`
        : `${dzd.toLocaleString('en-US')} DZD`;
    }
    return language === 'fr'
      ? `${priceUSD.toLocaleString('fr-FR')} €`
      : `$${priceUSD.toLocaleString('en-US')}`;
  },

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
      selectedModelId: tab === 'home' ? null : undefined,
    }),

  selectModel: (modelId) =>
    set({ selectedModelId: modelId }),

  clearSelection: () =>
    set({ selectedModelId: null, selectedProductId: null, isProductDetailOpen: false }),

  selectProduct: (productId) =>
    set({ selectedProductId: productId, isProductDetailOpen: true }),

  clearProduct: () =>
    set({ selectedProductId: null, isProductDetailOpen: false }),

  addToCart: (product, selectedColor, selectedSize) =>
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex !== -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1,
        };
        return { cart: updatedCart };
      }

      return {
        cart: [
          ...state.cart,
          { product, quantity: 1, selectedColor, selectedSize },
        ],
      };
    }),

  removeFromCart: (productId, selectedColor, selectedSize) =>
    set((state) => ({
      cart: state.cart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      ),
    })),

  updateQuantity: (productId, selectedColor, selectedSize, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          cart: state.cart.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
              )
          ),
        };
      }

      return {
        cart: state.cart.map((item) =>
          item.product.id === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity }
            : item
        ),
      };
    }),

  toggleCart: () =>
    set((state) => ({ isCartOpen: !state.isCartOpen })),

  openCheckout: () =>
    set({ isCartOpen: false, isCheckoutOpen: true }),

  closeCheckout: () =>
    set({ isCheckoutOpen: false }),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  toggleAccount: () =>
    set((state) => ({ isAccountOpen: !state.isAccountOpen })),

  setSelectedCategory: (category) =>
    set({ selectedCategory: category }),

  setLastOrder: (order) =>
    set({ lastOrder: order }),

  clearCart: () =>
    set({ cart: [] }),

  setLoading: (loading) =>
    set({ isLoading: loading }),

  nextOutfit: (modelId, totalOutfits) =>
    set((state) => {
      const currentIndex = state.currentOutfitIndices[modelId] ?? 0;
      return {
        currentOutfitIndices: {
          ...state.currentOutfitIndices,
          [modelId]: (currentIndex + 1) % totalOutfits,
        },
      };
    }),

  prevOutfit: (modelId, totalOutfits) =>
    set((state) => {
      const currentIndex = state.currentOutfitIndices[modelId] ?? 0;
      return {
        currentOutfitIndices: {
          ...state.currentOutfitIndices,
          [modelId]: (currentIndex - 1 + totalOutfits) % totalOutfits,
        },
      };
    }),

  navigateToLook: (modelId, outfitIndex) =>
    set((state) => ({
      activeTab: 'home',
      selectedModelId: modelId,
      currentOutfitIndices: {
        ...state.currentOutfitIndices,
        [modelId]: outfitIndex,
      },
    })),
}));

export default useStore;
