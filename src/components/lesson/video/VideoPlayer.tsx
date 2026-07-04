/* eslint-disable @typescript-eslint/no-explicit-any */
// components/video/VideoPlayer.tsx
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useLang } from '@/i18n/LanguageContext';
import { VideoProtection } from './VideoProtection';
import { LocalVideoPlayer } from './LocalVideoPlayer';
import { VideoLocked } from './VideoLocked';
import { VideoError } from './VideoErrorBoundary';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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

// ✅ دالة الحصول على الرابط مع منع الـ embed
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
  
  // ✅ Vimeo
  if (url.includes('vimeo.com/')) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}?h=12345&autoplay=0&title=0&byline=0&portrait=0`;
    }
    const numbers = url.match(/\d+/g);
    if (numbers && numbers.length > 0) {
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

  const embedUrl = getVideoUrl(currentVideoUrl || '');
  const isEmbedVideo = isVideoLink(currentVideoUrl || '');

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

  // ✅ إذا كان فيديو (YouTube أو Vimeo) - منع فتح الرابط نهائياً
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
          
          {/* ✅ Error State - منع فتح الرابط نهائياً */}
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
                    ? "الرجاء التأكد من اتصالك بالإنترنت أو حاول مرة أخرى"
                    : "Please check your internet connection or try again"}
                </p>
                <button
                  onClick={() => {
                    setVideoError(false);
                    setIsLoading(true);
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

  // ✅ Fallback - منع فتح الرابط نهائياً
  return (
    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-8">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-foreground/60 mb-4 text-center">
        {lang === "ar" ? "لا يمكن عرض هذا المحتوى" : "Cannot display this content"}
      </p>
      <button
        onClick={() => {
          toast.error(
            lang === "ar" 
              ? "⚠️ لا يمكن فتح الروابط الخارجية لحماية المحتوى"
              : "⚠️ Cannot open external links to protect content"
          );
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-all cursor-not-allowed"
      >
        {lang === "ar" ? "🚫 رابط محمي" : "🚫 Protected Link"}
      </button>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;