// src/components/LoadingBook.tsx

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingBookProps {
  message?: {
    ar: string;
    en: string;
  };
  lang?: 'ar' | 'en';
  minDisplayTime?: number; // أقل مدة للظهور
  onLoad?: () => void; // دالة عند الانتهاء من التحميل
}

export const Loading: React.FC<LoadingBookProps> = ({ 
  message = { ar: 'جاري التحميل...', en: 'Loading...' },
  lang = 'ar',
  minDisplayTime = 800, // 0.8 ثانية كحد أدنى
  onLoad
}) => {
  const isRTL = lang === 'ar';
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // ✅ محاكاة تحميل الموارد
    const loadResources = async () => {
      // ننتظر حتى يتم تحميل الصفحة بالكامل
      await new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', resolve);
        }
      });

      // ✅ ننتظر أقل مدة للعرض
      await new Promise((resolve) => setTimeout(resolve, minDisplayTime));
      
      setIsLoaded(true);
      
      // ✅ إخفاء الـ Loading بعد تحميل كل شيء
      setTimeout(() => {
        setIsVisible(false);
        if (onLoad) onLoad();
      }, 300); // 0.3 ثانية للأنيميشن
    };

    loadResources();
  }, [minDisplayTime, onLoad]);

  // ✅ إذا اختفى المكون، نرجع null
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
            {/* ✅ ظل الكتاب */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black/10 dark:bg-white/10 rounded-full blur-md"
            />

            {/* ✅ الكتاب اللي بيقلب */}
            <div className="relative w-40 h-52 perspective-1000">
              {/* الغلاف الخلفي */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-800 rounded-lg shadow-xl" />
              
              {/* الصفحات الداخلية */}
              <motion.div
                animate={{
                  rotateY: [0, -180, -360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute inset-0 origin-left"
              >
                {/* الصفحة الأمامية */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-lg flex flex-col items-center justify-center p-3"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-8 h-8 border-2 border-amber-600 rounded-full flex items-center justify-center mb-2">
                    <div className="w-4 h-4 bg-amber-600 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="h-1.5 bg-amber-300 rounded-full w-3/4 mx-auto" />
                    <div className="h-1.5 bg-amber-300 rounded-full w-1/2 mx-auto" />
                    <div className="h-1.5 bg-amber-300 rounded-full w-2/3 mx-auto" />
                  </div>
                </div>
                
                {/* الصفحة الخلفية */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-lg flex flex-col items-center justify-center p-3"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <svg className="w-8 h-8 text-amber-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div className="space-y-1 w-full">
                    <div className="h-1.5 bg-amber-300 rounded-full w-3/4 mx-auto" />
                    <div className="h-1.5 bg-amber-300 rounded-full w-1/2 mx-auto" />
                  </div>
                </div>
              </motion.div>

              {/* الغلاف الأمامي */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg shadow-xl flex items-center justify-center border border-amber-500/30">
                <svg className="w-12 h-12 text-amber-200/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            {/* ✅ جزيئات متطايرة - أقل عدداً وأكثر أناقة */}
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
                  x: [0, (Math.random() - 0.5) * 80],
                  y: [0, (Math.random() - 0.5) * 80 - 40],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 1,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-400 rounded-full"
                style={{
                  transform: `translate(-50%, -50%)`,
                }}
              />
            ))}
          </div>

          {/* ✅ النص */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <p className={`text-lg font-medium text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
              {message[lang]}
            </p>
            <motion.div
              animate={{ width: [0, 60, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
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