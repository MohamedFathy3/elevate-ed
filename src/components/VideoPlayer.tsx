/* eslint-disable @typescript-eslint/no-explicit-any */
// components/VideoPlayer.tsx
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Play, AlertCircle, Lock, FileQuestion, Shield, XCircle } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { useAdvancedProtection } from '@/hooks/useScreenRecorderProtection';
import { toast  } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  videoUrl?: string;
  title?: string;
  studentName?: string;
  studentId?: number;
  isLocked?: boolean;
  requiredExam?: any;
  onStartExam?: () => void;
  poster?: string;
  parts?: Array<{
    id: number;
    title: string;
    title_ar: string;
    videoUrl: string;
    imageUrl?: string;
  }>;
  onPartChange?: (index: number) => void;
  selectedPartIndex?: number;
}

export interface VideoPlayerRef {
  pause: () => void;
  play: () => void;
  seekTo: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  videoUrl,
  title,
  studentName,
  studentId,
  isLocked = false,
  requiredExam,
  onStartExam,
  poster,
  parts = [],
  onPartChange,
  selectedPartIndex = 0,
}, ref) => {
  const { lang } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [currentPart, setCurrentPart] = useState(selectedPartIndex);
  const [showBlockScreen, setShowBlockScreen] = useState(false);
  
  // ✅ استخدام الحماية المتقدمة
  const { BlueScreen, ProtectedContent, isRecording, resetProtection } = useAdvancedProtection({
    enabled: true,
    videoRef: videoRef,
    onDetect: () => {
      console.warn("🚨 Screen recording detected! Hiding content...");
      setShowBlockScreen(true);
      toast.error(
        lang === "ar" 
          ? "⚠️ تم اكتشاف محاولة تسجيل للشاشة! تم إيقاف عرض المحتوى."
          : "⚠️ Screen recording detected! Content has been blocked."
      );
    }
  });
  
  // ✅ التحقق من صحة الرابط
  const isValidUrl = videoUrl && videoUrl !== 'You must pass the exam first';
  const isYouTube = isValidUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl) : null;
  
  function getYouTubeEmbedUrl(url: string) {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return url;
  }
  
  // ✅ Expose methods to parent
  useImperativeHandle(ref, () => ({
    pause: () => {
      if (videoRef.current) videoRef.current.pause();
    },
    play: () => {
      if (videoRef.current && !showBlockScreen && !isLocked) videoRef.current.play();
    },
    seekTo: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    },
  }));
  
  // ✅ تغيير الجزء
  const handlePartChange = (index: number) => {
    setCurrentPart(index);
    setVideoError(false);
    if (onPartChange) onPartChange(index);
  };
  
  // ✅ الحصول على الفيديو الحالي
  const currentVideoUrl = parts[currentPart]?.videoUrl || videoUrl;
  const currentTitle = parts[currentPart] 
    ? (lang === 'ar' ? parts[currentPart].title_ar : parts[currentPart].title)
    : title;
  
  // ✅ إذا تم اكتشاف تسجيل شاشة
  if (showBlockScreen || isRecording) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-video bg-gradient-to-br from-red-600 to-red-800 rounded-2xl overflow-hidden shadow-card"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-pulse">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            ⚠️ {lang === "ar" ? "تم اكتشاف تسجيل للشاشة!" : "Screen Recording Detected!"}
          </h3>
          <p className="text-white/80 text-sm mb-6 max-w-md">
            {lang === "ar" 
              ? "تم إيقاف عرض المحتوى لحمايته من التسجيل. يرجى إيقاف أي برنامج تسجيل شاشة وإعادة تحميل الصفحة."
              : "Content has been blocked to prevent recording. Please stop any screen recording software and refresh the page."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-white text-red-600 font-semibold hover:bg-gray-100 transition-all"
            >
              {lang === "ar" ? "إعادة تحميل الصفحة" : "Refresh Page"}
            </button>
            <button
              onClick={() => {
                setShowBlockScreen(false);
                resetProtection();
              }}
              className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
            >
              {lang === "ar" ? "محاولة مرة أخرى" : "Try Again"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // ✅ باقي الكود زي ما هو...
  // (إذا كان مقفول، يوتيوب، MP4، إلخ)
  
  // ✅ إذا كان مقفول
  if (isLocked) {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-card">
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Lock className="w-20 h-20 text-white/30 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {lang === "ar" ? "هذا الدرس مقفل" : "This lesson is locked"}
          </h3>
          <p className="text-white/60 text-sm mb-6 max-w-md">
            {lang === "ar" 
              ? "يجب اجتياز الامتحان التالي لفتح هذا الدرس"
              : "You must pass the following exam to unlock this lesson"}
          </p>
          {requiredExam && (
            <button
              onClick={onStartExam}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <FileQuestion className="w-4 h-4" />
              {lang === "ar" ? "ابدأ الامتحان" : "Start Exam"}
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // ✅ إذا كان الفيديو يوتيوب
  if (isYouTube && embedUrl) {
    return (
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card">
        <iframe
          key={embedUrl}
          src={embedUrl}
          className="w-full h-full"
          title={currentTitle}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onError={() => setVideoError(true)}
        />
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white p-4">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
              <p>{lang === "ar" ? "عذراً، لا يمكن تحميل الفيديو" : "Sorry, cannot load video"}</p>
              <a 
                href={currentVideoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-block px-4 py-2 rounded-lg bg-primary text-white text-sm"
              >
                {lang === "ar" ? "فتح على يوتيوب" : "Open on YouTube"}
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // ✅ إذا كان الفيديو MP4 محلي
  if (currentVideoUrl && !isYouTube) {
    return (
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card">
        <video
          ref={videoRef}
          src={currentVideoUrl}
          className="w-full h-full"
          controls
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
          poster={poster}
          playsInline
        >
          <source src={currentVideoUrl} type="video/mp4" />
          {lang === "ar" ? "متصفحك لا يدعم تشغيل الفيديو" : "Your browser does not support the video tag."}
        </video>
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white p-4">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
              <p>{lang === "ar" ? "عذراً، لا يمكن تحميل الفيديو" : "Sorry, cannot load video"}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
      <Play className="w-16 h-16 text-primary" />
      <p className="text-foreground/60 mt-4">{lang === "ar" ? "لا يوجد محتوى" : "No content available"}</p>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;