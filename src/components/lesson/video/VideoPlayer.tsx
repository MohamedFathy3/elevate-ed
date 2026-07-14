/* eslint-disable @typescript-eslint/no-explicit-any */
// components/video/VideoPlayer.tsx
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useLang } from '@/i18n/LanguageContext';
import { LocalVideoPlayer } from './LocalVideoPlayer';
import { VideoLocked } from './VideoLocked';
import { VideoError } from './VideoErrorBoundary';
import { AlertCircle, Loader2 } from 'lucide-react';
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

// ✅ دالة الحصول على الرابط
const getVideoUrl = (url: string) => {
  if (!url) return null;
  
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&showinfo=0&controls=1&autohide=1&fs=0&iv_load_policy=3&playsinline=1`;
  }
  
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&showinfo=0&controls=1&autohide=1&fs=0&iv_load_policy=3&playsinline=1`;
  }
  
  if (url.includes('youtube.com/shorts/')) {
    const videoId = url.split('shorts/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&showinfo=0&controls=1&autohide=1&fs=0&iv_load_policy=3&playsinline=1`;
  }
  
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
  
  if (url.includes('player.vimeo.com/video/')) {
    return url;
  }
  
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  return url;
};

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // ✅ منع فتح الروابط من الإطار
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ✅ منع النقر على أي رابط داخل الإطار
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // ✅ لو الضغط كان على الإطار أو أي عنصر جواه
      if (target.closest('iframe') || target.closest('a')) {
        e.preventDefault();
        e.stopPropagation();
        
        toast.warning(
          lang === "ar" 
            ? "⚠️ المحتوى محمي ولا يمكن فتحه خارج المنصة"
            : "⚠️ Content is protected and cannot be opened outside the platform"
        );
        return false;
      }
    };

    // ✅ منع النقر بزر الماوس الأيمن
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('iframe')) {
        e.preventDefault();
        return false;
      }
    };

    // ✅ منع سحب الرابط
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement)?.closest('iframe')) {
        e.preventDefault();
        return false;
      }
    };

    container.addEventListener('click', handleClick, true);
    container.addEventListener('contextmenu', handleContextMenu, true);
    container.addEventListener('dragstart', handleDragStart, true);

    return () => {
      container.removeEventListener('click', handleClick, true);
      container.removeEventListener('contextmenu', handleContextMenu, true);
      container.removeEventListener('dragstart', handleDragStart, true);
    };
  }, [lang]);

  if (isLocked) {
    return <VideoLocked requiredExam={requiredExam} onStartExam={onStartExam} lang={lang} />;
  }

  if (!currentVideoUrl) {
    return (
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <p className="text-foreground/60">
          {lang === "ar" ? "لا يوجد محتوى" : "No content available"}
        </p>
      </div>
    );
  }

  if (isEmbedVideo && embedUrl) {
    return (
      <div ref={containerRef} className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}
        
        {/* ✅ طبقة شفافة فوق الإطار بالكامل تمنع النقر على الروابط ولكن تسمح بالتفاعل مع الفيديو */}
        <div 
          className="absolute inset-0 z-20"
          style={{ 
            pointerEvents: 'none',
            background: 'transparent'
          }}
        />
        
        {/* ✅ طبقة منع النقر على شعار يوتيوب فقط */}
        <div 
          className="absolute top-0 left-0 w-[200px] h-[60px] z-30"
          style={{ 
            pointerEvents: 'auto', 
            cursor: 'default',
            background: 'transparent'
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toast.warning(
              lang === "ar" 
                ? "⚠️ المحتوى محمي ولا يمكن فتحه خارج المنصة"
                : "⚠️ Content is protected and cannot be opened outside the platform"
            );
            return false;
          }}
        />
        
        {/* ✅ طبقة منع النقر على زر "Watch on YouTube" في الأسفل */}
        <div 
          className="absolute bottom-0 right-0 w-[180px] h-[50px] z-30"
          style={{ 
            pointerEvents: 'auto', 
            cursor: 'default',
            background: 'transparent'
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toast.warning(
              lang === "ar" 
                ? "⚠️ المحتوى محمي ولا يمكن فتحه خارج المنصة"
                : "⚠️ Content is protected and cannot be opened outside the platform"
            );
            return false;
          }}
        />

        <iframe
          ref={iframeRef}
          key={embedUrl}
          src={embedUrl}
          className="w-full h-full"
          title={currentTitle || ''}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={() => {
            setVideoError(true);
            setIsLoading(false);
          }}
        />

        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-40">
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
                  if (iframeRef.current) {
                    iframeRef.current.src = embedUrl;
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
    );
  }

  if (currentVideoUrl && !isEmbedVideo) {
    return (
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card">
        <video
          ref={videoRef}
          src={currentVideoUrl}
          className="w-full h-full"
          controls
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
          poster={poster}
          playsInline
          onError={() => setVideoError(true)}
        >
          <source src={currentVideoUrl} type="video/mp4" />
          متصفحك لا يدعم تشغيل الفيديو
        </video>
        {videoError && <VideoError lang={lang} videoUrl={currentVideoUrl} />}
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-8">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-foreground/60 mb-4 text-center">
        {lang === "ar" ? "لا يمكن عرض هذا المحتوى" : "Cannot display this content"}
      </p>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;