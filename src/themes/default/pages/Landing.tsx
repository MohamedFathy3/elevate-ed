// src/components/LoadingBook.tsx

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingBookProps {
  message?: {
    ar: string;
    en: string;
  };
  lang?: 'ar' | 'en';
  minDisplayTime?: number;
  onLoad?: () => void;
}

export const Loading: React.FC<LoadingBookProps> = ({ 
  message = { ar: 'جاري التحميل...', en: 'Loading...' },
  lang = 'ar',
  minDisplayTime = 800,
  onLoad
}) => {
  const isRTL = lang === 'ar';
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', resolve);
        }
      });

      await new Promise((resolve) => setTimeout(resolve, minDisplayTime));
      
      setIsLoaded(true);
      
      setTimeout(() => {
        setIsVisible(false);
        if (onLoad) onLoad();
      }, 300);
    };  

    loadResources();
  }, [minDisplayTime, onLoad]);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        >
          <div className="relative">
            {/* ✅ ظل القلم الدائري */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-black/10 dark:bg-white/10 rounded-full blur-md"
            />

            {/* ✅ قلم بيلف في دائرة */}
            <div className="relative w-32 h-32">
              {/* المسار الدائري الخلفي */}
              <div className="absolute inset-0 rounded-full border-4 border-amber-200/30 dark:border-amber-700/30" />
              
              {/* المسار الدائري المتقدم */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent"
                style={{
                  borderTopColor: '#d97706',
                  borderRightColor: '#d97706',
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* القلم في المنتصف */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative">
                  {/* جسم القلم */}
                  <div className="w-2.5 h-20 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 rounded-full shadow-lg transform -rotate-45 origin-bottom">
                    {/* طرف القلم المعدني */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2.5 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-full">
                      <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1.5 bg-gray-700 rounded-t-full" />
                    </div>
                    {/* غطاء القلم */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-amber-800 rounded-b-full">
                      <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-amber-600 rounded-full" />
                    </div>
                    {/* شريط زخرفي */}
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-amber-400/50 rounded-full" />
                    <div className="absolute top-6.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-amber-400/50 rounded-full" />
                  </div>
                  
                  {/* ✅ وهج القلم */}
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400/20 rounded-full blur-xl"
                  />
                </div>
              </motion.div>

              {/* جزيئات متطايرة */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: [0, Math.cos(i * (Math.PI * 2) / 8) * 50],
                    y: [0, Math.sin(i * (Math.PI * 2) / 8) * 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 1,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-400 rounded-full"
                  style={{
                    transform: `translate(-50%, -50%)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ✅ النص */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 text-center"
          >
            <p className={`text-lg font-medium text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
              {message[lang]}
            </p>
            <motion.div
              animate={{ 
                width: [0, 60, 0],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mx-auto mt-3"
              style={{ width: 60 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;