// hooks/useWatermark.ts
import { useEffect, useRef, useState } from 'react';

export const useWatermark = (text: string, enabled: boolean = true) => {
  const [isReady, setIsReady] = useState(false);
  const watermarkRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !text) return;

    // ✅ تأخير إنشاء العلامة المائية حتى بعد LCP
    const initWatermark = () => {
      // استخدام requestIdleCallback لتأخير التنفيذ
      const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
      
      idleCallback(() => {
        // التحقق من وجود العلامة بالفعل
        if (document.getElementById('custom-watermark-center')) return;
        
        const watermarkDiv = document.createElement('div');
        watermarkDiv.id = 'custom-watermark-center';
        watermarkDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 48px;
          color: rgba(0, 0, 0, 0.04);
          pointer-events: none;
          z-index: 9999;
          font-weight: bold;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.5s ease;
          will-change: transform, opacity;
          font-family: Arial, sans-serif;
          letter-spacing: 2px;
        `;
        watermarkDiv.textContent = text;
        
        document.body.appendChild(watermarkDiv);
        watermarkRef.current = watermarkDiv;
        
        // ✅ ظهور تدريجي بعد التحميل
        requestAnimationFrame(() => {
          if (watermarkDiv) {
            watermarkDiv.style.opacity = '1';
          }
        });
        
        setIsReady(true);
      });
    };

    // ✅ انتظار تحميل الصفحة بالكامل
    if (document.readyState === 'complete') {
      initWatermark();
    } else {
      window.addEventListener('load', initWatermark);
      return () => window.removeEventListener('load', initWatermark);
    }
  }, [text, enabled]);

  // ✅ تنظيف العلامة المائية
  useEffect(() => {
    return () => {
      if (watermarkRef.current && watermarkRef.current.parentNode) {
        watermarkRef.current.parentNode.removeChild(watermarkRef.current);
      }
    };
  }, []);

  return { watermarkRef, isReady };
};