// src/components/Loading.tsx

import React, { useEffect, useState } from 'react';

interface LoadingProps {
  message?: {
    ar: string;
    en: string;
  };
  lang?: 'ar' | 'en';
  minDisplayTime?: number;
  onLoad?: () => void;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = { ar: 'جاري التحميل...', en: 'Loading...' },
  lang = 'ar',
  minDisplayTime = 800,
  onLoad
}) => {
  const isRTL = lang === 'ar';
  const [isVisible, setIsVisible] = useState(true);

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
      
      setIsVisible(false);
      if (onLoad) onLoad();
    };  

    loadResources();
  }, [minDisplayTime, onLoad]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative">
        {/* ✅ Spinner (قلم بيعمل دوران) */}
        <div className="relative w-20 h-20">
          {/* المسار الدائري الخلفي */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-200/30 dark:border-amber-700/30" />
          
          {/* المسار الدائري المتقدم (اللي بيلف) */}
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: '#d97706',
              borderRightColor: '#d97706',
              animation: 'spin 1s linear infinite',
            }}
          />

          {/* القلم في المنتصف */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: 'spin 3s linear infinite',
            }}
          >
            <div className="relative">
              {/* جسم القلم */}
              <div className="w-2 h-14 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 rounded-full shadow-lg transform -rotate-45 origin-bottom">
                {/* طرف القلم المعدني */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-2 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-full">
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-gray-700 rounded-t-full" />
                </div>
                {/* غطاء القلم */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2.5 h-3 bg-amber-800 rounded-b-full">
                  <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-amber-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ النص */}
        <div className="mt-6 text-center">
          <p className={`text-sm font-medium text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
            {message[lang]}
          </p>
          <div 
            className="h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mx-auto mt-2"
            style={{
              width: 60,
              animation: 'pulseWidth 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ✅ إضافة الـ keyframes في نفس المكون */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulseWidth {
          0%, 100% { width: 0px; opacity: 0.3; }
          50% { width: 60px; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loading;