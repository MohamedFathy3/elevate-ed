// hooks/useDetectDevTools.ts
import { useEffect, useState } from 'react';

export const useDetectDevTools = (enabled: boolean = true) => {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const checkDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      const isOpen = widthDiff > threshold || heightDiff > threshold;
      
      if (isOpen !== devToolsOpen) {
        setDevToolsOpen(isOpen);
        if (isOpen) {
          alert('⚠️ يرجى إغلاق أدوات المطور لمتابعة المحتوى');
        }
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    checkDevTools();

    return () => clearInterval(interval);
  }, [enabled, devToolsOpen]);

  return { devToolsOpen };
};