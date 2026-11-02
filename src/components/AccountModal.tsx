import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Crown, Package, Clock, ShieldCheck, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { translations } from '../i18n/translations';

const AccountModal: React.FC = () => {
  const isAccountOpen = useStore((s) => s.isAccountOpen);
  const toggleAccount = useStore((s) => s.toggleAccount);
  const lastOrder = useStore((s) => s.lastOrder);
  const formatPrice = useStore((s) => s.formatPrice);
  const language = useStore((s) => s.language);

  const t = translations[language].account;

  const [trackingInput, setTrackingInput] = useState('');
  const [trackedStatus, setTrackedStatus] = useState<string | null>(null);

  if (!isAccountOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setTrackedStatus(t.trackInTransit);
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleAccount}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="min-h-full flex items-center justify-center p-4 md:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5 bg-neutral-50/60">
            <div className="flex items-center gap-2.5">
              <Crown size={16} className="text-amber-500" />
              <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-900">
                {t.title}
              </h2>
            </div>
            <button
              onClick={toggleAccount}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* VIP Status Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                    {t.membershipTier}
                  </span>
                  <h3 className="text-lg font-light tracking-[0.2em] uppercase text-white mt-0.5">
                    Karim Amrani
                  </h3>
                </div>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full border border-amber-400/30">
                  {t.blackCard}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-700/60 flex items-center justify-between text-[11px] text-neutral-300">
                <span>{language === 'fr' ? 'Livraison 58 Wilayas : Incluse' : 'Nationwide Courier: Included'}</span>
                <span>Loyalty Points: 4,850 pts</span>
              </div>
            </div>

            {/* VIP Privileges */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium mb-3">
                {t.privilegesTitle}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {t.privileges.map((privilege, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 flex items-center gap-2.5"
                  >
                    <Sparkles size={14} className="text-amber-500 flex-shrink-0" />
                    <span className="text-neutral-700">{privilege}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Track Order Section */}
            <div className="pt-2">
              <h4 className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium mb-3">
                {t.trackTitle}
              </h4>
              <form onSubmit={handleTrack} className="flex gap-2">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder={t.trackPlaceholder}
                  className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-neutral-900 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium tracking-wider uppercase rounded hover:bg-black transition-colors cursor-pointer"
                >
                  {t.trackBtn}
                </button>
              </form>

              {trackedStatus && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-start gap-2">
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                  <p>{trackedStatus}</p>
                </div>
              )}
            </div>

            {/* Recent Order if placed */}
            {lastOrder && (
              <div className="pt-2">
                <h4 className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium mb-3">
                  {t.lastOrderTitle}
                </h4>
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-neutral-900">
                      {lastOrder.orderNumber}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-medium">
                      {t.confirmed}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    {lastOrder.items.length} {language === 'fr' ? 'pièce(s)' : 'item(s)'} • Total : {formatPrice(lastOrder.total)}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Suivi : {lastOrder.trackingNumber} ({lastOrder.paymentMethod})
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountModal;
