// src/components/lesson/video/hooks/useVideoProtection.ts

import { useRef, useEffect, useCallback } from 'react';
import { UNWANTED_SELECTORS } from '../VideoPlayer.utils';

export const useVideoProtection = (containerRef: React.RefObject<HTMLDivElement>) => {
  const cleanExtensions = useCallback(() => {
    if (!containerRef.current) return;

    UNWANTED_SELECTORS.forEach(selector => {
      try {
        const elements = containerRef.current!.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.nodeType === 1 && el.classList) {
            if (!el.classList.contains('play-button') && 
                !el.classList.contains('fullscreen-button') &&
                !el.classList.contains('controls-container') &&
                !el.classList.contains('progress-bar') &&
                !el.classList.contains('speed-button')) {
              el.remove();
            }
          }
        });
      } catch (e) {}
    });
  }, [containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;

    cleanExtensions();

    const timeouts = [50, 100, 200, 300, 500, 1000, 2000, 3000, 5000];
    timeouts.forEach(delay => {
      setTimeout(cleanExtensions, delay);
    });

    const interval = setInterval(cleanExtensions, 200);

    const observer = new MutationObserver(() => {
      cleanExtensions();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'id']
      });
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
      timeouts.forEach(delay => clearTimeout(delay));
    };
  }, [cleanExtensions, containerRef]);

  return { cleanExtensions };
};