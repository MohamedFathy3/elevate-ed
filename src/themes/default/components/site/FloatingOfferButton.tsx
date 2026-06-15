// src/themes/default/components/site/FloatingOfferButton.tsx

import React, { useState } from 'react';
import { Gift, Percent, Sparkles } from 'lucide-react';
import { OfferPopup } from './OfferPopup';
import { useLang } from '@/i18n/LanguageContext';
import { useSafeTeacher } from '@/context/TeacherContext';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingOfferButton: React.FC = () => {
  const { lang } = useLang();
  const { teacher } = useSafeTeacher();
  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Don't show button if no teacher
  if (!teacher?.id) return null;

  return (
    <>
      <motion.button
        onClick={() => setShowPopup(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-50 group"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* نبضات خلفية */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-50"
          />
          
          {/* الزر الرئيسي */}
          <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg shadow-orange-500/30">
            <Gift size={24} />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
            >
              %
            </motion.span>
          </div>
          
          {/* نص توضيحي */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute bottom-full right-0 mb-2"
              >
                <div className="bg-gray-900 text-white text-sm rounded-xl px-4 py-2 whitespace-nowrap shadow-xl flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-400" />
                  {lang === 'ar' ? 'عروض حصرية بخصم يصل إلى 50%!' : 'Exclusive offers up to 50% off!'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {showPopup && (
        <OfferPopup 
          lang={lang} 
          onClose={() => setShowPopup(false)} 
        />
      )}
    </>
  );
};