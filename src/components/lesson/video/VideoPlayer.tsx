// src/components/lesson/video/VideoPlayer.tsx

import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Shield, Lock, SkipBack, SkipForward, Loader2 } from 'lucide-react';
import { VideoLocked } from './VideoLocked';
import { toast } from '@/hooks/use-toast';

// ✅ المكونات المنفصلة
import { QualityControl } from './components/QualityControl';
import { SpeedControl } from './components/SpeedControl';
import { ProgressBar } from './components/ProgressBar';
import { VideoError } from './components/VideoError';

// ✅ الأنواع والدوال
import { VideoPlayerProps, VideoPlayerRef } from './VideoPlayer.types';
import { 
  extractVideoId, 
  buildYouTubeEmbedUrl, 
  formatTime, 
  DEFAULT_QUALITIES 
} from './VideoPlayer.utils';

// ✅ الـ Hooks
import { useVideoProtection } from './hooks/useVideoProtection';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lang, setLang] = useState('ar');
  const [isMobile, setIsMobile] = useState(false);
  
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [currentQuality, setCurrentQuality] = useState('auto');

  // ✅ استخدام Hook الحماية
  const { cleanExtensions } = useVideoProtection(containerRef);

  // ✅ اكتشاف الموبايل
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLang(localStorage.getItem('lang') || 'ar');
  }, []);

  const videoId = extractVideoId(videoUrl || '');
  const baseEmbedUrl = videoId ? buildYouTubeEmbedUrl(videoId) : null;

  // ✅ تحديث الوقت
  useEffect(() => {
    if (!isVideoReady) return;
    const interval = setInterval(() => {
      if (isPlaying && !isDragging) {
        setCurrentTime(prev => {
          const step = isMobile ? 1 : 0.5;
          const newTime = prev + step;
          if (duration > 0 && newTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return newTime;
        });
      }
    }, isMobile ? 1000 : 500);
    return () => clearInterval(interval);
  }, [isPlaying, isVideoReady, duration, isDragging, isMobile]);

  // ✅ التحكم في التشغيل
  const togglePlay = useCallback(() => {
    const iframe = iframeRef.current;
    const newState = !isPlaying;
    
    if (iframe && isVideoReady) {
      try {
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow) {
          const command = newState ? 'playVideo' : 'pauseVideo';
          iframeWindow.postMessage(JSON.stringify({
            event: 'command',
            func: command,
            args: ''
          }), '*');
          setIsPlaying(newState);
          return;
        }
      } catch (error) {
        console.warn('Iframe control failed:', error);
      }
    }
    setIsPlaying(newState);
    if (newState && duration === 0) setDuration(3600);
  }, [isPlaying, isVideoReady, duration]);

  // ✅ تغيير السرعة
  const changeSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    const iframe = iframeRef.current;
    if (iframe && isVideoReady) {
      try {
        const win = iframe.contentWindow;
        if (win) {
          win.postMessage(`{"event":"command","func":"setPlaybackRate","args":[${speed}]}`, '*');
        }
      } catch (e) {}
    }
    toast.info(`⚡ ${lang === 'ar' ? 'السرعة' : 'Speed'}: ${speed}x`);
    setShowSpeedMenu(false);
  }, [isVideoReady, lang]);

  // ✅ تغيير الجودة
  const changeQuality = useCallback((quality: string) => {
    let finalQuality = quality;
    if (isMobile && quality === 'auto') finalQuality = '480';
    setCurrentQuality(finalQuality);
    
    const qualityLabel = DEFAULT_QUALITIES.find(q => q.value === finalQuality)?.label || finalQuality;
    const iframe = iframeRef.current;
    if (iframe && isVideoReady) {
      try {
        const win = iframe.contentWindow;
        if (win) {
          win.postMessage(JSON.stringify({
            event: 'command',
            func: 'setPlaybackQuality',
            args: [finalQuality]
          }), '*');
          toast.info(`📺 ${lang === 'ar' ? 'جودة' : 'Quality'}: ${qualityLabel}`);
        }
      } catch (e) {}
    }
  }, [isVideoReady, lang, isMobile]);

  // ✅ تقدم/تراجع
  const seekForward = useCallback(() => {
    const newTime = Math.min(currentTime + 10, duration || 3600);
    setCurrentTime(newTime);
    const iframe = iframeRef.current;
    if (iframe && isVideoReady) {
      try {
        const win = iframe.contentWindow;
        if (win) {
          win.postMessage(JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [newTime, true]
          }), '*');
        }
      } catch (e) {}
    }
  }, [currentTime, duration, isVideoReady]);

  const seekBackward = useCallback(() => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    const iframe = iframeRef.current;
    if (iframe && isVideoReady) {
      try {
        const win = iframe.contentWindow;
        if (win) {
          win.postMessage(JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [newTime, true]
          }), '*');
        }
      } catch (e) {}
    }
  }, [currentTime, isVideoReady]);

  // ✅ ملء الشاشة
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen?.();
        setIsFullscreen(true);
        setTimeout(cleanExtensions, 200);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
        setTimeout(cleanExtensions, 200);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, [cleanExtensions]);

  // ✅ مراقبة ملء الشاشة
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(cleanExtensions, 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, [cleanExtensions]);

  // ✅ استقبال رسائل من iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com' && 
          event.origin !== 'https://www.youtube-nocookie.com') return;

      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onPlaybackQualityChange') {
          setCurrentQuality(data.quality || 'auto');
        }
        if (data.event === 'onVideoDurationChange') {
          const newDuration = data.duration || data.data || 0;
          if (newDuration > 0) setDuration(newDuration);
        }
        if (data.event === 'onVideoCurrentTimeUpdate') {
          const time = data.currentTime || data.data || 0;
          if (!isDragging) setCurrentTime(time);
        }
        if (data.event === 'onReady') {
          setIsVideoReady(true);
          setIsLoading(false);
          if (isMobile) setTimeout(() => changeQuality('480'), 1000);
        }
      } catch (e) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isDragging, isMobile, changeQuality]);

  // ✅ دوال منع السرقة
  useEffect(() => {
    const preventDevTools = (e: KeyboardEvent) => {
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        toast.error('⛔ أدوات المطور معطلة');
        return false;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        toast.error('⛔ أدوات المطور معطلة');
        return false;
      }
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        toast.error('⛔ عرض المصدر معطل');
        return false;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        togglePlay();
        return false;
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) return;
      e.preventDefault();
      return false;
    };

    document.addEventListener('keydown', preventDevTools);
    document.addEventListener('contextmenu', preventContextMenu);
    return () => {
      document.removeEventListener('keydown', preventDevTools);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [togglePlay]);

  useImperativeHandle(ref, () => ({
    pause: () => {
      setIsPlaying(false);
      const iframe = iframeRef.current;
      if (iframe && isVideoReady) {
        try {
          const win = iframe.contentWindow;
          if (win) {
            win.postMessage(JSON.stringify({
              event: 'command',
              func: 'pauseVideo',
              args: ''
            }), '*');
          }
        } catch (e) {}
      }
    },
    play: () => {
      setIsPlaying(true);
      const iframe = iframeRef.current;
      if (iframe && isVideoReady) {
        try {
          const win = iframe.contentWindow;
          if (win) {
            win.postMessage(JSON.stringify({
              event: 'command',
              func: 'playVideo',
              args: ''
            }), '*');
          }
        } catch (e) {}
      }
    },
    seekTo: (time: number) => {
      setCurrentTime(time);
      const iframe = iframeRef.current;
      if (iframe && isVideoReady) {
        try {
          const win = iframe.contentWindow;
          if (win) {
            win.postMessage(JSON.stringify({
              event: 'command',
              func: 'seekTo',
              args: [time, true]
            }), '*');
          }
        } catch (e) {}
      }
    },
    toggleFullscreen,
  }));

  const currentPartIndex = selectedPartIndex;
  const currentVideoUrl = parts[currentPartIndex]?.videoUrl || videoUrl;
  const currentTitle = parts[currentPartIndex] 
    ? (lang === 'ar' ? parts[currentPartIndex].title_ar : parts[currentPartIndex].title)
    : title;

  useEffect(() => {
    setIsLoading(true);
    setVideoError(false);
    setIsPlaying(false);
    setIsVideoReady(false);
    setCurrentTime(0);
    setDuration(0);
  }, [currentVideoUrl]);

  if (isLocked) {
    return <VideoLocked requiredExam={requiredExam} onStartExam={onStartExam} lang={lang} />;
  }

  if (!currentVideoUrl || !baseEmbedUrl) {
    return (
      <div className="aspect-video bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-8">
        <Lock className="w-16 h-16 text-amber-500 mb-4" />
        <p className="text-white font-semibold text-lg">
          {lang === "ar" ? "هذا الدرس مقفل" : "This lesson is locked"}
        </p>
        <p className="text-gray-400 text-sm mt-2 max-w-md text-center">
          {lang === "ar" 
            ? "يجب اجتياز الامتحان السابق لمشاهدة الفيديو"
            : "You must pass the previous exam to watch the video"}
        </p>
        {requiredExam && (
          <button
            onClick={onStartExam}
            className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 active:bg-amber-700 transition-all touch-manipulation"
          >
            {lang === "ar" ? "بدء الامتحان" : "Start Exam"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card group video-protected"
      style={{ 
        userSelect: 'none',
        position: 'relative',
        touchAction: 'none',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeout) clearTimeout(controlsTimeout);
        const timeout = setTimeout(() => {
          if (isPlaying && !isMobile) setShowControls(false);
        }, 3000);
        setControlsTimeout(timeout);
      }}
      onTouchStart={() => {
        setShowControls(true);
        if (controlsTimeout) clearTimeout(controlsTimeout);
      }}
      onTouchEnd={() => {
        if (isPlaying && isMobile) {
          setTimeout(() => setShowControls(false), 5000);
        }
      }}
      onMouseLeave={() => {
        if (isPlaying && !isMobile) setShowControls(false);
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={baseEmbedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title={currentTitle || ''}
        loading="lazy"
        style={{ 
          border: 'none',
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
        onLoad={() => {
          setIsLoading(false);
          setIsVideoReady(true);
          setDuration(3600);
          setTimeout(cleanExtensions, 100);
          setTimeout(cleanExtensions, 500);
          if (currentQuality === 'auto') {
            setTimeout(() => {
              if (isMobile) changeQuality('480');
              else changeQuality('720');
            }, 1500);
          }
        }}
        onError={() => {
          setVideoError(true);
          setIsLoading(false);
        }}
      />

      {/* طبقة حماية */}
      <div 
        className="absolute inset-0 z-20"
        style={{ background: 'transparent', pointerEvents: 'none' }}
      />

      {/* Controls */}
      <div className={`absolute inset-0 z-30 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* زر التشغيل الكبير */}
        <button
          type="button"
          onClick={togglePlay}
          onTouchStart={togglePlay}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/40 text-white hover:bg-white/30 active:bg-white/40 transition-all hover:scale-110 active:scale-95 play-button z-40 touch-manipulation
            ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
        </button>

        {/* العنوان */}
        {currentTitle && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-40 max-w-[70%]">
            <h3 className="text-white text-sm sm:text-lg font-semibold drop-shadow-lg bg-black/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg backdrop-blur-sm truncate">
              {currentTitle}
            </h3>
          </div>
        )}

        {/* شريط التحكم السفلي */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            isDragging={isDragging}
            onDragStart={() => setIsDragging(true)}
            onDragMove={(value) => setCurrentTime(value)}
            onDragEnd={(value) => {
              setIsDragging(false);
              setCurrentTime(value);
              const iframe = iframeRef.current;
              if (iframe && isVideoReady) {
                try {
                  const win = iframe.contentWindow;
                  if (win) {
                    win.postMessage(JSON.stringify({
                      event: 'command',
                      func: 'seekTo',
                      args: [value, true]
                    }), '*');
                  }
                } catch (e) {}
              }
            }}
            onSeek={(value) => {
              setCurrentTime(value);
              const iframe = iframeRef.current;
              if (iframe && isVideoReady) {
                try {
                  const win = iframe.contentWindow;
                  if (win) {
                    win.postMessage(JSON.stringify({
                      event: 'command',
                      func: 'seekTo',
                      args: [value, true]
                    }), '*');
                  }
                } catch (e) {}
              }
            }}
          />

          {/* أزرار التحكم */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <button
                type="button"
                onClick={seekBackward}
                onTouchStart={seekBackward}
                className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-all touch-manipulation min-h-[44px] min-w-[44px]"
                aria-label={lang === "ar" ? "رجوع 10 ثواني" : "Back 10s"}
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                onTouchStart={togglePlay}
                className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-all play-button touch-manipulation min-h-[44px] min-w-[44px]"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={seekForward}
                onTouchStart={seekForward}
                className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-all touch-manipulation min-h-[44px] min-w-[44px]"
                aria-label={lang === "ar" ? "تقدم 10 ثواني" : "Forward 10s"}
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <span className="text-xs text-white/70 font-mono ml-1 sm:ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <QualityControl
                currentQuality={currentQuality}
                onQualityChange={changeQuality}
                availableQualities={DEFAULT_QUALITIES}
                lang={lang}
              />

              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  onTouchStart={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-all speed-button touch-manipulation min-h-[44px] min-w-[44px]"
                  aria-label={lang === "ar" ? "تغيير السرعة" : "Change speed"}
                >
                  <span className="text-sm font-medium">{playbackSpeed}x</span>
                </button>
                
                {showSpeedMenu && (
                  <SpeedControl
                    speed={playbackSpeed}
                    onSpeedChange={changeSpeed}
                    onClose={() => setShowSpeedMenu(false)}
                    lang={lang}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                onTouchStart={toggleFullscreen}
                className="p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-all fullscreen-button touch-manipulation min-h-[44px] min-w-[44px]"
                aria-label={lang === "ar" ? "تكبير الشاشة" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* علامة مائية */}
      <div className="absolute top-4 right-4 z-20 opacity-20 pointer-events-none">
        <Shield className="w-6 h-6 text-white" />
      </div>

      {videoError && <VideoError lang={lang} onRetry={() => window.location.reload()} />}

      <style>{`
        .video-protected [id*="chrome-extension"],
        .video-protected [class*="chrome-extension"],
        .video-protected [id*="download" i],
        .video-protected [class*="download" i],
        .video-protected [data-video-downloader],
        .video-protected .video-downloader,
        .video-protected .video-saver,
        .video-protected .download-helper,
        .video-protected [id*="idm" i],
        .video-protected [class*="idm" i],
        .video-protected [id*="IDM"],
        .video-protected [class*="IDM"],
        .video-protected [data-idm],
        .video-protected [data-IDM] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
          position: absolute !important;
          z-index: -99999 !important;
        }

        .video-protected * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .touch-manipulation {
          touch-action: manipulation;
        }

        .video-protected iframe {
          pointer-events: auto !important;
        }

        @media (max-width: 640px) {
          .video-protected button {
            min-height: 44px !important;
            min-width: 44px !important;
          }
          .video-protected .progress-bar {
            height: 6px !important;
          }
        }

        .video-protected {
          -webkit-overflow-scrolling: touch;
          overflow: hidden;
        }
        
        .video-protected iframe {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
});

// ✅ إضافة المكونات المفقودة
import { Maximize, Minimize } from 'lucide-react';

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;