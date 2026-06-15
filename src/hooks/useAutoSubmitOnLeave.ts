/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAutoSubmitOnLeave.ts
import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UseAutoSubmitOnLeaveProps {
  shouldSubmit: boolean;
  onSubmit: () => void;
  delay?: number;
  onBeforeSubmit?: () => void;
  onAfterSubmit?: () => void;
}

export const useAutoSubmitOnLeave = ({
  shouldSubmit,
  onSubmit,
  delay = 500,
  onBeforeSubmit,
  onAfterSubmit,
}: UseAutoSubmitOnLeaveProps) => {
  const hasSubmitted = useRef(false);
  const isSubmitting = useRef(false);
  const submitTimeout = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const lastPathname = useRef(location.pathname);

  const safeSubmit = useCallback(() => {
    if (hasSubmitted.current || isSubmitting.current || !shouldSubmit) return;
    
    console.log('🔥 Auto-submit triggered!');
    isSubmitting.current = true;
    onBeforeSubmit?.();
    onSubmit();
    hasSubmitted.current = true;
    onAfterSubmit?.();
  }, [shouldSubmit, onSubmit, onBeforeSubmit, onAfterSubmit]);

  // 1. منع إغلاق التبويب
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldSubmit && !hasSubmitted.current && !isSubmitting.current) {
        safeSubmit();
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldSubmit, safeSubmit]);

  // 2. عند التبديل بين التبويبات
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && shouldSubmit && !hasSubmitted.current && !isSubmitting.current) {
        submitTimeout.current = setTimeout(safeSubmit, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [shouldSubmit, safeSubmit]);

  // 3. مراقبة تغيير المسار (للتنقل داخل التطبيق)
  useEffect(() => {
    if (!shouldSubmit || hasSubmitted.current || isSubmitting.current) return;
    
    if (lastPathname.current !== location.pathname) {
      console.log(`🚫 Path changed from ${lastPathname.current} to ${location.pathname}`);
      safeSubmit();
    }
    lastPathname.current = location.pathname;
  }, [location.pathname, shouldSubmit, safeSubmit]);

  // 4. منع أحداث popstate (الخلف/الأمام)
  useEffect(() => {
    const handlePopState = () => {
      if (shouldSubmit && !hasSubmitted.current && !isSubmitting.current) {
        console.log('🚫 Popstate detected (back/forward)');
        safeSubmit();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [shouldSubmit, safeSubmit]);

  // تنظيف
  useEffect(() => {
    return () => {
      if (submitTimeout.current) clearTimeout(submitTimeout.current);
    };
  }, []);

  const resetAutoSubmit = useCallback(() => {
    hasSubmitted.current = false;
    isSubmitting.current = false;
    if (submitTimeout.current) clearTimeout(submitTimeout.current);
  }, []);

  return { 
    hasSubmitted: hasSubmitted.current, 
    isSubmitting: isSubmitting.current, 
    resetAutoSubmit 
  };
};