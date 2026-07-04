/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAdvancedProtection.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from './use-toast';

interface UseAdvancedProtectionProps {
  enabled?: boolean;
  onDetect?: () => void;
  blurIntensity?: string;
  showBlueScreen?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  sensitivity?: 'low' | 'medium' | 'high';
  preventDevTools?: boolean;
  preventExternalLinks?: boolean;
  enabledOnMount?: boolean;
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
  sensitivity = 'medium',
  preventDevTools = false,
  preventExternalLinks = false,
  enabledOnMount = false,
}: UseAdvancedProtectionProps = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showBlocker, setShowBlocker] = useState(false);
  const [isActive, setIsActive] = useState(enabledOnMount);
  const detectionCount = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const rafRef = useRef<number>();
  const lastFrameTime = useRef(performance.now());
  const lastWidth = useRef(window.innerWidth);
  const lastHeight = useRef(window.innerHeight);
  const screenshotPreventionRef = useRef<any>(null);

  const sensitivityValues = {
    low: { frameThreshold: 200, frameCount: 5, resizeThreshold: 150, resizeCount: 3, hiddenCount: 3 },
    medium: { frameThreshold: 150, frameCount: 3, resizeThreshold: 100, resizeCount: 2, hiddenCount: 2 },
    high: { frameThreshold: 100, frameCount: 2, resizeThreshold: 50, resizeCount: 1, hiddenCount: 1 },
  };

  const settings = sensitivityValues[sensitivity];

  // ✅ دالة تفعيل الحماية
  const activate = useCallback(() => {
    setIsActive(true);
    console.log('🛡️ الحماية مفعلة');
  }, []);

  // ✅ دالة إلغاء الحماية
  const deactivate = useCallback(() => {
    setIsActive(false);
    setIsRecording(false);
    setShowBlocker(false);
    detectionCount.current = 0;
    console.log('🛡️ الحماية غير مفعلة');
  }, []);

  const triggerDetection = useCallback(() => {
    if (isRecording || showBlocker || !isActive) return;
    
    console.warn('🚨 محاولة اختراق detected!');
    setIsRecording(true);
    setShowBlocker(true);
    
    if (videoRef?.current) {
      videoRef.current.pause();
    }
    
    onDetect?.();
  }, [isRecording, showBlocker, isActive, onDetect, videoRef]);

  // ✅ 1. منع DevTools (يعمل بس لما الحماية مفعلة)
  const setupDevToolsBlocker = useCallback(() => {
    if (!enabled || !preventDevTools || !isActive) return;

    console.log('🛡️ DevTools Blocker Active');

    const handleKeyDown = (e: KeyboardEvent) => {
      // ✅ F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        console.warn('🚫 F12 blocked');
        triggerDetection();
        return false;
      }
      
      // ✅ Ctrl+Shift+I (Inspector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        e.stopPropagation();
        console.warn('🚫 Ctrl+Shift+I blocked');
        triggerDetection();
        return false;
      }
      
      // ✅ Ctrl+Shift+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        e.stopPropagation();
        console.warn('🚫 Ctrl+Shift+J blocked');
        triggerDetection();
        return false;
      }
      
      // ✅ Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        console.warn('🚫 Ctrl+U blocked');
        triggerDetection();
        return false;
      }
      
      // ✅ Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        e.stopPropagation();
        console.warn('🚫 Ctrl+S blocked');
        triggerDetection();
        return false;
      }
      
      // ✅ Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        e.stopPropagation();
        console.warn('🚫 Ctrl+P blocked');
        triggerDetection();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, preventDevTools, isActive, triggerDetection]);

  // ✅ 2. منع Context Menu
  const setupContextMenuBlocker = useCallback(() => {
    if (!enabled || !isActive) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.warn('🚫 Context Menu blocked');
      triggerDetection();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [enabled, isActive, triggerDetection]);

  // ✅ 3. كشف DevTools عن طريق تغيير الحجم
  const setupDevToolsDetection = useCallback(() => {
    if (!enabled || !preventDevTools || !isActive) return;

    console.log('🛡️ DevTools Detection Active');

    let devToolsOpen = false;
    const threshold = 160;
    let checkCount = 0;

    const checkDevTools = () => {
      const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
      const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
      
      // ✅ إذا كان الفرق كبير => DevTools مفتوحة
      if (widthDiff > threshold || heightDiff > threshold) {
        checkCount++;
        if (checkCount >= 2 && !devToolsOpen) {
          devToolsOpen = true;
          console.warn('🚨 DevTools detected via size!');
          triggerDetection();
        }
      } else {
        checkCount = 0;
        devToolsOpen = false;
      }
    };

    // ✅ كل ثانية نتحقق
    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, [enabled, preventDevTools, isActive, triggerDetection]);

  // ✅ 4. منع الروابط الخارجية
  const setupExternalLinkBlocker = useCallback(() => {
    if (!enabled || !preventExternalLinks || !isActive) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      const isVideoLink = 
        href.includes('youtube.com') ||
        href.includes('youtu.be') ||
        href.includes('vimeo.com') ||
        href.includes('player.vimeo.com');
      
      if (isVideoLink) {
        e.preventDefault();
        e.stopPropagation();
        console.warn('🚫 Video link blocked:', href);
        triggerDetection();
        return false;
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, [enabled, preventExternalLinks, isActive, triggerDetection]);

  // ✅ 5. منع Copy/Paste
  const setupCopyPasteBlocker = useCallback(() => {
    if (!enabled || !isActive) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerDetection();
      return false;
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerDetection();
      return false;
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [enabled, isActive, triggerDetection]);

  // ✅ تفعيل جميع طرق الكشف
  useEffect(() => {
    if (!enabled) return;

    const cleanupDevTools = setupDevToolsBlocker();
    const cleanupContextMenu = setupContextMenuBlocker();
    const cleanupDevToolsDetection = setupDevToolsDetection();
    const cleanupExternalLinks = setupExternalLinkBlocker();
    const cleanupCopyPaste = setupCopyPasteBlocker();
    
    return () => {
      cleanupDevTools?.();
      cleanupContextMenu?.();
      cleanupDevToolsDetection?.();
      cleanupExternalLinks?.();
      cleanupCopyPaste?.();
      
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, isActive, setupDevToolsBlocker, setupContextMenuBlocker, setupDevToolsDetection, setupExternalLinkBlocker, setupCopyPasteBlocker]);

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
          ⚠️ تم اكتشاف محاولة اختراق
        </h2>
        <p className="text-white/80 text-base mb-6">
          تم منع محاولة فتح أدوات المطور أو تسجيل الشاشة. لحماية المحتوى التعليمي، تم إيقاف العرض.
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

  return {
    isRecording,
    BlueScreen,
    resetProtection,
    activate,
    deactivate,
  };
};

export default useAdvancedProtection;