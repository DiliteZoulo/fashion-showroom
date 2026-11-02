import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import ModelShowroom from './components/ModelShowroom';
import EditorialBanner from './components/EditorialBanner';
import FeaturedSection from './components/FeaturedSection';
import CollectionCatalog from './components/CollectionCatalog';
import LookbookView from './components/LookbookView';
import AboutView from './components/AboutView';
import Footer from './components/Footer';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import CheckoutModal from './components/CheckoutModal';
import SearchModal from './components/SearchModal';
import AccountModal from './components/AccountModal';
import useStore from './store/useStore';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const activeTab = useStore((s) => s.activeTab);
  const selectedModelId = useStore((s) => s.selectedModelId);
  const selectedProductId = useStore((s) => s.selectedProductId);
  const isCartOpen = useStore((s) => s.isCartOpen);
  const isCheckoutOpen = useStore((s) => s.isCheckoutOpen);
  const isSearchOpen = useStore((s) => s.isSearchOpen);
  const isAccountOpen = useStore((s) => s.isAccountOpen);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 flex flex-col font-sans">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="loading"
            isLoading={isLoading}
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navbar />

          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <div key="home-view">
                  <AnimatePresence mode="wait">
                    {selectedModelId ? (
                      <ModelShowroom key="showroom" />
                    ) : (
                      <HeroSection key="hero" />
                    )}
                  </AnimatePresence>

                  {!selectedModelId && (
                    <>
                      <EditorialBanner />
                      <FeaturedSection />
                    </>
                  )}
                </div>
              )}

              {activeTab === 'collection' && (
                <CollectionCatalog key="collection-view" />
              )}

              {activeTab === 'lookbook' && (
                <LookbookView key="lookbook-view" />
              )}

              {activeTab === 'about' && (
                <AboutView key="about-view" />
              )}
            </AnimatePresence>
          </main>

          <Footer />

          {/* Product Detail Modal */}
          <AnimatePresence>
            {selectedProductId && <ProductDetail key="product-detail" />}
          </AnimatePresence>

          {/* Cart Drawer */}
          <AnimatePresence>
            {isCartOpen && <Cart key="cart" />}
          </AnimatePresence>

          {/* Checkout & Payment Modal */}
          <AnimatePresence>
            {isCheckoutOpen && <CheckoutModal key="checkout-modal" />}
          </AnimatePresence>

          {/* Live Search Modal */}
          <AnimatePresence>
            {isSearchOpen && <SearchModal key="search-modal" />}
          </AnimatePresence>

          {/* VIP Client Account Modal */}
          <AnimatePresence>
            {isAccountOpen && <AccountModal key="account-modal" />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default App;
