// hooks/usePreventScreenshot.ts
import { useEffect } from 'react';

export const usePreventScreenshot = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    // منع قائمة السياق (يمين الفأرة)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // منع Print Screen (على قد ما يمكن)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('❌ تم منع تصوير الشاشة حفاظاً على حقوق الملكية الفكرية');
        return false;
      }
      
      // منع Ctrl+P (طباعة)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('❌ تم منع طباعة الصفحة');
        return false;
      }
      
      // منع Ctrl+S (حفظ)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert('❌ تم منع حفظ الصفحة');
        return false;
      }
      
      // منع Ctrl+Shift+I (developer tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // منع F12 (developer tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]);
};