/* eslint-disable @typescript-eslint/no-explicit-any */
// components/video/VideoPlayer.tsx - النسخة النهائية
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useLang } from '@/i18n/LanguageContext';
import { VideoProtection } from './VideoProtection';
import { LocalVideoPlayer } from './LocalVideoPlayer';
import { VideoLocked } from './VideoLocked';
import { VideoError } from './VideoErrorBoundary';
import { ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  title?: string;
  poster?: string;
  isLocked?: boolean;
  requiredExam?: any;
  onStartExam?: () => void;
  parts?: any[];
  onPartChange?: (index: number) => void;
  selectedPartIndex?: number;
}

export interface VideoPlayerRef {
  pause: () => void;
  play: () => void;
  seekTo: (time: number) => void;
}

// ✅ الدالة اللي شغالة - مع دعم Vimeo
const getVideoUrl = (url: string) => {
  if (!url) return null;
  
  // ✅ YouTube Watch
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // ✅ youtu.be
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // ✅ YouTube Shorts
  if (url.includes('youtube.com/shorts/')) {
    const videoId = url.split('shorts/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // ✅ Vimeo - معالجة أفضل
  if (url.includes('vimeo.com/')) {
    // 🔥 رابط Vimeo العادي: https://vimeo.com/123456789
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}?h=12345&autoplay=0&title=0&byline=0&portrait=0`;
    }
    
    // 🔥 رابط Vimeo مع shared: https://vimeo.com/1193597303/ed32e4e65c
    const numbers = url.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      // جلب أول رقم كبير (أكثر من 5 أرقام)
      const bigNumbers = numbers.filter(n => n.length >= 6);
      if (bigNumbers.length > 0) {
        return `https://player.vimeo.com/video/${bigNumbers[0]}?h=12345&autoplay=0&title=0&byline=0&portrait=0`;
      }
      return `https://player.vimeo.com/video/${numbers[0]}?h=12345&autoplay=0&title=0&byline=0&portrait=0`;
    }
  }
  
  // ✅ Vimeo embed
  if (url.includes('player.vimeo.com/video/')) {
    return url;
  }
  
  // ✅ YouTube embed
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // ✅ باقي الروابط (MP4, PDF, إلخ)
  return url;
};

// ✅ التحقق من نوع الفيديو
const isVideoLink = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || 
         url.includes('youtu.be') || 
         url.includes('vimeo.com') ||
         url.includes('player.vimeo.com') ||
         url.includes('player.vimeo');
};

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  videoUrl,
  title,
  poster,
  isLocked = false,
  requiredExam,
  onStartExam,
  parts = [],
  selectedPartIndex = 0,
}, ref) => {
  const { lang } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPart] = useState(selectedPartIndex);

  useImperativeHandle(ref, () => ({
    pause: () => videoRef.current?.pause(),
    play: () => videoRef.current?.play(),
    seekTo: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    },
  }));

  const currentVideoUrl = parts[currentPart]?.videoUrl || videoUrl;
  const currentTitle = parts[currentPart] 
    ? (lang === 'ar' ? parts[currentPart].title_ar : parts[currentPart].title)
    : title;

  // ✅ تحويل الرابط
  const embedUrl = getVideoUrl(currentVideoUrl || '');
  const isEmbedVideo = isVideoLink(currentVideoUrl || '');


  // ✅ إعادة تعيين حالة التحميل عند تغيير الرابط
  useEffect(() => {
    setIsLoading(true);
    setVideoError(false);
  }, [currentVideoUrl]);

  // ✅ إذا كان مقفول
  if (isLocked) {
    return <VideoLocked requiredExam={requiredExam} onStartExam={onStartExam} lang={lang} />;
  }

  // ✅ إذا مفيش رابط
  if (!currentVideoUrl) {
    return (
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <p className="text-foreground/60">
          {lang === "ar" ? "لا يوجد محتوى" : "No content available"}
        </p>
      </div>
    );
  }

  // ✅ إذا كان فيديو (YouTube أو Vimeo)
  if (isEmbedVideo && embedUrl) {
    return (
      <VideoProtection>
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card">
          {/* ✅ Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}
          
          <iframe
            key={embedUrl}
            src={embedUrl}
            className="w-full h-full"
            title={currentTitle || ''}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => {
              setIsLoading(false);
            }}
            onError={() => {
              console.error("❌ Iframe error");
              setVideoError(true);
              setIsLoading(false);
            }}
          />
          
          {/* ✅ Error State */}
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
              <div className="text-center text-white p-6 max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <p className="text-lg font-semibold mb-2 text-white">
                  {lang === "ar" ? "عذراً، لا يمكن تحميل الفيديو" : "Sorry, cannot load video"}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {lang === "ar" 
                    ? "يمكنك مشاهدة الفيديو على المنصة الأصلية"
                    : "You can watch the video on the original platform"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a 
                    href={currentVideoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-semibold hover:scale-105 transition-all shadow-lg shadow-primary/25"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {lang === "ar" ? "فتح الفيديو" : "Open Video"}
                  </a>
                  <button
                    onClick={() => {
                      setVideoError(false);
                      setIsLoading(true);
                      // إعادة تحميل الـ iframe
                      const iframe = document.querySelector('iframe');
                      if (iframe) {
                        iframe.src = embedUrl;
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all"
                  >
                    {lang === "ar" ? "إعادة المحاولة" : "Retry"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </VideoProtection>
    );
  }

  // ✅ إذا كان فيديو محلي (MP4)
  if (currentVideoUrl && !isEmbedVideo) {
    return (
      <VideoProtection>
        <LocalVideoPlayer
          videoUrl={currentVideoUrl}
          poster={poster}
          onError={() => setVideoError(true)}
          videoRef={videoRef}
        />
        {videoError && <VideoError lang={lang} videoUrl={currentVideoUrl} />}
      </VideoProtection>
    );
  }

  // ✅ Fallback
  return (
    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-8">
      <p className="text-foreground/60 mb-4">
        {lang === "ar" ? "لا يمكن عرض المحتوى" : "Cannot display content"}
      </p>
      <a 
        href={currentVideoUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm"
      >
        <ExternalLink className="w-4 h-4" />
        {lang === "ar" ? "فتح الرابط" : "Open Link"}
      </a>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;