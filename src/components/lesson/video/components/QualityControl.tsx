// src/components/lesson/video/components/QualityControl.tsx

import { useState, useRef, useEffect } from 'react';
import { Settings, Check } from 'lucide-react';
import { QualityControlProps } from '../VideoPlayer.types';

export const QualityControl = ({ 
  currentQuality, 
  onQualityChange, 
  availableQualities, 
  lang 
}: QualityControlProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // ✅ مسجّل بس وهو مفتوح، وبعد الحدث اللي فتحه خلص (يمنع الإغلاق الفوري)
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const getQualityLabel = (value: string) => {
    if (value === 'auto') return lang === 'ar' ? 'تلقائي' : 'Auto';
    const quality = availableQualities.find(q => q.value === value);
    return quality ? quality.label : value;
  };

  const sortedQualities = [...availableQualities].sort((a, b) => b.height - a.height);

  return (
    <div className="relative">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-all flex items-center gap-1.5 min-h-[44px] min-w-[44px] touch-manipulation"
        title={lang === "ar" ? "جودة الفيديو" : "Video quality"}
      >
        <Settings className="w-4 h-4" />
        <span className="text-xs font-medium hidden sm:inline">{getQualityLabel(currentQuality)}</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className="video-dropdown-menu absolute bottom-full mb-2 right-0 bg-black/95 backdrop-blur-xl rounded-xl p-2 min-w-[170px] max-w-[calc(100vw-2rem)] z-[100] border border-white/10 shadow-2xl max-h-[300px] overflow-y-auto"
        >
          <div className="px-3 py-1.5 text-xs text-gray-400 font-medium border-b border-white/5 mb-1 sticky top-0 bg-black/95">
            {lang === "ar" ? "جودة الفيديو" : "Video Quality"}
          </div>
          
          <button
            type="button"
            onClick={() => { onQualityChange('auto'); setIsOpen(false); }}
            className={`w-full px-3 py-3 text-sm text-right rounded-lg transition-all flex items-center justify-between gap-3 touch-manipulation
              ${currentQuality === 'auto' 
                ? 'bg-blue-500/30 text-white' 
                : 'text-gray-300 hover:bg-white/10 active:bg-white/20'}`}
          >
            <span>{lang === 'ar' ? '🔄 تلقائي' : '🔄 Auto'}</span>
            {currentQuality === 'auto' && <Check className="w-4 h-4 text-blue-400" />}
          </button>

          {sortedQualities.map((quality) => (
            <button
              type="button"
              key={quality.value}
              onClick={() => { onQualityChange(quality.value); setIsOpen(false); }}
              className={`w-full px-3 py-3 text-sm text-right rounded-lg transition-all flex items-center justify-between gap-3 touch-manipulation
                ${currentQuality === quality.value 
                  ? 'bg-blue-500/30 text-white' 
                  : 'text-gray-300 hover:bg-white/10 active:bg-white/20'}`}
            >
              <span>{quality.label}</span>
              {currentQuality === quality.value && <Check className="w-4 h-4 text-blue-400" />}
            </button>
          ))}

          <div className="px-3 py-1.5 mt-1 text-[10px] text-gray-500 border-t border-white/5">
            {lang === "ar" ? "يعتمد على سرعة الإنترنت" : "Depends on internet speed"}
          </div>
        </div>
      )}
    </div>
  );
};