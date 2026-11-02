import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, X, Globe } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';
import type { NavTab, Language } from '../types';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cart = useStore((s) => s.cart);
  const toggleCart = useStore((s) => s.toggleCart);
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const toggleSearch = useStore((s) => s.toggleSearch);
  const toggleAccount = useStore((s) => s.toggleAccount);
  const clearSelection = useStore((s) => s.clearSelection);
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);

  const t = translations[language];

  const navLinks: { label: string; tab: NavTab }[] = [
    { label: t.nav.collection, tab: 'collection' },
    { label: t.nav.lookbook, tab: 'lookbook' },
    { label: t.nav.about, tab: 'about' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    clearSelection();
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab('home');
    clearSelection();
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-500 ${
        scrolled ? 'shadow-[0_1px_20px_rgba(0,0,0,0.08)]' : ''
      }`}
    >
      <div className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 sm:px-8 lg:px-12 h-16 md:h-20">
          {/* Brand */}
          <a
            href="/"
            onClick={handleBrandClick}
            className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-neutral-900 select-none cursor-pointer flex items-center gap-2"
          >
            <span>MAISON</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mb-1" />
          </a>

          {/* Center links for desktop */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map(({ label, tab }) => {
              const isActive = activeTab === tab;
              return (
                <li key={tab}>
                  <button
                    onClick={() => handleTabClick(tab)}
                    onMouseEnter={() => setHoveredLink(tab)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`relative text-[13px] tracking-[0.18em] uppercase transition-colors duration-300 py-1 cursor-pointer font-medium ${
                      isActive ? 'text-neutral-950 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {label}
                    <motion.span
                      className="absolute bottom-0 left-0 h-[1.5px] bg-neutral-900"
                      initial={false}
                      animate={{
                        width: isActive || hoveredLink === tab ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right icons & Language Switcher */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Language Switcher Pill */}
            <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-100/70 p-0.5 text-[11px] font-semibold tracking-wider">
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  language === 'fr'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Passer en Français"
              >
                FR
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  language === 'en'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Currency Switcher Pill */}
            <div className="hidden sm:flex items-center rounded-full border border-neutral-200 bg-neutral-100/70 p-0.5 text-[10px] font-semibold tracking-wider">
              <button
                onClick={() => setCurrency('DZD')}
                className={`rounded-full px-2 py-0.5 transition-all ${
                  currency === 'DZD'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Dinar Algérien (DA)"
              >
                DA
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`rounded-full px-2 py-0.5 transition-all ${
                  currency === 'EUR'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Euro (€)"
              >
                EUR
              </button>
            </div>

            <button
              onClick={toggleSearch}
              className="text-neutral-600 hover:text-neutral-900 transition-colors duration-300 p-1 cursor-pointer"
              aria-label={t.nav.search}
              title={t.nav.search}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <button
              onClick={toggleAccount}
              className="text-neutral-600 hover:text-neutral-900 transition-colors duration-300 p-1 cursor-pointer"
              aria-label={t.nav.account}
              title={t.nav.account}
            >
              <User size={18} strokeWidth={1.5} />
            </button>

            <button
              onClick={toggleCart}
              className="relative text-neutral-600 hover:text-neutral-900 transition-colors duration-300 p-1 cursor-pointer"
              aria-label={t.nav.bag}
              title={t.nav.bag}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute -top-1.5 -right-2 bg-neutral-900 text-white text-[10px] font-medium w-4.5 h-4.5 flex items-center justify-center rounded-full leading-none"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-neutral-700 hover:text-neutral-950 p-1 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-neutral-200 px-6 py-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Langue / Language
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    language === 'fr' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Français
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    language === 'en' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Devise / Currency
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrency('DZD')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    currency === 'DZD' ? 'bg-amber-800 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Dinar (DA)
                </button>
                <button
                  onClick={() => setCurrency('EUR')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    currency === 'EUR' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Euro (€)
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleTabClick('home')}
                className={`text-left text-sm tracking-[0.2em] uppercase py-2 border-b border-neutral-100 ${
                  activeTab === 'home' ? 'font-bold text-neutral-950' : 'text-neutral-600'
                }`}
              >
                {t.nav.home}
              </button>
              {navLinks.map(({ label, tab }) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`text-left text-sm tracking-[0.2em] uppercase py-2 border-b border-neutral-100 ${
                    activeTab === tab ? 'font-bold text-neutral-950' : 'text-neutral-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs tracking-wider uppercase text-neutral-500">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleSearch();
                }}
                className="flex items-center gap-2 py-2"
              >
                <Search size={15} />
                <span>{t.nav.search}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleAccount();
                }}
                className="flex items-center gap-2 py-2"
              >
                <User size={15} />
                <span>{t.nav.account}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
