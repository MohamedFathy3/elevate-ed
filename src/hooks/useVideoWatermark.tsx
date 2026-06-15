/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useVideoWatermark.tsx
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseVideoWatermarkProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  studentName: string;
  studentId: number;
  enabled?: boolean;
}

export const useVideoWatermark = ({
  videoRef,
  studentName,
  studentId,
  enabled = true,
}: UseVideoWatermarkProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const detectionCount = useRef(0);

  // ✅ كشف محاولة تسجيل الشاشة
  const detectScreenRecording = useCallback(() => {
    // طريقة 1: كشف التغير في سطوع الشاشة
    const testDiv = document.createElement('div');
    testDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100px;
      height: 100px;
      background-color: rgb(128, 128, 128);
      opacity: 0;
      pointer-events: none;
      z-index: -9999;
    `;
    document.body.appendChild(testDiv);

    const checkBrightness = () => {
      if (!enabled) return;
      
      try {
        const color = window.getComputedStyle(testDiv).backgroundColor;
        const rgb = color.match(/\d+/g);
        
        if (rgb && rgb.length >= 3) {
          const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
          
          if (Math.abs(brightness - 128) > 50) {
            detectionCount.current++;
            if (detectionCount.current >= 3) {
              setIsRecording(true);
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.style.filter = 'blur(20px)';
              }
              detectionCount.current = 0;
            }
          } else {
            detectionCount.current = Math.max(0, detectionCount.current - 1);
          }
        }
      } catch (e) {}
      
      requestAnimationFrame(checkBrightness);
    };
    
    checkBrightness();
    
    return () => {
      if (testDiv && testDiv.parentNode) {
        testDiv.parentNode.removeChild(testDiv);
      }
    };
  }, [enabled, videoRef]);

  // ✅ رسم العلامة المائية على الفيديو
  const drawWatermark = useCallback(() => {
    const video = videoRef.current;
    if (!video || !enabled || isRecording) return;

    // إنشاء canvas إذا لم يكن موجوداً
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '10';
      canvasRef.current = canvas;
      
      const parent = video.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.appendChild(canvas);
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // تحديث حجم canvas
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ✅ علامة مائية في الزاوية
    const watermarkText = `${studentName} | ID: ${studentId} | ${new Date().toLocaleDateString('ar-EG')}`;
    ctx.font = `${Math.max(12, canvas.width / 80)}px monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 2;
    ctx.shadowColor = 'black';
    ctx.fillText(watermarkText, 10, canvas.height - 15);
    
    // ✅ علامة مائية متحركة في المنتصف (شفافة)
    const time = Date.now() / 1000;
    const x = canvas.width / 2 + Math.sin(time) * 30;
    const y = canvas.height / 2 + Math.cos(time * 0.7) * 20;
    
    ctx.font = `bold ${Math.max(24, canvas.width / 20)}px monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.shadowBlur = 0;
    ctx.fillText(watermarkText, x - 150, y);
    
    ctx.font = `${Math.max(14, canvas.width / 60)}px monospace`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillText(watermarkText, 20, 40);
    
    animationRef.current = requestAnimationFrame(drawWatermark);
  }, [videoRef, enabled, isRecording, studentName, studentId]);

  // ✅ مراقبة Fullscreen وتحديث حجم الـ canvas
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (canvasRef.current && videoRef.current) {
        setTimeout(() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.clientWidth;
            canvasRef.current.height = videoRef.current.clientHeight;
          }
        }, 100);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [videoRef]);

  // ✅ تفعيل الكشف والحماية
  useEffect(() => {
    if (!enabled) return;
    
    const cleanupDetection = detectScreenRecording();
    
    if (videoRef.current) {
      videoRef.current.addEventListener('play', () => {
        if (!isRecording) {
          drawWatermark();
        }
      });
    }
    
    return () => {
      cleanupDetection();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [enabled, detectScreenRecording, drawWatermark, videoRef, isRecording]);

  // ✅ عند اكتشاف تسجيل، نظهر رسالة
  useEffect(() => {
    if (isRecording && videoRef.current) {
      videoRef.current.pause();
      // إظهار رسالة للمستخدم
      const messageDiv = document.createElement('div');
      messageDiv.id = 'recording-warning';
      messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 20px 40px;
        border-radius: 16px;
        font-family: monospace;
        text-align: center;
        backdrop-filter: blur(10px);
        border: 2px solid red;
      `;
      messageDiv.innerHTML = `
        <h2>⚠️ تم اكتشاف تسجيل للشاشة</h2>
        <p>يرجى إيقاف أي برنامج تسجيل لمتابعة الفيديو</p>
        <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 24px; background: red; border: none; border-radius: 8px; color: white; cursor: pointer;">
          إعادة تحميل الصفحة
        </button>
      `;
      document.body.appendChild(messageDiv);
    }
    
    return () => {
      const msg = document.getElementById('recording-warning');
      if (msg) msg.remove();
    };
  }, [isRecording, videoRef]);

  return { isRecording };
};