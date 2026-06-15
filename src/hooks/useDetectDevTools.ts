// hooks/useDetectDevTools.ts
import { useEffect, useState } from 'react';

export const useDetectDevTools = (enabled: boolean = true) => {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  // ✅ قفل كل الأزرار بما فيها زرار Windows
  const blockAllKeys = (e: KeyboardEvent) => {
    // منع تنفيذ أي حدث
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // منع زرار Windows (Meta)
    if (e.key === 'Meta' || e.key === 'OS' || e.keyCode === 91 || e.keyCode === 93) {
      return false;
    }
    
    // منع زرار Context Menu
    if (e.key === 'ContextMenu' || e.keyCode === 93) {
      return false;
    }
    
    // منع Alt
    if (e.key === 'Alt' || e.key === 'AltGraph' || e.keyCode === 18) {
      return false;
    }
    
    // منع Ctrl
    if (e.key === 'Control' || e.keyCode === 17) {
      return false;
    }
    
    // منع Shift
    if (e.key === 'Shift' || e.keyCode === 16) {
      return false;
    }
    
    // منع F1-F12
    if (e.keyCode >= 112 && e.keyCode <= 123) {
      return false;
    }
    
    // منع F5, F12
    if (e.key === 'F5' || e.key === 'F12') {
      return false;
    }
    
    return false;
  };

  // ✅ منع الأزرار على مستوى أعلى (window و document)
  const disableKeyboard = () => {
    // منع كل الأزرار
    window.onkeydown = (e) => {
      e.preventDefault();
      return false;
    };
    window.onkeyup = (e) => {
      e.preventDefault();
      return false;
    };
    document.onkeydown = (e) => {
      e.preventDefault();
      return false;
    };
    document.onkeyup = (e) => {
      e.preventDefault();
      return false;
    };
  };

  // ✅ منع الـ Context Menu
  const disableContextMenu = () => {
    document.oncontextmenu = (e) => {
      e.preventDefault();
      return false;
    };
    window.oncontextmenu = (e) => {
      e.preventDefault();
      return false;
    };
  };

  // ✅ منع الـ Drag
  const disableDrag = () => {
    document.ondragstart = (e) => {
      e.preventDefault();
      return false;
    };
    document.ondrop = (e) => {
      e.preventDefault();
      return false;
    };
  };

  // ✅ منع تحديد النص
  const disableSelection = () => {
    document.onselectstart = (e) => {
      e.preventDefault();
      return false;
    };
  };

  // ✅ منع النسخ واللصق
  const disableClipboard = () => {
    document.oncopy = (e) => {
      e.preventDefault();
      return false;
    };
    document.oncut = (e) => {
      e.preventDefault();
      return false;
    };
    document.onpaste = (e) => {
      e.preventDefault();
      return false;
    };
  };

  useEffect(() => {
    if (!enabled) return;

    // ✅ طريقة 1: event listener مع capture
    window.addEventListener('keydown', blockAllKeys, true);
    window.addEventListener('keyup', blockAllKeys, true);
    document.addEventListener('keydown', blockAllKeys, true);
    document.addEventListener('keyup', blockAllKeys, true);
    
    // ✅ طريقة 2: override الدوال مباشرة (أقوى)
    disableKeyboard();
    disableContextMenu();
    disableDrag();
    disableSelection();
    disableClipboard();
    
    // ✅ طريقة 3: CSS منع التحديد
    const style = document.createElement('style');
    style.id = 'protection-styles';
    style.innerHTML = `
      * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        -webkit-touch-callout: none !important;
        pointer-events: auto !important;
      }
      body {
        -webkit-tap-highlight-color: transparent !important;
      }
    `;
    document.head.appendChild(style);

    // ✅ كشف أدوات المطور
    const detectDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const isOpen = widthDiff > 150 || heightDiff > 150;
      
      if (isOpen && !devToolsOpen) {
        setDevToolsOpen(true);
        // إخفاء المحتوى
        const container = document.getElementById('root');
        if (container) {
          container.style.display = 'none';
        }
        alert('⚠️ تم اكتشاف أدوات المطور! يرجى إغلاقها وإعادة تحميل الصفحة.');
        window.location.reload();
      }
    };

    const interval = setInterval(detectDevTools, 1000);

    return () => {
      window.removeEventListener('keydown', blockAllKeys, true);
      window.removeEventListener('keyup', blockAllKeys, true);
      document.removeEventListener('keydown', blockAllKeys, true);
      document.removeEventListener('keyup', blockAllKeys, true);
      
      // إعادة تعيين الدوال
      window.onkeydown = null;
      window.onkeyup = null;
      document.onkeydown = null;
      document.onkeyup = null;
      document.oncontextmenu = null;
      document.ondragstart = null;
      document.ondrop = null;
      document.onselectstart = null;
      document.oncopy = null;
      document.oncut = null;
      document.onpaste = null;
      
      const styleEl = document.getElementById('protection-styles');
      if (styleEl) styleEl.remove();
      
      clearInterval(interval);
    };
  }, [enabled]);

  return { devToolsOpen };
};