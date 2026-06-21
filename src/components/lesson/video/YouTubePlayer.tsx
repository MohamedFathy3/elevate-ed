// components/video/YouTubePlayer.tsx - يدعم YouTube و Vimeo
import { useState } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';

interface YouTubePlayerProps {
  videoUrl: string;
  title: string;
  onError: () => void;
  poster?: string;
}

// ✅ دالة للحصول على رابط Embed من أي رابط (YouTube + Vimeo)
export const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // ✅ YouTube Watch URL
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // ✅ YouTube Shorts
  if (url.includes('youtube.com/shorts/')) {
    const videoId = url.split('shorts/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // ✅ youtu.be
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // ✅ Already embed
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // ✅ Vimeo - معالجة جميع أنواع روابط Vimeo
  if (url.includes('vimeo.com/')) {
    let videoId: string | null = null;
    
    // 🔥 رابط Vimeo العادي: https://vimeo.com/123456789
    const matchSimple = url.match(/vimeo\.com\/(\d+)/);
    if (matchSimple) {
      videoId = matchSimple[1];
    }
    
    // 🔥 رابط Vimeo مع shared: https://vimeo.com/1193597303/ed32e4e65c?share=copy
    if (!videoId) {
      // جلب أول رقم في الرابط
      const numbers = url.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        // أول رقم كبير (أكثر من 5 أرقام) غالباً هو ID الفيديو
        const bigNumbers = numbers.filter(n => n.length >= 6);
        if (bigNumbers.length > 0) {
          videoId = bigNumbers[0];
        } else {
          videoId = numbers[0];
        }
      }
    }
    
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}`;
    }
  }
  
  // ✅ Vimeo embed: https://player.vimeo.com/video/123456789
  if (url.includes('player.vimeo.com/video/')) {
    return url;
  }
  
  return null;
};

// ✅ التحقق من نوع الفيديو
export const isVideoSupported = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || 
         url.includes('youtu.be') || 
         url.includes('vimeo.com') ||
         url.includes('player.vimeo.com');
};

export const YouTubePlayer = ({ videoUrl, title, onError, poster }: YouTubePlayerProps) => {
  const { lang } = useLang();
  const [error, setError] = useState(false);
  const embedUrl = getEmbedUrl(videoUrl);

  // ✅ إذا كان الرابط مش مدعوم أو فيه خطأ
  if (!embedUrl || error) {
    return (
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card flex items-center justify-center">
        <div className="text-center text-white p-6 max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <p className="text-lg font-semibold mb-2 text-white">
            {error ? "عذراً، لا يمكن تحميل الفيديو" : "نوع الفيديو غير مدعوم"}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {lang === "ar" 
              ? "يمكنك مشاهدة الفيديو على المنصة الأصلية عبر الرابط أدناه"
              : "You can watch the video on the original platform via the link below"}
          </p>
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-semibold hover:scale-105 transition-all shadow-lg shadow-primary/25"
          >
            <ExternalLink className="w-4 h-4" />
            {lang === "ar" ? "فتح الفيديو" : "Open Video"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card">
      <iframe
        key={embedUrl}
        src={embedUrl}
        className="w-full h-full"
        title={title}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onError={() => {
          setError(true);
          onError();
        }}
      />
    </div>
  );
};