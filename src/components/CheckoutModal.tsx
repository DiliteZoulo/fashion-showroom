import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  Download,
  Sparkles,
  Smartphone,
  Banknote,
} from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import type { CartItem, OrderReceipt } from '../types';

type Step = 'details' | 'payment' | 'processing' | 'success';
type PaymentMethod = 'baridimob' | 'ccp' | 'cib_edahabia' | 'cod';

const countries = [
  'Algérie',
  'France',
  'Tunisie',
  'Maroc',
  'Émirats Arabes Unis',
  'Royaume-Uni',
  'Canada',
  'États-Unis',
  'Suisse',
  'Belgique',
];

const algerianWilayas = [
  '16 - Alger',
  '31 - Oran',
  '25 - Constantine',
  '06 - Béjaïa',
  '15 - Tizi Ouzou',
  '19 - Sétif',
  '09 - Blida',
  '35 - Boumerdès',
  '13 - Tlemcen',
  '23 - Annaba',
  '05 - Batna',
  '30 - Ouargla',
  'Autre Wilaya / Région',
];

const CheckoutModal: React.FC = () => {
  const isCheckoutOpen = useStore((s) => s.isCheckoutOpen);
  const closeCheckout = useStore((s) => s.closeCheckout);
  const cart = useStore((s) => s.cart);
  const clearCart = useStore((s) => s.clearCart);
  const setLastOrder = useStore((s) => s.setLastOrder);
  const language = useStore((s) => s.language);
  const formatPrice = useStore((s) => s.formatPrice);
  const currency = useStore((s) => s.currency);

  const t = translations[language];

  const [step, setStep] = useState<Step>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('baridimob');

  // Customer Details Form
  const [name, setName] = useState('Karim Amrani');
  const [email, setEmail] = useState('k.amrani@client-maison.com');
  const [phone, setPhone] = useState('+213 550 12 34 56');
  const [address, setAddress] = useState('14 Rue Didouche Mourad');
  const [city, setCity] = useState('16 - Alger');
  const [postalCode, setPostalCode] = useState('16000');
  const [country, setCountry] = useState('Algérie');
  const [shippingMethod, setShippingMethod] = useState<'express' | 'whiteglove'>('express');

  // Payment Form Fields
  // BaridiMob
  const [baridimobTrx, setBaridimobTrx] = useState('');
  const [copiedRip, setCopiedRip] = useState(false);

  // CCP
  const [ccpReceipt, setCcpReceipt] = useState('');
  const [copiedCcp, setCopiedCcp] = useState(false);

  // CIB / Edahabia / Carte
  const [cardNumber, setCardNumber] = useState('6280 •••• •••• 9920');
  const [cardHolder, setCardHolder] = useState('KARIM AMRANI');
  const [expiry, setExpiry] = useState('09/28');
  const [cvc, setCvc] = useState('742');

  // Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Final Order Receipt
  const [completedOrder, setCompletedOrder] = useState<OrderReceipt | null>(null);

  if (!isCheckoutOpen) return null;

  const subtotalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountUSD = Math.round(subtotalUSD * appliedDiscount);
  const shippingFeeUSD = shippingMethod === 'whiteglove' ? 15 : 0;
  const grandTotalUSD = Math.max(0, subtotalUSD - discountUSD + shippingFeeUSD);

  const officialRip = '007 99999 0021345678 45';
  const officialCcp = '21345678';
  const officialCcpKey = '45';

  const handleCopy = (text: string, type: 'rip' | 'ccp') => {
    navigator.clipboard.writeText(text);
    if (type === 'rip') {
      setCopiedRip(true);
      setTimeout(() => setCopiedRip(false), 2000);
    } else {
      setCopiedCcp(true);
      setTimeout(() => setCopiedCcp(false), 2000);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'MAISON10' || code === 'WELCOME10') {
      setAppliedDiscount(0.1);
      setPromoMessage(t.checkout.promoApplied10);
    } else if (code === 'VIP20' || code === 'HAUTE20') {
      setAppliedDiscount(0.2);
      setPromoMessage(t.checkout.promoApplied20);
    } else {
      setPromoMessage(t.checkout.promoInvalid);
      setTimeout(() => setPromoMessage(null), 3500);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address || !city) {
      alert(language === 'fr' ? 'Veuillez remplir vos coordonnées de livraison.' : 'Please enter your delivery details.');
      return;
    }
    setStep('payment');
  };

  const handleExecutePayment = () => {
    setStep('processing');

    setTimeout(() => {
      const orderNumber = `MSN-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `YAL-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const date = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      let methodDisplay = '';
      let transactionId = '';

      if (paymentMethod === 'baridimob') {
        methodDisplay = 'BaridiMob (Algérie Poste RIP)';
        transactionId = baridimobTrx || `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
      } else if (paymentMethod === 'ccp') {
        methodDisplay = 'CCP (Virement / Versement Poste)';
        transactionId = ccpReceipt || `CCP-REC-${Math.floor(100000 + Math.random() * 900000)}`;
      } else if (paymentMethod === 'cib_edahabia') {
        methodDisplay = 'Carte CIB / Edahabia Interbancaire';
        transactionId = `CIB-${Math.floor(100000 + Math.random() * 900000)}`;
      } else {
        methodDisplay = language === 'fr' ? 'Paiement à la Livraison (Espèces)' : 'Cash on Delivery (Cash)';
        transactionId = 'COD-ON-ARRIVAL';
      }

      const receipt: OrderReceipt = {
        orderNumber,
        date,
        items: [...cart],
        subtotal: subtotalUSD,
        discount: discountUSD,
        shipping: shippingFeeUSD,
        total: grandTotalUSD,
        currency: currency,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        shippingCountry: country,
        paymentMethod: methodDisplay,
        transactionRef: transactionId,
        estimatedDelivery:
          shippingMethod === 'whiteglove'
            ? (language === 'fr' ? 'Aujourd’hui par coursier privé' : 'Today via private courier')
            : (language === 'fr' ? 'Sous 24h à 48h à domicile' : 'Within 24h-48h at doorstep'),
        trackingNumber,
      };

      setCompletedOrder(receipt);
      setLastOrder(receipt);
      clearCart();
      setStep('success');
    }, 2200);
  };

  const handleFinish = () => {
    closeCheckout();
    setStep('details');
    setCompletedOrder(null);
  };

  const formatCardInput = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const parts = cleaned.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const formatExpiryInput = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step === 'processing' ? undefined : handleFinish}
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
      />

      <div className="min-h-full flex items-center justify-center p-4 md:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 md:px-8 py-5 bg-neutral-50/50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-light tracking-[0.3em] uppercase text-neutral-900 font-semibold">
                MAISON
              </span>
              <span className="text-neutral-300">|</span>
              <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-medium">
                {step === 'success' ? t.checkout.orderConfirmed : t.checkout.header}
              </span>
            </div>

            {step !== 'processing' && (
              <button
                onClick={handleFinish}
                className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Stepper Progress */}
          {step !== 'success' && (
            <div className="flex items-center justify-between px-6 sm:px-8 py-3 bg-neutral-100/60 border-b border-neutral-200/50 text-[11px] tracking-[0.18em] uppercase text-neutral-500">
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step === 'details'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  1
                </span>
                <span className={step === 'details' ? 'font-semibold text-neutral-900' : ''}>
                  {t.checkout.step1}
                </span>
              </div>

              <div className="h-[1px] w-8 sm:w-16 bg-neutral-300 hidden sm:block" />

              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step === 'payment' || step === 'processing'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-300 text-neutral-600'
                  }`}
                >
                  2
                </span>
                <span
                  className={
                    step === 'payment' || step === 'processing'
                      ? 'font-semibold text-neutral-900'
                      : ''
                  }
                >
                  {t.checkout.step2}
                </span>
              </div>

              <div className="h-[1px] w-8 sm:w-16 bg-neutral-300 hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <span>{t.checkout.step3}</span>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6 md:p-8">
            {/* STEP 1: DELIVERY & CONTACT DETAILS */}
            {step === 'details' && (
              <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left side: Form fields */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-900 mb-3 flex items-center gap-2">
                      <Truck size={14} /> {t.checkout.contactInfo}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                          {t.checkout.fullName}
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            {t.checkout.email}
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            {t.checkout.phone}
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-900 mb-3">
                      {t.checkout.shippingAddress}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                          {t.checkout.street}
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Numéro, Rue, Bâtiment, Quartier..."
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            {t.checkout.city}
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            list="wilayas-list"
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
                          />
                          <datalist id="wilayas-list">
                            {algerianWilayas.map((w) => (
                              <option key={w} value={w} />
                            ))}
                          </datalist>
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            {t.checkout.postalCode}
                          </label>
                          <input
                            type="text"
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            {t.checkout.country}
                          </label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2.5 focus:border-neutral-900 focus:outline-none cursor-pointer"
                          >
                            {countries.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-900 mb-3">
                      {t.checkout.deliveryMethod}
                    </h3>
                    <div className="space-y-2">
                      <label
                        className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-colors ${
                          shippingMethod === 'express'
                            ? 'border-neutral-900 bg-neutral-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                            className="accent-neutral-900"
                          />
                          <div>
                            <p className="text-xs font-medium text-neutral-900">
                              {t.checkout.expressDelivery}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              {t.checkout.expressDeliverySub}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 uppercase">
                          {t.checkout.free}
                        </span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-colors ${
                          shippingMethod === 'whiteglove'
                            ? 'border-neutral-900 bg-neutral-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'whiteglove'}
                            onChange={() => setShippingMethod('whiteglove')}
                            className="accent-neutral-900"
                          />
                          <div>
                            <p className="text-xs font-medium text-neutral-900">
                              {t.checkout.whiteGloveDelivery}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              {t.checkout.whiteGloveDeliverySub}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-neutral-900">
                          +{formatPrice(15)}
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-neutral-900 text-white text-xs font-medium tracking-[0.25em] uppercase hover:bg-black transition-colors rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.checkout.proceedToPayment}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Right side: Order Summary */}
                <div className="lg:col-span-5 bg-neutral-50/70 p-6 rounded-xl border border-neutral-200/60 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                      {t.checkout.orderSummary} ({cart.reduce((s, i) => s + i.quantity, 0)} {t.checkout.items})
                    </h3>

                    {/* Items list */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                          className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-14 object-cover rounded bg-white shadow-xs"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-neutral-900 truncate">
                              {language === 'fr' && item.product.nameFr ? item.product.nameFr : item.product.name}
                            </h4>
                            <p className="text-[10px] text-neutral-500">
                              {item.selectedColor} • {item.selectedSize} • x{item.quantity}
                            </p>
                            <p className="text-xs font-semibold text-neutral-800 mt-0.5">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Form */}
                    <div className="mt-6 pt-4 border-t border-neutral-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder={t.checkout.promoPlaceholder}
                          className="flex-1 text-xs bg-white border border-neutral-200 rounded px-3 py-2 uppercase tracking-wider focus:outline-none focus:border-neutral-900"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-4 py-2 bg-neutral-200 text-neutral-800 text-xs font-medium rounded hover:bg-neutral-900 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
                        >
                          {t.checkout.apply}
                        </button>
                      </div>
                      {promoMessage && (
                        <p
                          className={`mt-1.5 text-[11px] ${
                            appliedDiscount > 0 ? 'text-emerald-600 font-medium' : 'text-rose-500'
                          }`}
                        >
                          {promoMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-500">
                      <span>{t.checkout.subtotal}</span>
                      <span className="text-neutral-900 font-medium">
                        {formatPrice(subtotalUSD)}
                      </span>
                    </div>

                    {discountUSD > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>{t.checkout.discount} ({(appliedDiscount * 100).toFixed(0)}%)</span>
                        <span>-{formatPrice(discountUSD)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-500">
                      <span>{t.checkout.shipping}</span>
                      <span className="text-neutral-900 font-medium">
                        {shippingFeeUSD === 0 ? t.checkout.free : formatPrice(shippingFeeUSD)}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm font-semibold text-neutral-900">
                      <span className="tracking-wider uppercase">{t.checkout.total}</span>
                      <span className="text-base font-bold text-neutral-950">
                        {formatPrice(grandTotalUSD)}
                      </span>
                    </div>

                    <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-400 tracking-wider uppercase text-center">
                      <ShieldCheck size={13} className="text-neutral-600 flex-shrink-0" />
                      <span>{t.checkout.sslNotice}</span>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT METHOD (BARIDIMOB, CCP, CIB/EDAHABIA, COD) */}
            {step === 'payment' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left side: Payment Methods */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-950 font-medium uppercase tracking-wider cursor-pointer"
                    >
                      <ArrowLeft size={14} /> {t.checkout.backToDelivery}
                    </button>
                    <span className="text-[11px] text-neutral-400 tracking-widest uppercase">
                      {t.checkout.step2of2}
                    </span>
                  </div>

                  {/* Payment method selection buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* 1. BaridiMob */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('baridimob')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'baridimob'
                          ? 'border-emerald-600 bg-emerald-950 text-white shadow-md'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <Smartphone size={20} className={paymentMethod === 'baridimob' ? 'text-amber-400' : 'text-emerald-700'} />
                      <span className="text-[11px] tracking-wider uppercase font-bold">
                        BaridiMob
                      </span>
                    </button>

                    {/* 2. CCP */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ccp')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'ccp'
                          ? 'border-amber-600 bg-neutral-900 text-white shadow-md'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span className={`text-xs font-black tracking-widest px-2 py-0.5 rounded ${
                        paymentMethod === 'ccp' ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-200 text-neutral-900'
                      }`}>
                        CCP
                      </span>
                      <span className="text-[11px] tracking-wider uppercase font-bold">
                        Virement CCP
                      </span>
                    </button>

                    {/* 3. Carte CIB / Edahabia */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cib_edahabia')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'cib_edahabia'
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <CreditCard size={20} className={paymentMethod === 'cib_edahabia' ? 'text-amber-400' : 'text-neutral-700'} />
                      <span className="text-[10px] tracking-wider uppercase font-bold">
                        CIB / Edahabia
                      </span>
                    </button>

                    {/* 4. Cash on Delivery */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <Banknote size={20} className={paymentMethod === 'cod' ? 'text-emerald-400' : 'text-neutral-700'} />
                      <span className="text-[10px] tracking-wider uppercase font-bold">
                        À la Livraison
                      </span>
                    </button>
                  </div>

                  {/* 1. BaridiMob Details Screen */}
                  {paymentMethod === 'baridimob' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 via-neutral-50 to-amber-50/40 border border-emerald-200/80 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                            {t.checkout.baridimobTitle}
                          </h4>
                        </div>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                          Instantané 24/7
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 font-light leading-relaxed">
                        {t.checkout.baridimobDesc}
                      </p>

                      {/* Official RIP display box with Copy button */}
                      <div className="p-3.5 bg-white rounded-lg border border-emerald-300 shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                            {t.checkout.baridimobRip}
                          </p>
                          <p className="text-sm font-mono font-bold text-neutral-900 tracking-wider">
                            {officialRip}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            SARL MAISON E-COMMERCE HAUTE COUTURE
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(officialRip.replace(/\s/g, ''), 'rip')}
                          className="px-3 py-1.5 bg-emerald-800 text-white rounded text-xs font-medium hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {copiedRip ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedRip ? 'Copié !' : 'Copier RIP'}</span>
                        </button>
                      </div>

                      {/* Transaction reference input */}
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                          {t.checkout.baridimobTrxLabel}
                        </label>
                        <input
                          type="text"
                          value={baridimobTrx}
                          onChange={(e) => setBaridimobTrx(e.target.value.toUpperCase())}
                          placeholder="TRX-882190 ou N° d'opération"
                          className="w-full text-xs bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 font-mono uppercase tracking-wider focus:border-neutral-900 focus:outline-none"
                        />
                        <p className="text-[10px] text-neutral-500 mt-1 font-light">
                          {t.checkout.baridimobHelp}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* 2. CCP Details Screen */}
                  {paymentMethod === 'ccp' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl bg-gradient-to-br from-amber-50/60 via-neutral-50 to-neutral-50 border border-amber-200/80 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                            {t.checkout.ccpTitle}
                          </h4>
                        </div>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          Algérie Poste
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 font-light leading-relaxed">
                        {t.checkout.ccpDesc}
                      </p>

                      {/* CCP coordinates display */}
                      <div className="p-3.5 bg-white rounded-lg border border-amber-300 shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                            {t.checkout.ccpNumber}
                          </p>
                          <p className="text-base font-mono font-bold text-neutral-900 tracking-wider">
                            {officialCcp} <span className="text-xs text-neutral-500">Clé:</span> {officialCcpKey}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            {t.checkout.ccpAccountName} MAISON LUXE COUTURE
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(`${officialCcp} cle ${officialCcpKey}`, 'ccp')}
                          className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {copiedCcp ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedCcp ? 'Copié !' : 'Copier CCP'}</span>
                        </button>
                      </div>

                      {/* Receipt number input */}
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                          {t.checkout.ccpReceiptLabel}
                        </label>
                        <input
                          type="text"
                          value={ccpReceipt}
                          onChange={(e) => setCcpReceipt(e.target.value.toUpperCase())}
                          placeholder="Ex: CCP-REC-94821 ou Référence reçu"
                          className="w-full text-xs bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 font-mono uppercase tracking-wider focus:border-neutral-900 focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* 3. Carte CIB / Edahabia / Carte Bancaire */}
                  {paymentMethod === 'cib_edahabia' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 py-2 border-b border-neutral-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          {t.checkout.cibTitle}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          (CIB • EDAHABIA • VISA • MASTERCARD)
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                          {t.checkout.cardHolder}
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="NOM ET PRÉNOM DU TITULAIRE"
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 uppercase tracking-wider focus:border-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                          {t.checkout.cardNumber}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => formatCardInput(e.target.value)}
                            placeholder="6280 0000 0000 0000"
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 tracking-widest focus:border-neutral-900 focus:outline-none font-mono"
                          />
                          <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            {t.checkout.expiry}
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={expiry}
                            onChange={(e) => formatExpiryInput(e.target.value)}
                            placeholder="08/28"
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 tracking-wider focus:border-neutral-900 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            {t.checkout.cvv}
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            placeholder="•••"
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md px-3.5 py-2.5 tracking-widest focus:border-neutral-900 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 4. Cash on Delivery (COD) */}
                  {paymentMethod === 'cod' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 text-center bg-neutral-50 rounded-xl border border-neutral-200 space-y-3"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                        <Banknote size={26} />
                      </div>
                      <h4 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
                        {t.checkout.codTitle}
                      </h4>
                      <p className="text-xs text-neutral-600 max-w-sm mx-auto font-light leading-relaxed">
                        {t.checkout.codDesc}
                      </p>
                      <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded text-[11px] font-medium">
                        Total à régler à l'arrivée : {formatPrice(grandTotalUSD)}
                      </span>
                    </motion.div>
                  )}

                  {/* Big Checkout Confirmation Button */}
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    className="w-full py-4 bg-neutral-900 text-white text-xs font-semibold tracking-[0.25em] uppercase hover:bg-black transition-colors rounded-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock size={15} />
                    <span>{t.checkout.payBtn} — {formatPrice(grandTotalUSD)}</span>
                  </button>
                </div>

                {/* Right side: Virtual Luxury Card Preview & Summary */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Virtual Card Preview (Gold CIB / Edahabia / Maison) */}
                  <div className="relative aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950 text-white p-6 shadow-2xl flex flex-col justify-between overflow-hidden border border-amber-500/30">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-amber-400/25 via-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-xs tracking-[0.3em] uppercase font-light text-neutral-300">
                        MAISON PRIVILÈGE
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-neutral-950">
                          EDAHABIA
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-white border border-neutral-600">
                          CIB
                        </span>
                      </div>
                    </div>

                    <div className="my-2 relative z-10">
                      {/* Gold Chip representation */}
                      <div className="w-10 h-7 rounded bg-gradient-to-tr from-amber-200 to-amber-400 shadow-inner mb-3 flex items-center justify-center opacity-95">
                        <div className="w-6 h-3.5 border border-amber-900/30 rounded-xs" />
                      </div>

                      <p className="text-base sm:text-lg tracking-[0.22em] font-mono text-neutral-100">
                        {paymentMethod === 'baridimob'
                          ? 'BARIDI • MOB • RIP • 007'
                          : paymentMethod === 'ccp'
                          ? 'CCP • 21345678 • CLÉ 45'
                          : cardNumber || '•••• •••• •••• ••••'}
                      </p>
                    </div>

                    <div className="flex items-end justify-between relative z-10 text-[11px] tracking-wider">
                      <div>
                        <p className="text-[9px] uppercase text-neutral-400">Titulaire</p>
                        <p className="font-medium text-neutral-100 truncate max-w-[170px]">
                          {cardHolder || name || 'CLIENT MAISON'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase text-neutral-400">Expiration</p>
                        <p className="font-mono text-neutral-100">{expiry || '08/28'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Recap Box */}
                  <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 text-xs space-y-2.5">
                    <div className="flex justify-between text-neutral-600">
                      <span>Destinataire :</span>
                      <span className="font-medium text-neutral-900">{name}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Téléphone SMS :</span>
                      <span className="font-medium text-neutral-900">{phone}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Destination :</span>
                      <span className="font-medium text-neutral-900">{city}, {country}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Mode sélectionné :</span>
                      <span className="font-bold text-neutral-900">
                        {paymentMethod === 'baridimob'
                          ? 'BaridiMob (RIP Direct)'
                          : paymentMethod === 'ccp'
                          ? 'CCP Postal'
                          : paymentMethod === 'cib_edahabia'
                          ? 'Carte CIB / Edahabia'
                          : 'Paiement à la Livraison'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-950 text-sm">
                      <span>Montant total :</span>
                      <span>{formatPrice(grandTotalUSD)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PROCESSING STATE */}
            {step === 'processing' && (
              <div className="py-20 text-center space-y-6 max-w-md mx-auto">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-25" />
                  <div className="w-20 h-20 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin flex items-center justify-center">
                    <Sparkles size={24} className="text-amber-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-light tracking-[0.25em] uppercase text-neutral-900 font-medium">
                    {t.checkout.processingTitle}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light">
                    {t.checkout.processingDesc}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION RECEIPT */}
            {step === 'success' && completedOrder && (
              <div className="space-y-8 max-w-2xl mx-auto py-4">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={36} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-neutral-900">
                    {t.checkout.successTitle}
                  </h2>
                  <p className="text-xs text-neutral-500 tracking-wider">
                    {t.checkout.successSub}
                  </p>
                </div>

                {/* Printable Receipt Box */}
                <div className="bg-[#FAF9F6] p-6 md:p-8 rounded-xl border border-neutral-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200 text-xs">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                        {t.checkout.orderRef}
                      </p>
                      <p className="font-mono font-bold text-neutral-900 text-sm">
                        {completedOrder.orderNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                        {t.checkout.dateTime}
                      </p>
                      <p className="text-neutral-700">{completedOrder.date}</p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
                      {t.checkout.purchasedPieces}
                    </p>
                    {completedOrder.items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-12 object-cover rounded bg-white shadow-xs"
                          />
                          <div>
                            <p className="font-medium text-neutral-900">
                              {language === 'fr' && item.product.nameFr ? item.product.nameFr : item.product.name}
                            </p>
                            <p className="text-[10px] text-neutral-500">
                              {item.selectedColor} • {item.selectedSize} (x{item.quantity})
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-neutral-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Recap */}
                  <div className="pt-4 border-t border-neutral-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-500">
                      <span>{t.checkout.subtotal}</span>
                      <span>{formatPrice(completedOrder.subtotal)}</span>
                    </div>
                    {completedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>{t.checkout.discount}</span>
                        <span>-{formatPrice(completedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-500">
                      <span>{t.checkout.shipping}</span>
                      <span>{completedOrder.shipping === 0 ? t.checkout.free : formatPrice(completedOrder.shipping)}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-950 text-base">
                      <span>{t.checkout.paidTotal}</span>
                      <span>{formatPrice(completedOrder.total)}</span>
                    </div>
                  </div>

                  {/* Shipping & Payment Details */}
                  <div className="p-4 bg-white rounded-lg border border-neutral-200/70 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">{t.checkout.trackingCode}</span>
                      <span className="font-mono font-bold text-neutral-900">
                        {completedOrder.trackingNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">{t.checkout.destination}</span>
                      <span className="text-neutral-900 font-medium">
                        {completedOrder.shippingAddress}, {completedOrder.shippingCity}, {completedOrder.shippingCountry}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">{t.checkout.paymentModeUsed}</span>
                      <span className="text-neutral-900 font-semibold">
                        {completedOrder.paymentMethod}
                      </span>
                    </div>
                    {completedOrder.transactionRef && (
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                        <span className="text-neutral-500">Réf. Transaction :</span>
                        <span className="font-mono text-neutral-900 font-semibold">
                          {completedOrder.transactionRef}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-1/2 py-3 border border-neutral-300 text-neutral-800 text-xs font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>{t.checkout.downloadReceipt}</span>
                  </button>

                  <button
                    onClick={handleFinish}
                    className="w-full sm:w-1/2 py-3 bg-neutral-900 text-white text-xs font-medium tracking-[0.25em] uppercase rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>{t.checkout.returnShowroom}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutModal;
