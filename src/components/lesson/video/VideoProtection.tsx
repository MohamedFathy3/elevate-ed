// components/video/VideoProtection.tsx
import React, { useEffect, useRef } from 'react';

interface VideoProtectionProps {
  children: React.ReactNode;
}

export const VideoProtection: React.FC<VideoProtectionProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ✅ منع فتح الروابط من داخل الإطار
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // ✅ منع أي محاولة للخروج من الإطار
      if (target.closest('iframe') || target.closest('a')) {
        e.preventDefault();
        e.stopPropagation();
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

    // ✅ منع النقر بزر الماوس الأيمن
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('iframe')) {
        e.preventDefault();
        return false;
      }
    };

    container.addEventListener('click', handleClick, true);
    container.addEventListener('dragstart', handleDragStart, true);
    container.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      container.removeEventListener('click', handleClick, true);
      container.removeEventListener('dragstart', handleDragStart, true);
      container.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {children}
    </div>
  );
};