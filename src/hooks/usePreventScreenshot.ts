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

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const control = e.ctrlKey || e.metaKey;
      const devToolsShortcut =
        e.key === 'F12' ||
        (control && e.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) ||
        (control && ['u', 's', 'p'].includes(key));

      if (devToolsShortcut) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => e.preventDefault();
    const handleSelectStart = (e: Event) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();

    const style = document.createElement('style');
    style.id = 'lesson-content-protection';
    style.textContent = `
      .lesson-content-protection,
      .lesson-content-protection * {
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('lesson-content-protection');

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.body.classList.remove('lesson-content-protection');
      document.getElementById('lesson-content-protection')?.remove();
    };
  }, [enabled]);
};