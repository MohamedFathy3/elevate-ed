/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAdvancedProtection.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAdvancedProtectionProps {
  enabled?: boolean;
  onDetect?: () => void;
  blurIntensity?: string;
  showBlueScreen?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  sensitivity?: 'low' | 'medium' | 'high'; // ✅ إضافة حساسية
}

declare global {
  interface Window {
    ScreenshotPrevention: any;
  }
}

export const useAdvancedProtection = ({
  enabled = true,
  onDetect,
  blurIntensity = 'blur(40px)',
  showBlueScreen = true,
  videoRef,
  sensitivity = 'medium', // ✅ افتراضي متوسط
}: UseAdvancedProtectionProps = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showBlocker, setShowBlocker] = useState(false);
  const detectionCount = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const rafRef = useRef<number>();
  const lastFrameTime = useRef(performance.now());
  const lastWidth = useRef(window.innerWidth);
  const lastHeight = useRef(window.innerHeight);
  const screenshotPreventionRef = useRef<any>(null);

  // ✅ قيم الحساسية
  const sensitivityValues = {
    low: { frameThreshold: 200, frameCount: 5, resizeThreshold: 150, resizeCount: 3, hiddenCount: 3 },
    medium: { frameThreshold: 150, frameCount: 3, resizeThreshold: 100, resizeCount: 2, hiddenCount: 2 },
    high: { frameThreshold: 100, frameCount: 2, resizeThreshold: 50, resizeCount: 1, hiddenCount: 1 },
  };

  const settings = sensitivityValues[sensitivity];

  // ✅ دالة التنبيه عند الاكتشاف
  const triggerDetection = useCallback(() => {
    if (isRecording || showBlocker) return;
    
    console.warn('🚨 Screen recording detected!');
    setIsRecording(true);
    setShowBlocker(true);
    
    if (videoRef?.current) {
      videoRef.current.pause();
    }
    
    onDetect?.();
  }, [isRecording, showBlocker, onDetect, videoRef]);

  // ✅ 1. تفعيل مكتبة screenshot-prevention (بتقليل الحساسية)
  const setupScreenshotPrevention = useCallback(() => {
    if (!enabled || screenshotPreventionRef.current) return;

    try {
      if (typeof window !== 'undefined' && window.ScreenshotPrevention) {
        // ✅ نعطل المكتبة لأنها بتسبب false positives كتير
        // screenshotPreventionRef.current = new window.ScreenshotPrevention({...});
        console.log('⚠️ Screenshot Prevention disabled to avoid false positives');
      }
    } catch (error) {
      console.warn('Screenshot Prevention failed:', error);
    }
  }, [enabled]);

  // ✅ 2. كشف هبوط الفريمات (بحساسية أقل)
  const setupFrameRateDetection = useCallback(() => {
    if (!enabled) return;

    const checkFrameRate = () => {
      const now = performance.now();
      const delta = now - lastFrameTime.current;
      
      if (delta > settings.frameThreshold) {
        detectionCount.current++;
        if (detectionCount.current >= settings.frameCount) {
          triggerDetection();
        }
      } else {
        detectionCount.current = Math.max(0, detectionCount.current - 1);
      }
      
      lastFrameTime.current = now;
      rafRef.current = requestAnimationFrame(checkFrameRate);
    };

    lastFrameTime.current = performance.now();
    rafRef.current = requestAnimationFrame(checkFrameRate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, triggerDetection, settings]);

  // ✅ 3. كشف تغير حجم الشاشة (بحساسية أقل)
  const setupResizeDetection = useCallback(() => {
    if (!enabled) return;

    let resizeCount = 0;
    let lastResizeTime = 0;

    const checkResize = () => {
      const widthDiff = Math.abs(window.innerWidth - lastWidth.current);
      const heightDiff = Math.abs(window.innerHeight - lastHeight.current);
      const now = Date.now();
      
      if (widthDiff > settings.resizeThreshold || heightDiff > settings.resizeThreshold) {
        if (now - lastResizeTime < 500) {
          resizeCount++;
          if (resizeCount >= settings.resizeCount) {
            triggerDetection();
          }
        } else {
          resizeCount = 1;
        }
        lastResizeTime = now;
      } else {
        resizeCount = Math.max(0, resizeCount - 1);
      }
      
      lastWidth.current = window.innerWidth;
      lastHeight.current = window.innerHeight;
    };

    intervalRef.current = setInterval(checkResize, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, triggerDetection, settings]);

  // ✅ 4. كشف مغادرة الصفحة (بحساسية أقل)
  const setupVisibilityDetection = useCallback(() => {
    if (!enabled) return;

    let hiddenCount = 0;
    let lastHiddenTime = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const now = Date.now();
        if (now - lastHiddenTime < 1000) {
          hiddenCount++;
          if (hiddenCount >= settings.hiddenCount) {
            triggerDetection();
          }
        } else {
          hiddenCount = 1;
        }
        lastHiddenTime = now;
      } else {
        hiddenCount = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, triggerDetection, settings]);

  // ✅ 5. منع الكيبورد
  const setupKeyboardBlocker = useCallback(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        triggerDetection();
        return false;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        triggerDetection();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        triggerDetection();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        triggerDetection();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        triggerDetection();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        triggerDetection();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, triggerDetection]);

  // ✅ 6. منع Context Menu
  const setupContextMenuBlocker = useCallback(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [enabled]);

  // ✅ 7. تعطيل Screen Capture Detection (عشان بتطلب الإذن)
  const setupScreenCaptureDetection = useCallback(() => {
    // ❌ معطل تماماً عشان ما يطلبش الإذن
    console.log('✅ Screen Capture Detection disabled to avoid permission popup');
    return () => {};
  }, []);

  // ✅ تفعيل جميع طرق الكشف
  useEffect(() => {
    if (!enabled) return;

    setupScreenshotPrevention();
    
    const cleanupFrameRate = setupFrameRateDetection();
    const cleanupResize = setupResizeDetection();
    const cleanupVisibility = setupVisibilityDetection();
    const cleanupKeyboard = setupKeyboardBlocker();
    const cleanupContextMenu = setupContextMenuBlocker();
    const cleanupScreenCapture = setupScreenCaptureDetection();
    
    return () => {
      if (screenshotPreventionRef.current?.destroy) {
        screenshotPreventionRef.current.destroy();
      }
      
      cleanupFrameRate?.();
      cleanupResize?.();
      cleanupVisibility?.();
      cleanupKeyboard?.();
      cleanupContextMenu?.();
      cleanupScreenCapture?.();
      
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, setupScreenshotPrevention, setupFrameRateDetection, setupResizeDetection, setupVisibilityDetection, setupKeyboardBlocker, setupContextMenuBlocker, setupScreenCaptureDetection]);

  // ✅ إعادة تعيين الحماية
  const resetProtection = useCallback(() => {
    setIsRecording(false);
    setShowBlocker(false);
    detectionCount.current = 0;
  }, []);

  // ✅ مكون الشاشة الزرقاء
  const BlueScreen = showBlueScreen && showBlocker ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-red-700 via-red-600 to-red-800">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          ⚠️ تم اكتشاف محاولة تسجيل أو تصوير
        </h2>
        <p className="text-white/80 text-base mb-6">
          لحماية المحتوى التعليمي، تم إيقاف عرض الفيديو. يرجى إغلاق أي برنامج تسجيل شاشة أو أدوات تطوير.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-white text-red-600 font-semibold hover:bg-gray-100 transition-all"
          >
            إعادة تحميل الصفحة
          </button>
          <button
            onClick={resetProtection}
            className="px-6 py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
          >
            محاولة مرة أخرى
          </button>
        </div>
        <p className="text-white/50 text-xs mt-6">
          هذا المحتوى محمي بموجب حقوق الملكية الفكرية
        </p>
      </div>
    </div>
  ) : null;

  // ✅ مكون المحتوى المحمي
  const ProtectedContent = ({ children }: { children: React.ReactNode }) => (
    <div
      className="transition-all duration-300"
      style={{
        filter: isRecording ? blurIntensity : 'none',
        pointerEvents: isRecording ? 'none' : 'auto',
        userSelect: isRecording ? 'none' : 'auto',
      }}
    >
      {children}
    </div>
  );

  return {
    isRecording,
    BlueScreen,
    resetProtection,
    ProtectedContent,
  };
};

export default useAdvancedProtection;