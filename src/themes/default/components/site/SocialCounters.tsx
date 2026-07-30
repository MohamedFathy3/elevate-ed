// src/themes/default/components/site/SocialCounters.tsx

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { useCounter } from "@/hooks/useCounter";
import { 
  Facebook, 
  Youtube, 
  Users,
  TrendingUp,
  Globe2,
  Share2,
  Sparkles,
  ArrowUpRight,
  Instagram
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

// ============================================
// ✅ Component للعداد المتحرك
// ============================================

const AnimatedCounter = ({ 
  target, 
  suffix = "+",
  className = "",
  duration = 2000,
}: { 
  target: number; 
  suffix?: string;
  className?: string;
  duration?: number;
}) => {
  const { count, elementRef } = useCounter(target, duration, true);

  // تنسيق الأرقام (K, M)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <span ref={elementRef} className={className}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

// ============================================
// Main Component
// ============================================

export const SocialCounters = () => {
  const { lang } = useLang();
  const { about } = useTeacher();

  // استخراج البيانات (تحويل إلى أرقام)
  const facebookCount = parseInt(about?.facebook_count) || 0;
  const googleCount = parseInt(about?.google_count) || 0; // ✅ نفس الـ key في البيانات
  const tiktokCount = parseInt(about?.tiktok_count) || 0;
  const youtubeCount = parseInt(about?.you_tube_count) || 0;

  // حساب الإجمالي
  const total = facebookCount + googleCount + tiktokCount + youtubeCount;

  // بيانات السوشيال ميديا - google بقت Instagram ✅
  const socialData = [
    {
      id: 'facebook',
      label: "Facebook",
      labelAr: "فيسبوك",
      count: facebookCount,
      icon: Facebook,
      color: "#1877F2",
      gradient: "from-[#1877F2] to-[#0D65D9]",
      bg: "bg-[#1877F2]/10",
      hoverBg: "hover:bg-[#1877F2]/20",
      textColor: "text-[#1877F2]",
      iconBg: "bg-[#1877F2]/10",
      border: "border-[#1877F2]/20",
      shadow: "shadow-[#1877F2]/20",
      link: undefined, // ❌ مفيش رابط
    },
    {
      id: 'instagram', // ✅ id changed to instagram
      label: "Instagram", // ✅ label changed
      labelAr: "انستجرام", // ✅ labelAr changed
      count: googleCount, // ✅ نفس القيمة من google_count
      icon: Instagram, // ✅ أيقونة انستجرام
      color: "#E4405F",
      gradient: "from-[#E4405F] to-[#C13584]",
      bg: "bg-[#E4405F]/10",
      hoverBg: "hover:bg-[#E4405F]/20",
      textColor: "text-[#E4405F]",
      iconBg: "bg-[#E4405F]/10",
      border: "border-[#E4405F]/20",
      shadow: "shadow-[#E4405F]/20",
      link: undefined, // ❌ مفيش رابط
    },
    {
      id: 'tiktok',
      label: "TikTok",
      labelAr: "تيك توك",
      count: tiktokCount,
      icon: FaTiktok,
      color: "#000000",
      gradient: "from-[#000000] to-[#25F4EE]",
      bg: "bg-gray-100 dark:bg-gray-800",
      hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-700",
      textColor: "text-gray-900 dark:text-white",
      iconBg: "bg-gray-100 dark:bg-gray-800",
      border: "border-gray-200 dark:border-gray-700",
      shadow: "shadow-gray-500/20",
      link: undefined, // ❌ مفيش رابط
    },
    {
      id: 'youtube',
      label: "YouTube",
      labelAr: "يوتيوب",
      count: youtubeCount,
      icon: Youtube,
      color: "#FF0000",
      gradient: "from-[#FF0000] to-[#CC0000]",
      bg: "bg-[#FF0000]/10",
      hoverBg: "hover:bg-[#FF0000]/20",
      textColor: "text-[#FF0000]",
      iconBg: "bg-[#FF0000]/10",
      border: "border-[#FF0000]/20",
      shadow: "shadow-[#FF0000]/20",
      link: undefined, // ❌ مفيش رابط
    },
  ];

  if (total === 0) return null;

  // تنسيق الرقم الكبير
  const formatTotal = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      
      {/* ✅ زخارف خلفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container-tight relative z-10">
        
        {/* ✅ HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-800/30">
            <Share2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {lang === "ar" ? "متابعينا على السوشيال ميديا" : "Our Social Media Followers"}
            </span>
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-black">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {lang === "ar" ? "إحصائيات التواصل الاجتماعي" : "Social Media Statistics"}
            </span>
          </h2>

          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                <AnimatedCounter target={total} suffix="+" duration={2500} />
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  {lang === "ar" ? "متابع" : "Followers"}
                </span>
              </span>
            </span>
            <span className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              +{Math.round((total / 100) * 5)}%
            </span>
          </div>
        </motion.div>

        {/* ✅ الكروت - مع العداد المتحرك */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {socialData.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div // ❌ changed from motion.a to motion.div (no link)
                key={item.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group cursor-default" // ✅ cursor-default بدلاً من pointer
              >
                <div className={`relative p-6 md:p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border ${item.border} shadow-lg ${item.shadow} transition-all duration-300 hover:shadow-2xl`}>
                  
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative">
                    {/* ✅ الأيقونة */}
                    <div className={`w-16 h-16 rounded-2xl ${item.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className={`w-8 h-8 ${item.textColor}`} />
                    </div>

                    {/* ✅ العدد المتحرك */}
                    <div className="mt-5">
                      <p className={`text-3xl md:text-4xl font-black ${item.textColor} tracking-tight`}>
                        <AnimatedCounter 
                          target={item.count} 
                          suffix="+"
                          duration={2000 + index * 300}
                        />
                      </p>
                    </div>

                    {/* ✅ الاسم فقط بدون سهم */}
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {lang === "ar" ? item.labelAr : item.label}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ✅ Total Card - مع عداد متحرك كبير */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[2px]">
            <div className="relative rounded-2xl bg-white dark:bg-gray-900 p-6 md:p-8">
              
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" />

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                {/* ✅ الإجمالي مع عداد متحرك */}
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {lang === "ar" ? "إجمالي المتابعين" : "Total Followers"}
                    </p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                      <AnimatedCounter 
                        target={total} 
                        suffix=""
                        duration={3000}
                      />
                    </p>
                  </div>
                </div>

                {/* ✅ إحصائيات */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <motion.p 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="text-2xl font-bold text-green-600 dark:text-green-400"
                    >
                      +{Math.round((total / 100) * 8)}%
                    </motion.p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {lang === "ar" ? "نمو شهري" : "Monthly Growth"}
                    </p>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <motion.p 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring" }}
                      className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                    >
                      {socialData.filter(d => d.count > 0).length}/4
                    </motion.p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {lang === "ar" ? "منصات نشطة" : "Active Platforms"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialCounters;