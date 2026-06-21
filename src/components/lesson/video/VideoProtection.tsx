// components/video/VideoProtection.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useAdvancedProtection } from '@/hooks/useScreenRecorderProtection';
import { toast } from '@/hooks/use-toast';
import { useLang } from '@/i18n/LanguageContext';

interface VideoProtectionProps {
  children: React.ReactNode;
}

export const VideoProtection = ({ children }: VideoProtectionProps) => {
  const { lang } = useLang();
  const [showBlockScreen, setShowBlockScreen] = useState(false);
  
  const { BlueScreen, isRecording, resetProtection } = useAdvancedProtection({
    enabled: true,
    onDetect: () => {
      console.warn("🚨 Screen recording detected!");
      setShowBlockScreen(true);
      toast.error(
        lang === "ar" 
          ? "⚠️ تم اكتشاف محاولة تسجيل للشاشة!"
          : "⚠️ Screen recording detected!"
      );
    }
  });

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
              ? "تم إيقاف عرض المحتوى لحمايته من التسجيل."
              : "Content has been blocked to prevent recording."}
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

  return <>{BlueScreen}{children}</>;
};