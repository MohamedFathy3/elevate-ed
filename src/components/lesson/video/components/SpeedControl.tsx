// src/components/lesson/video/components/SpeedControl.tsx

import { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { SpeedControlProps } from '../VideoPlayer.types';
import { PLAYBACK_SPEEDS } from '../VideoPlayer.utils';

export const SpeedControl = ({ speed, onSpeedChange, onClose, lang }: SpeedControlProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-16 right-0 bg-black/95 backdrop-blur-xl rounded-xl p-2 min-w-[150px] z-[100] border border-white/10 shadow-2xl max-h-[300px] overflow-y-auto"
    >
      {PLAYBACK_SPEEDS.map((s) => (
        <button
          key={s}
          onClick={() => { onSpeedChange(s); onClose(); }}
          onTouchEnd={() => { onSpeedChange(s); onClose(); }}
          className={`w-full px-4 py-3 text-sm text-right rounded-lg transition-all flex items-center justify-between touch-manipulation
            ${speed === s ? 'bg-blue-500/30 text-white' : 'text-gray-300 hover:bg-white/10 active:bg-white/20'}`}
        >
          <span>{s}x</span>
          {speed === s && <Check className="w-4 h-4 text-blue-400" />}
        </button>
      ))}
    </div>
  );
};