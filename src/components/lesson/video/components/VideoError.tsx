// src/components/lesson/video/components/VideoError.tsx

import { AlertCircle } from 'lucide-react';
import { VideoErrorProps } from '../VideoPlayer.types';

export const VideoError = ({ lang, onRetry }: VideoErrorProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
      <div className="text-center text-white p-6 max-w-md">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <p className="text-lg font-semibold mb-2 text-white">
          {lang === "ar" ? "عذراً، لا يمكن تحميل الفيديو" : "Sorry, cannot load video"}
        </p>
        <p className="text-sm text-gray-400 mb-4">
          {lang === "ar" 
            ? "الرجاء التأكد من اتصالك بالإنترنت أو حاول مرة أخرى"
            : "Please check your internet connection or try again"}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 active:bg-white/30 transition-all touch-manipulation"
        >
          {lang === "ar" ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    </div>
  );
};