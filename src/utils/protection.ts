// utils/protection.ts

// 🛡️ منع F12 و Developer Tools و Ctrl+U و Ctrl+S
export const disableDevTools = () => {
  // منع F12 و Ctrl+Shift+I و Ctrl+Shift+J و Ctrl+U
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      alert('⛔ Developer tools are disabled on this site!');
      return false;
    }
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      alert('⛔ Inspect element is disabled!');
      return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      alert('⛔ Console is disabled!');
      return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      alert('⛔ View source is disabled!');
      return false;
    }
    // Ctrl+S (Save)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      alert('⛔ Saving is disabled!');
      return false;
    }
    // Ctrl+P (Print)
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      alert('⛔ Printing is disabled!');
      return false;
    }
  });

  // منع الـ context menu (right click)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // منع drag and drop للصور والفيديوهات
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
      return false;
    }
  });
};

// 🛡️ اكتشاف screen recording
export const detectScreenRecording = (callback?: (isRecording: boolean) => void) => {
  let isRecording = false;
  
  // استخدام visibility API
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isRecording) {
      isRecording = true;
      console.log('⚠️ Screen recording detected!');
      if (callback) callback(true);
    } else if (!document.hidden && isRecording) {
      isRecording = false;
      if (callback) callback(false);
    }
  });

  // استخدام window focus/blur
  window.addEventListener('blur', () => {
    if (!isRecording) {
      isRecording = true;
      console.log('⚠️ Possible screen capture detected!');
      if (callback) callback(true);
    }
  });
  
  window.addEventListener('focus', () => {
    if (isRecording) {
      isRecording = false;
      if (callback) callback(false);
    }
  });

  return () => {
    window.removeEventListener('blur', () => {});
    window.removeEventListener('focus', () => {});
  };
};

// 🛡️ حماية Beyck - كشف debugging
export const enableBeyckProtection = () => {
  if (typeof window === 'undefined') return;
  void import('beyck').then((module) => {
    const Beyck = (module as any).default || (module as any);
    if (typeof Beyck === 'function') {
      Beyck((app: any) => {
      // عند اكتشاف debugging، قفل الفيديو
      app.defend((state: boolean) => {
        if (state) {
          console.log('⚠️ Debugging tool detected!');
          // إخفاء الفيديوهات
          const videos = document.querySelectorAll('video');
          videos.forEach((video: HTMLVideoElement) => {
            video.style.filter = 'blur(20px)';
            video.pause();
          });
        } else {
          const videos = document.querySelectorAll('video');
          videos.forEach((video: HTMLVideoElement) => {
            video.style.filter = 'none';
          });
        }
      });
      });
    }
  }).catch(() => undefined);
};

// 🛡️ حماية إضافية: تعطيل صورة في صورة (Picture in Picture)
export const disablePictureInPicture = (videoElement: HTMLVideoElement) => {
  videoElement.disablePictureInPicture = true;
  
  // منع حدث دخول الـ Picture in Picture
  videoElement.addEventListener('enterpictureinpicture', (e) => {
    e.preventDefault();
    videoElement.exitPictureInPicture();
  });
};

// 🛡️ حماية إضافية: منع تحميل الفيديو
export const preventVideoDownload = (videoElement: HTMLVideoElement) => {
  // إزالة attribute controls عشان ما يظهرش زر التحميل
  videoElement.controls = true;
  
  // منع حفظ الفيديو عبر context menu (تم منعه أعلاه)
  videoElement.oncontextmenu = (e) => {
    e.preventDefault();
    return false;
  };
};

// 🛡️ إخفاء مصدر الفيديو (Source Obfuscation)
export const getSecureVideoUrl = (videoId: number, token: string): string => {
  // استخدام token عشان كل request يكون معاه توكن
  return `/api/secure-video/${videoId}?token=${token}`;
};

// 🛡️ تفعيل كل الحماية
export const enableFullProtection = () => {
  disableDevTools();
  enableBeyckProtection();
  detectScreenRecording((isRecording) => {
    if (isRecording) {
      const videos = document.querySelectorAll('video');
      videos.forEach((video: HTMLVideoElement) => {
        video.style.filter = 'blur(30px)';
        video.style.opacity = '0.3';
        video.pause();
        if (video.classList) {
          video.classList.add('recording-detected');
        }
      });
    } else {
      const videos = document.querySelectorAll('video');
      videos.forEach((video: HTMLVideoElement) => {
        video.style.filter = 'none';
        video.style.opacity = '1';
        video.classList.remove('recording-detected');
      });
    }
  });
};