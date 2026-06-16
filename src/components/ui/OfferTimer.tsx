// components/ui/OfferTimer.tsx

import { useEffect, useState } from "react";
import {
  Clock,
  AlertCircle,
  Timer,
  Sparkles,
  Crown,
  Zap,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";

interface OfferTimerProps {
  startDate: string;
  endDate: string;
  lang: string;
  className?: string;
  showIcon?: boolean;
  variant?: "red" | "purple" | "gold" | "blue" | "green";
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

const VARIANTS = {
  red: {
    gradient:
      "from-red-500 via-rose-500 to-orange-500",
    shadow: "shadow-red-500/30",
  },
  purple: {
    gradient:
      "from-purple-500 via-fuchsia-500 to-pink-500",
    shadow: "shadow-purple-500/30",
  },
  gold: {
    gradient:
      "from-amber-400 via-yellow-500 to-orange-500",
    shadow: "shadow-amber-500/30",
  },
  blue: {
    gradient:
      "from-sky-500 via-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/30",
  },
  green: {
    gradient:
      "from-emerald-500 via-green-500 to-teal-500",
    shadow: "shadow-emerald-500/30",
  },
};

const ICONS = {
  red: Timer,
  purple: Crown,
  gold: Sparkles,
  blue: Zap,
  green: Flame,
};

const useOfferTimer = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): TimeLeft => {
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
    const calculate = () => {
      const now = Date.now();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      if (now < start) {
        const diff = start - now;

        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (diff % (1000 * 60 * 60 * 24)) /
              (1000 * 60 * 60)
          ),
          minutes: Math.floor(
            (diff % (1000 * 60 * 60)) /
              (1000 * 60)
          ),
          seconds: Math.floor(
            (diff % (1000 * 60)) / 1000
          ),
          isActive: false,
          isExpired: false,
          isUpcoming: true,
        });

        return;
      }

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

      const diff = end - now;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (diff % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (diff % (1000 * 60 * 60)) /
            (1000 * 60)
        ),
        seconds: Math.floor(
          (diff % (1000 * 60)) / 1000
        ),
        isActive: true,
        isExpired: false,
        isUpcoming: false,
      });
    };

    calculate();

    const interval = setInterval(calculate, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return timeLeft;
};

const TimeBox = ({
  value,
}: {
  value: number;
}) => {
  return (
    <motion.div
      key={value}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        min-w-[34px]
        h-9
        rounded-xl
        bg-white/15
        border
        border-white/20
        backdrop-blur-md
        flex
        items-center
        justify-center
        font-bold
        text-sm
      "
    >
      {String(value).padStart(2, "0")}
    </motion.div>
  );
};

export default function OfferTimerDisplay({
  startDate,
  endDate,
  lang,
  className = "",
  showIcon = true,
  variant = "red",
}: OfferTimerProps) {
  const timer = useOfferTimer({
    startDate,
    endDate,
  });

  const Icon = ICONS[variant];
  const style = VARIANTS[variant];

  const isRTL = lang === "ar";

  const urgent =
    timer.days === 0 &&
    timer.hours < 6;

  if (timer.isExpired) {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2
          px-3
          py-2
          rounded-full
          bg-gray-100
          dark:bg-gray-900
          text-gray-500
        "
      >
        <AlertCircle className="w-4 h-4" />
        {isRTL
          ? "انتهى العرض"
          : "Offer Expired"}
      </div>
    );
  }

  if (timer.isUpcoming) {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2
          px-3
          py-2
          rounded-full
          bg-amber-500/10
          border
          border-amber-500/20
          text-amber-500
        "
      >
        <Clock className="w-4 h-4" />

        <span>
          {isRTL
            ? "سيبدأ قريباً"
            : "Starts Soon"}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        scale: 1.03,
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        px-4
        py-3

        bg-gradient-to-r
        ${style.gradient}

        text-white

        shadow-xl
        ${style.shadow}

        border
        border-white/10

        backdrop-blur-xl

        ${urgent ? "animate-pulse" : ""}

        ${className}
      `}
    >
      {/* Glow */}
      <div
        className="
          absolute
          inset-0
          bg-white/5
        "
      />

      {/* Shine */}
      <motion.div
        animate={{
          x: ["-200%", "300%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          top-0
          left-0
          w-20
          h-full
          bg-white/20
          blur-xl
          rotate-12
        "
      />

      <div className="relative z-10 flex items-center gap-3">
        {showIcon && (
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              w-10
              h-10
              rounded-2xl
              bg-white/15
              border
              border-white/20
              flex
              items-center
              justify-center
            "
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}

        <div>
          <div className="text-xs opacity-80 mb-1">
            {urgent
              ? isRTL
                ? "🔥 العرض ينتهي قريباً"
                : "🔥 Ending Soon"
              : isRTL
              ? "⏳ الوقت المتبقي"
              : "⏳ Time Left"}
          </div>

          <div className="flex items-center gap-1">
            {timer.days > 0 && (
              <>
                <TimeBox value={timer.days} />
                <span className="text-xs px-1">
                  {isRTL ? "ي" : "D"}
                </span>
              </>
            )}

            <TimeBox value={timer.hours} />
            <span>:</span>

            <TimeBox value={timer.minutes} />
            <span>:</span>

            <TimeBox value={timer.seconds} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}