import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, Globe, Mail, Compass, Sparkles, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const language = useStore((s) => s.language);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const toggleSearch = useStore((s) => s.toggleSearch);
  const toggleAccount = useStore((s) => s.toggleAccount);
  const openCheckout = useStore((s) => s.openCheckout);

  const t = translations[language].footer;

  const linkGroups = language === 'fr'
    ? [
        {
          title: 'BOUTIQUE E-COMMERCE',
          items: [
            { label: 'Toutes les Créations', action: () => setActiveTab('collection') },
            { label: 'Défilé & Lookbook', action: () => setActiveTab('lookbook') },
            { label: 'Recherche Rapide', action: () => toggleSearch() },
            { label: 'Panier & Commande', action: () => openCheckout() },
          ],
        },
        {
          title: 'PAIEMENT & LIVRAISON',
          items: [
            { label: 'BaridiMob (RIP Direct)', action: () => {} },
            { label: 'Compte Courant Postal (CCP)', action: () => {} },
            { label: 'Cartes CIB & Edahabia', action: () => {} },
            { label: 'Livraison 58 Wilayas & Monde', action: () => {} },
          ],
        },
        {
          title: 'SERVICE CLIENT VIP',
          items: [
            { label: 'Suivi de Colis en Temps Réel', action: () => toggleAccount() },
            { label: 'Espace Membre Privilège', action: () => toggleAccount() },
            { label: 'Conseil Taille WhatsApp 7j/7', action: () => alert('Contactez notre conciergerie WhatsApp au +213 550 12 34 56') },
            { label: 'Retours & Échanges 14 Jours', action: () => {} },
          ],
        },
        {
          title: 'LA MAISON',
          items: [
            { label: 'Concept 100% Digital', action: () => setActiveTab('about') },
            { label: 'Artisanat & Matières Nobles', action: () => setActiveTab('about') },
            { label: 'Certificat d’Authenticité', action: () => setActiveTab('about') },
            { label: 'Mentions Légales & Confidentialité', action: () => {} },
          ],
        },
      ]
    : [
        {
          title: 'ONLINE BOUTIQUE',
          items: [
            { label: 'All Collections', action: () => setActiveTab('collection') },
            { label: 'Runway & Lookbook', action: () => setActiveTab('lookbook') },
            { label: 'Catalog Search', action: () => toggleSearch() },
            { label: 'Bag & Checkout', action: () => openCheckout() },
          ],
        },
        {
          title: 'PAYMENT & SHIPPING',
          items: [
            { label: 'BaridiMob (Instant Transfer)', action: () => {} },
            { label: 'Postal CCP Account', action: () => {} },
            { label: 'CIB & Edahabia Cards', action: () => {} },
            { label: 'Express Delivery Worldwide', action: () => {} },
          ],
        },
        {
          title: 'VIP CLIENT SUPPORT',
          items: [
            { label: 'Real-Time Order Tracking', action: () => toggleAccount() },
            { label: 'VIP Privilège Portal', action: () => toggleAccount() },
            { label: 'WhatsApp Sizing Concierge', action: () => alert('Contact our VIP WhatsApp concierge: +213 550 12 34 56') },
            { label: '14-Day Free Returns', action: () => {} },
          ],
        },
        {
          title: 'THE MAISON',
          items: [
            { label: '100% Digital Luxury Concept', action: () => setActiveTab('about') },
            { label: 'Artisanal Mills & Fabrics', action: () => setActiveTab('about') },
            { label: 'Numbered Certificate of Origin', action: () => setActiveTab('about') },
            { label: 'Privacy & Terms of Service', action: () => {} },
          ],
        },
      ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={containerVariants}
      className="bg-[#111111] text-neutral-300 border-t border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-8 py-20">
        {/* Top: Brand + Newsletter */}
        <div className="mb-16 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-amber-400 font-semibold">
                100% E-COMMERCE HAUTE COUTURE
              </span>
            </div>
            <h2 className="text-4xl font-light tracking-[0.35em] text-white md:text-5xl uppercase">
              MAISON
            </h2>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-neutral-400 font-light">
              {t.aboutText}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-sm">
            <p className="mb-3 text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-medium">
              {t.newsletterTitle}
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletterPlaceholder}
                className="flex-1 border-b border-neutral-700 bg-transparent py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors focus:border-white"
              />
              <motion.button
                type="submit"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.9 }}
                className="ml-3 text-neutral-400 transition-colors hover:text-white cursor-pointer"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </motion.button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-emerald-400 font-medium"
              >
                {t.newsletterSuccess}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Link Grid */}
        <motion.div
          variants={itemVariants}
          className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-[10px] font-semibold tracking-[0.25em] uppercase text-white">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={item.action}
                      className="text-xs text-neutral-400 transition-colors hover:text-white font-light text-left cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* E-Commerce Payment & Delivery Banner */}
        <div className="mb-8 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-amber-400" />
            <span>{t.paymentBadges}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-emerald-400" />
            <span>{t.deliveryBadges}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px bg-neutral-800" />

        {/* Bottom: Social + Copyright */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>SSL 256-Bit Encrypted E-Commerce</span>
          </div>

          {/* Copyright */}
          <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 text-center sm:text-right">
            {t.allRights}
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
