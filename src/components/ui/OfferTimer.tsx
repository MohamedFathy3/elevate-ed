// components/ui/OfferTimer.tsx

import { useEffect, useState } from "react";
import { Clock, Timer, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OfferTimerProps {
  startDate: string;
  endDate: string;
  lang: string;
  isDark?: boolean;
  isNature?: boolean;
  compact?: boolean; // ✅ عرض مصغر
  showIcon?: boolean; // ✅ إظهار/إخفاء الأيقونة
  className?: string; // ✅ تخصيص إضافي
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
  isExpired: boolean;
  isUpcoming: boolean;
}

const useOfferTimer = ({ startDate, endDate }: { startDate: string; endDate: string }): TimeLeft => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isActive: false,
    isExpired: false,
    isUpcoming: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      // العرض لم يبدأ بعد
      if (now < start) {
        const diff = start - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isActive: false,
          isExpired: false,
          isUpcoming: true,
        });
        return;
      }

      // العرض انتهى
      if (now > end) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isActive: false,
          isExpired: true,
          isUpcoming: false,
        });
        return;
      }

      // العرض نشط
      const diff = end - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isActive: true,
        isExpired: false,
        isUpcoming: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return timeLeft;
};

export const OfferTimerDisplay = ({ 
  startDate, 
  endDate, 
  lang, 
  isDark = false, 
  isNature = false,
  compact = false,
  showIcon = true,
  className = ""
}: OfferTimerProps) => {
  const timer = useOfferTimer({ startDate, endDate });

  // ✅ حالة: العرض انتهى
  if (timer.isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-1 px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-medium ${className}`}
      >
        <AlertCircle className="w-3 h-3" />
        <span>{lang === "ar" ? "انتهى" : "Expired"}</span>
      </motion.div>
    );
  }

  // ✅ حالة: العرض لم يبدأ بعد
  if (timer.isUpcoming) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-medium ${className}`}
      >
        {showIcon && <Clock className="w-3 h-3" />}
        <span>{lang === "ar" ? "يبدأ" : "Starts"}</span>
        <span className="font-mono font-bold">
          {timer.days > 0 && `${timer.days}d `}
          {timer.hours > 0 && `${timer.hours}h `}
          {!compact && timer.minutes > 0 && `${timer.minutes}m`}
        </span>
      </motion.div>
    );
  }

  // ❌ العرض غير نشط
  if (!timer.isActive) return null;

  // ✅ العرض نشط - عرض المؤقت التنازلي
  const formatNumber = (num: number) => String(num).padStart(2, '0');

  // ✅ نسخة مدمجة (compact)
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-medium shadow-lg ${className}`}
      >
        {showIcon && <Timer className="w-3 h-3 animate-pulse" />}
        <span className="font-mono font-bold flex items-center gap-0.5">
          {timer.days > 0 && (
            <>
              <span className="bg-white/20 px-1 rounded">{formatNumber(timer.days)}</span>
              <span>d</span>
            </>
          )}
          <span className="bg-white/20 px-1 rounded">{formatNumber(timer.hours)}</span>
          <span>:</span>
          <span className="bg-white/20 px-1 rounded">{formatNumber(timer.minutes)}</span>
          <span>:</span>
          <span className="bg-white/20 px-1 rounded">{formatNumber(timer.seconds)}</span>
        </span>
      </motion.div>
    );
  }

  // ✅ نسخة كاملة
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-medium shadow-lg ${className}`}
    >
      {showIcon && <Timer className="w-4 h-4 animate-pulse" />}
      <span>{lang === "ar" ? "ينتهي" : "Ends"}</span>
      <div className="flex items-center gap-0.5 font-mono font-bold">
        {timer.days > 0 && (
          <>
            <span className="bg-white/20 px-1.5 py-0.5 rounded">{formatNumber(timer.days)}</span>
            <span>d</span>
          </>
        )}
        <span className="bg-white/20 px-1.5 py-0.5 rounded">{formatNumber(timer.hours)}</span>
        <span>:</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded">{formatNumber(timer.minutes)}</span>
        <span>:</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded">{formatNumber(timer.seconds)}</span>
      </div>
    </motion.div>
  );
};

// ✅ Export افتراضي
export default OfferTimerDisplay;