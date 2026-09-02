/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/lesson/video/VideoPlayer.tsx

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Captions,
  Lock,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  Shield,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { VideoLocked } from './VideoLocked';
import { toast } from '@/hooks/use-toast';
import { QualityControl } from './components/QualityControl';
import { SpeedControl } from './components/SpeedControl';
import { ProgressBar } from './components/ProgressBar';
import { VideoError } from './components/VideoError';
import { VideoPlayerProps, VideoPlayerRef } from './VideoPlayer.types';
import { extractVideoId, formatTime, DEFAULT_QUALITIES } from './VideoPlayer.utils';
import { useVideoProtection } from './hooks/useVideoProtection';

const mapToYouTubeQuality = (quality: string): string => {
  switch (quality) {
    case '240': return 'small';
    case '360': return 'medium';
    case '480': return 'large';
    case '720': return 'hd720';
    case '1080': return 'hd1080';
    case '1440': return 'hd1440';
    case '2160': return 'highres';
    case 'auto': return 'default';
    default: return quality;
  }
};

let youtubeApiPromise: Promise<void> | null = null;

const loadYouTubeIframeApi = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  
  // ✅ التحقق من وجود API
  if ((window as any).YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  const promise = new Promise<void>((resolve, reject) => {
    let settled = false;
    let pollTimer: ReturnType<typeof window.setInterval> | null = null;
    let timeoutTimer: ReturnType<typeof window.setTimeout> | null = null;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      if (pollTimer) window.clearInterval(pollTimer);
      if (timeoutTimer) window.clearTimeout(timeoutTimer);
      if (error) reject(error);
      else resolve();
    };

    const checkReady = () => {
      if ((window as any).YT?.Player) finish();
    };

    const previousReady = (window as any).onYouTubeIframeAPIReady;
    const handleReady = () => {
      previousReady?.();
      checkReady();
    };
    (window as any).onYouTubeIframeAPIReady = handleReady;

    // ✅ التحقق من وجود السكريبت بالفعل
    let script = document.getElementById('youtube-iframe-api-script') as HTMLScriptElement | null;
    const handleScriptError = () => {
      finish(new Error('تعذر تحميل YouTube Player API'));
    };

    if (script) {
      script.addEventListener('error', handleScriptError, { once: true });
    } else {
      script = document.createElement('script');
      script.id = 'youtube-iframe-api-script';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.defer = true; // ✅ إضافة defer للتحميل بشكل أفضل
      script.addEventListener('load', checkReady, { once: true });
      script.addEventListener('error', handleScriptError, { once: true });
      document.head.appendChild(script);
    }

    pollTimer = window.setInterval(checkReady, 100);
    timeoutTimer = window.setTimeout(() => {
      finish(new Error('انتهت مهلة تحميل YouTube Player API'));
    }, 15000);
    checkReady();
  });

  youtubeApiPromise = promise.catch((error) => {
    youtubeApiPromise = null;
    throw error;
  });

  return youtubeApiPromise;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTogglingRef = useRef(false);
  const isFirstVideoRef = useRef(true);
  const isPlayingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const pendingPlayRef = useRef(false);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobileRef = useRef(false);
  const hasUserInteractedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const rawId = useId();
  const playerElId = `yt-player-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lang, setLang] = useState('ar');
  const [isMobile, setIsMobile] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [captionsEnabled, setCaptionsEnabled] = useState(false);

  const { cleanExtensions } = useVideoProtection(containerRef);

  const setPlayingState = useCallback((value: boolean) => {
    isPlayingRef.current = value;
    setIsPlaying(value);
  }, []);

  const setTimeState = useCallback((value: number) => {
    currentTimeRef.current = value;
    setCurrentTime(value);
  }, []);

  const clearControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
  }, []);

  const revealControls = useCallback(() => {
    setShowControls(true);
    clearControlsTimer();

    if (isPlayingRef.current && !isMobileRef.current) {
      controlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [clearControlsTimer]);

  // ✅ تحسين اكتشاف الموبايل
  const checkMobile = useCallback(() => {
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    const mobile = isMobileDevice || isSmallScreen;
    isMobileRef.current = mobile;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  useEffect(() => {
    setLang(localStorage.getItem('lang') || 'ar');
  }, []);

  const currentVideoUrl = parts[selectedPartIndex]?.videoUrl || videoUrl;
  const currentVideoId = extractVideoId(currentVideoUrl || '');
  const currentTitle = parts[selectedPartIndex]
    ? (lang === 'ar' ? parts[selectedPartIndex].title_ar : parts[selectedPartIndex].title)
    : title;

  const changeQuality = useCallback((quality: string) => {
    const finalQuality = quality;
    setCurrentQuality(finalQuality);

    const qualityLabel = DEFAULT_QUALITIES.find((item) => item.value === finalQuality)?.label || finalQuality;
    const player = playerRef.current;

    if (player && typeof player.setPlaybackQuality === 'function') {
      try {
        player.setPlaybackQuality(mapToYouTubeQuality(finalQuality));
      } catch {
        // YouTube may ignore manual quality requests for adaptive streams.
      }
    }

    toast.info(`${lang === 'ar' ? 'الجودة' : 'Quality'}: ${qualityLabel}`);
  }, [lang]);

  const toggleCaptions = useCallback(() => {
    const player = playerRef.current;
    if (!player || !isVideoReady) return;

    try {
      if (captionsEnabled) {
        player.unloadModule?.('captions');
        setCaptionsEnabled(false);
      } else {
        player.loadModule?.('captions');
        player.setOption?.('captions', 'track', { languageCode: lang === 'ar' ? 'ar' : 'en' });
        setCaptionsEnabled(true);
      }
    } catch {
      toast.error(lang === 'ar' ? 'تعذر تغيير الترجمة لهذا الفيديو' : 'Captions are unavailable for this video');
    }
  }, [captionsEnabled, isVideoReady, lang]);

  // ✅ دالة إعادة المحاولة
  const retryInit = useCallback(() => {
    if (retryCountRef.current >= maxRetries) {
      setVideoError(true);
      setIsLoading(false);
      return;
    }
    
    retryCountRef.current += 1;
    console.log(`🔄 محاولة إعادة تحميل المشغل (${retryCountRef.current}/${maxRetries})...`);
    
    // ✅ إعادة تعيين الحالة
    setIsLoading(true);
    setVideoError(false);
    setIsVideoReady(false);
    
    // ✅ تنظيف المشغل القديم
    if (playerRef.current) {
      try {
        playerRef.current.destroy?.();
      } catch {
        // Ignore
      }
      playerRef.current = null;
    }
    
    // ✅ إعادة تحميل API
    youtubeApiPromise = null;
    
    // ✅ إعادة تشغيل التهيئة
    setTimeout(() => {
      initPlayer();
    }, 1000);
  }, []);

  // ✅ دالة تهيئة المشغل
  const initPlayer = useCallback(() => {
    if (!currentVideoId || !playerDivRef.current) return;
    
    let cancelled = false;

    if (playerRef.current) {
      try {
        playerRef.current.destroy?.();
      } catch {
        // Ignore
      }
      playerRef.current = null;
    }

    loadYouTubeIframeApi()
      .then(() => {
        if (cancelled || playerRef.current || !playerDivRef.current) return;
        const YT = (window as any).YT;
        if (!YT?.Player) throw new Error('YouTube Player API غير متاحة');

        setIsLoading(true);
        setVideoError(false);
        setIsVideoReady(false);

        // ✅ الحصول على origin آمن
        let origin = window.location.origin;
        // ✅ تنظيف origin من أي ports غير قياسية
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          origin = 'http://localhost';
        }

        playerRef.current = new YT.Player(playerElId, {
          videoId: currentVideoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            fs: 0,
            iv_load_policy: 3,
            disablekb: 1,
            playsinline: 1,
            cc_load_policy: 0,
            cc_lang_pref: lang === 'ar' ? 'ar' : 'en',
            origin: origin,
            widget_referrer: origin,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              if (cancelled) return;
              if (readyTimeoutRef.current) {
                window.clearTimeout(readyTimeoutRef.current);
                readyTimeoutRef.current = null;
              }
              
              setIsVideoReady(true);
              setIsLoading(false);
              retryCountRef.current = 0; // ✅ إعادة تعيين عدد المحاولات

              const realDuration = event.target.getDuration?.() || 0;
              if (realDuration > 0) {
                durationRef.current = realDuration;
                setDuration(realDuration);
              }

              const iframe = event.target.getIframe?.();
              if (iframe) {
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.position = 'absolute';
                iframe.style.inset = '0';
                iframe.style.border = '0';
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
                iframe.setAttribute('allowfullscreen', 'true');
                iframe.setAttribute('title', currentTitle || 'Lesson video');
                // ✅ إضافة sandbox للسماح بكل شيء
                iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
              }

              if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                try {
                  event.target.playVideo?.();
                } catch {
                  // Ignore
                }
              }

              window.setTimeout(cleanExtensions, 100);
              window.setTimeout(cleanExtensions, 500);
            },
            onStateChange: (event: any) => {
              if (cancelled) return;
              const states = (window as any).YT?.PlayerState;
              if (!states) return;

              if (event.data === states.PLAYING) {
                setPlayingState(true);
                // ✅ FIX: كان الفيديو بيفضل عليه loading spinner للأبد لو
                // البلاير عدّى بحالة BUFFERING مرة وبعدين رجع PLAYING،
                // لأن isLoading ما كانش بيترجع false غير في onReady بس.
                setIsLoading(false);
                hasUserInteractedRef.current = true;
                const realDuration = event.target.getDuration?.() || 0;
                if (realDuration > 0) {
                  durationRef.current = realDuration;
                  setDuration(realDuration);
                }
                revealControls();
              } else if (event.data === states.PAUSED || event.data === states.ENDED) {
                setPlayingState(false);
                setShowControls(true);
                clearControlsTimer();
              } else if (event.data === states.UNSTARTED) {
                setIsLoading(false);
              } else if (event.data === states.BUFFERING) {
                setIsLoading(true);
              }
            },
            onPlaybackQualityChange: (event: any) => {
              if (!cancelled) setCurrentQuality(event.data || 'auto');
            },
            onError: (event: any) => {
              if (!cancelled) {
                console.error('YouTube player error:', event.data);
                if (readyTimeoutRef.current) {
                  window.clearTimeout(readyTimeoutRef.current);
                  readyTimeoutRef.current = null;
                }
                
                // ✅ محاولة إعادة المحاولة
                if (retryCountRef.current < maxRetries) {
                  retryInit();
                } else {
                  setVideoError(true);
                  setIsLoading(false);
                  pendingPlayRef.current = false;
                }
              }
            },
          },
        });

        readyTimeoutRef.current = window.setTimeout(() => {
          if (!cancelled && !isVideoReady) {
            console.error('YouTube player did not become ready in time');
            // ✅ محاولة إعادة المحاولة
            if (retryCountRef.current < maxRetries) {
              retryInit();
            } else {
              setVideoError(true);
              setIsLoading(false);
              pendingPlayRef.current = false;
            }
          }
        }, 15000);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('YouTube Player API initialization failed:', error);
          // ✅ محاولة إعادة المحاولة
          if (retryCountRef.current < maxRetries) {
            retryInit();
          } else {
            setVideoError(true);
            setIsLoading(false);
            pendingPlayRef.current = false;
          }
        }
      });

    return () => {
      cancelled = true;
      if (readyTimeoutRef.current) {
        window.clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = null;
      }
      try {
        playerRef.current?.destroy?.();
        playerRef.current = null;
      } catch {
        // Ignore
      }
    };
  }, [playerElId, currentVideoId, currentTitle, lang, cleanExtensions, retryInit, maxRetries]);

  // ✅ تهيئة المشغل
  useEffect(() => {
    if (!currentVideoId) return;
    retryCountRef.current = 0;
    const cleanup = initPlayer();
    return cleanup;
  }, [initPlayer, currentVideoId]);

  // ✅ تحديث الفيديو عند تغيير الـ videoId
  useEffect(() => {
    if (isFirstVideoRef.current) {
      isFirstVideoRef.current = false;
      return;
    }
    if (!currentVideoId) return;

    setIsLoading(true);
    setVideoError(false);
    setIsVideoReady(false);
    setPlayingState(false);
    setTimeState(0);
    durationRef.current = 0;
    setDuration(0);
    setCaptionsEnabled(false);
    pendingPlayRef.current = false;
    hasUserInteractedRef.current = false;
    retryCountRef.current = 0;

    try {
      const player = playerRef.current;
      if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(currentVideoId);
      } else {
        // ✅ إعادة تهيئة المشغل
        initPlayer();
      }
    } catch {
      initPlayer();
    }
  }, [currentVideoId, setPlayingState, setTimeState, initPlayer]);

  // ✅ تحديث الوقت
  useEffect(() => {
    if (!isVideoReady) return;

    const interval = window.setInterval(() => {
      const player = playerRef.current;
      if (!isDraggingRef.current && player?.getCurrentTime) {
        const value = player.getCurrentTime();
        if (typeof value === 'number' && Number.isFinite(value)) setTimeState(value);
      }
    }, isMobile ? 1000 : 750);

    return () => window.clearInterval(interval);
  }, [isVideoReady, isMobile, setTimeState]);

  // ✅ تشغيل/إيقاف الفيديو
  const togglePlay = useCallback(() => {
    if (isTogglingRef.current) return;
    isTogglingRef.current = true;
    window.setTimeout(() => { isTogglingRef.current = false; }, 300);

    const player = playerRef.current;

    if (!player || !isVideoReady) {
      pendingPlayRef.current = true;
      toast.info(lang === 'ar' ? 'جاري تجهيز الفيديو...' : 'Preparing video...');
      return;
    }

    try {
      if (isPlayingRef.current) {
        player.pauseVideo?.();
      } else {
        player.playVideo?.();
        hasUserInteractedRef.current = true;
      }
    } catch (error) {
      console.warn('Player control failed:', error);
      try {
        if (isPlayingRef.current) {
          player.pauseVideo?.();
        } else {
          player.playVideo?.();
        }
      } catch {
        // Ignore
      }
    }
  }, [isVideoReady, lang]);

  const changeSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    try {
      playerRef.current?.setPlaybackRate?.(speed);
    } catch {
      // Ignore unsupported playback rates.
    }
    toast.info(`${lang === 'ar' ? 'السرعة' : 'Speed'}: ${speed}x`);
    setShowSpeedMenu(false);
  }, [lang]);

  const seekTo = useCallback((time: number) => {
    const safeTime = Math.max(0, Math.min(time, durationRef.current || time));
    setTimeState(safeTime);
    try {
      playerRef.current?.seekTo?.(safeTime, true);
    } catch {
      // Ignore seek errors while the iframe is changing state.
    }
  }, [setTimeState]);

  const seekForward = useCallback(() => seekTo(currentTimeRef.current + 10), [seekTo]);
  const seekBackward = useCallback(() => seekTo(currentTimeRef.current - 10), [seekTo]);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      window.setTimeout(cleanExtensions, 100);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [cleanExtensions]);

  // ✅ منع النقر بزر الماوس الأيمن والتحكم بالكيبورد
  useEffect(() => {
    const isTypingTarget = (element: EventTarget | null) => {
      if (!(element instanceof HTMLElement)) return false;
      return ['INPUT', 'TEXTAREA'].includes(element.tagName) || element.isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        if (!isTypingTarget(document.activeElement)) {
          event.preventDefault();
          togglePlay();
        }
      }
    };

    const onContextMenu = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node) && !(event.target as HTMLElement).closest('button')) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('contextmenu', onContextMenu);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('contextmenu', onContextMenu);
    };
  }, [togglePlay]);

  useImperativeHandle(ref, () => ({
    pause: () => {
      try { playerRef.current?.pauseVideo?.(); } catch { /* noop */ }
    },
    play: () => {
      try { playerRef.current?.playVideo?.(); } catch { /* noop */ }
    },
    seekTo,
    toggleFullscreen,
  }), [seekTo, toggleFullscreen]);

  // ✅ عرض شاشة القفل
  if (isLocked) {
    return <VideoLocked requiredExam={requiredExam} onStartExam={onStartExam} lang={lang} />;
  }

  // ✅ عرض رسالة في حالة عدم وجود رابط فيديو
  if (!currentVideoUrl || !currentVideoId) {
    return (
      <div className="aspect-video rounded-2xl bg-gray-900 flex flex-col items-center justify-center p-8">
        <Lock className="w-16 h-16 text-amber-500 mb-4" />
        <p className="text-white font-semibold text-lg">
          {lang === 'ar' ? 'هذا الدرس مقفل' : 'This lesson is locked'}
        </p>
        <p className="text-gray-400 text-sm mt-2 max-w-md text-center">
          {lang === 'ar' ? 'يجب اجتياز الامتحان السابق لمشاهدة الفيديو' : 'You must pass the previous exam to watch the video'}
        </p>
        {requiredExam && (
          <button onClick={onStartExam} className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors">
            {lang === 'ar' ? 'بدء الامتحان' : 'Start Exam'}
          </button>
        )}
      </div>
    );
  }

  // ✅ المشغل الرئيسي
  return (
    <div
      ref={containerRef}
      dir="ltr"
      className="video-protected group relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      onMouseMove={revealControls}
      onMouseEnter={revealControls}
      onMouseLeave={() => {
        if (isPlayingRef.current && !isMobileRef.current) {
          clearControlsTimer();
          setShowControls(false);
        }
      }}
      onTouchStart={() => {
        setShowControls(true);
        clearControlsTimer();
      }}
      onTouchEnd={() => {
        if (isPlayingRef.current && isMobileRef.current) {
          clearControlsTimer();
          controlsTimerRef.current = setTimeout(() => setShowControls(false), 5000);
        }
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        togglePlay();
      }}
    >
      {poster && !isVideoReady && (
        <img src={poster} alt="" className="absolute inset-0 z-[1] h-full w-full object-cover" draggable={false} />
      )}

      {/* ✅ مشغل YouTube */}
      <div id={playerElId} ref={playerDivRef} className="absolute inset-0 h-full w-full z-[2]" />

      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}

      {/* ✅ عناصر التحكم */}
      <div className={`absolute inset-0 z-30 transition-opacity duration-200 ${showControls || !isPlaying ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button
          type="button"
          onClick={togglePlay}
          aria-busy={isLoading}
          className={`absolute left-1/2 top-1/2 z-40 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-white shadow-lg transition-transform hover:scale-105 hover:bg-white/25 active:scale-95 sm:h-20 sm:w-20 ${isPlaying ? 'pointer-events-none opacity-0' : 'opacity-100'} ${isLoading ? 'cursor-wait' : ''}`}
          aria-label={lang === 'ar' ? 'تشغيل الفيديو' : 'Play video'}
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin sm:h-10 sm:w-10" />
          ) : (
            <Play className="h-8 w-8 fill-current sm:h-10 sm:w-10" />
          )}
        </button>

        {currentTitle && (
          <div className="absolute left-2 top-2 z-40 max-w-[70%] sm:left-4 sm:top-4">
            <h3 dir={lang === 'ar' ? 'rtl' : 'ltr'} className="truncate rounded-lg bg-black/50 px-3 py-1.5 text-sm font-semibold text-white drop-shadow-lg sm:px-4 sm:py-2 sm:text-lg">
              {currentTitle}
            </h3>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 sm:p-4">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            isDragging={isDragging}
            onDragStart={() => { isDraggingRef.current = true; setIsDragging(true); }}
            onDragMove={setTimeState}
            onDragEnd={(value) => { isDraggingRef.current = false; setIsDragging(false); seekTo(value); }}
            onSeek={seekTo}
          />

          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-wrap items-center gap-0.5 sm:gap-1.5">
              <button type="button" onClick={seekBackward} className="control-button" aria-label={lang === 'ar' ? 'رجوع 10 ثواني' : 'Back 10 seconds'}>
                <SkipBack className="h-5 w-5" />
              </button>
              <button type="button" onClick={togglePlay} className="control-button" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <button type="button" onClick={seekForward} className="control-button" aria-label={lang === 'ar' ? 'تقدم 10 ثواني' : 'Forward 10 seconds'}>
                <SkipForward className="h-5 w-5" />
              </button>
              <span className="ml-1 whitespace-nowrap font-mono text-[11px] text-white/70 sm:ml-2 sm:text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1.5">
              <QualityControl 
                currentQuality={currentQuality} 
                onQualityChange={changeQuality} 
                availableQualities={DEFAULT_QUALITIES} 
                lang={lang} 
              />

              <button 
                type="button" 
                onClick={toggleCaptions} 
                className={`control-button ${captionsEnabled ? 'bg-white/25 text-white' : ''}`} 
                aria-label={lang === 'ar' ? 'تشغيل أو إيقاف الترجمة' : 'Toggle captions'} 
                aria-pressed={captionsEnabled}
              >
                <Captions className="h-5 w-5" />
              </button>

              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => setShowSpeedMenu((value) => !value)} 
                  className="control-button" 
                  aria-label={lang === 'ar' ? 'تغيير السرعة' : 'Change speed'}
                >
                  <span className="text-xs font-medium sm:text-sm">{playbackSpeed}x</span>
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
                className="control-button" 
                aria-label={lang === 'ar' ? 'تكبير الشاشة' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-20 opacity-20">
        <Shield className="h-6 w-6 text-white" />
      </div>

      {videoError && (
        <VideoError 
          lang={lang} 
          onRetry={() => {
            retryCountRef.current = 0;
            retryInit();
          }} 
        />
      )}

      <style>{`
        .video-protected * { -webkit-touch-callout: none; }
        .video-protected iframe { 
          display: block; 
          border: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }
        .control-button {
          display: inline-flex;
          min-width: 44px;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          color: white;
          transition: background-color 150ms ease, transform 150ms ease;
          touch-action: manipulation;
          background: transparent;
          border: none;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .control-button:hover { background: rgba(255,255,255,.10); }
        .control-button:active { background: rgba(255,255,255,.20); transform: scale(.95); }
        
        @media (max-width: 768px) {
          .video-protected button { 
            min-width: 44px; 
            min-height: 44px;
          }
          .video-protected .control-button {
            min-width: 40px;
            min-height: 40px;
          }
        }
        
        @supports (-webkit-touch-callout: none) {
          .video-protected iframe {
            width: 100% !important;
            height: 100% !important;
          }
        }
      `}</style>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;