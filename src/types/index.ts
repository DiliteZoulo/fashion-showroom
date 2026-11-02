export type NavTab = 'home' | 'collection' | 'lookbook' | 'about';
export type Language = 'fr' | 'en';
export type Currency = 'DZD' | 'EUR';

export interface Product {
  id: string;
  name: string;
  nameFr?: string;
  category: string;
  categoryFr?: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors: ColorOption[];
  sizes: string[];
  description: string;
  descriptionFr?: string;
  material?: string;
  materialFr?: string;
  origin?: string;
  originFr?: string;
  care?: string;
  careFr?: string;
  lookId?: string;
  lookName?: string;
  lookNameFr?: string;
  modelId?: string;
  modelName?: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface HotspotPosition {
  x: number; // percentage
  y: number; // percentage
  productId: string;
  label: string;
}

export type Hotspot = HotspotPosition;

export interface Outfit {
  id: string;
  name: string;
  description: string;
  season: string;
  image?: string;
  products: Product[];
  hotspots: HotspotPosition[];
}

export interface Model {
  id: string;
  name: string;
  image: string;
  outfits: Outfit[];
  currentOutfitIndex: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface OrderReceipt {
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  paymentMethod: string;
  paymentDetails?: string;
  transactionRef?: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

