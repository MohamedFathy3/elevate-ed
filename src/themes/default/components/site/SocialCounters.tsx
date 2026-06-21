// src/themes/default/components/site/SocialCounters.tsx

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { 
  Facebook, 
  Youtube, 
  Music2, 
  Users,
  TrendingUp,
  Globe2,
  Share2,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

// ============================================
// Main Component
// ============================================

export const SocialCounters = () => {
  const { lang } = useLang();
  const { about } = useTeacher();

  // استخراج البيانات
  const facebookCount = about?.facebook_count || "0";
  const googleCount = about?.google_count || "0";
  const tiktokCount = about?.tiktok_count || "0";
  const youtubeCount = about?.you_tube_count || "0";

  // تنسيق الأرقام
  const formatNumber = (num: string | number): string => {
    const n = typeof num === 'string' ? parseInt(num.replace(/,/g, '')) : num;
    if (isNaN(n)) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  // بيانات السوشيال ميديا
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
      link: about?.facebook_meta || undefined,
    },
    {
      id: 'google',
      label: "Google",
      labelAr: "جوجل",
      count: googleCount,
      icon: Globe2,
      color: "#4285F4",
      gradient: "from-[#4285F4] to-[#34A853]",
      bg: "bg-[#4285F4]/10",
      hoverBg: "hover:bg-[#4285F4]/20",
      textColor: "text-[#4285F4]",
      iconBg: "bg-[#4285F4]/10",
      border: "border-[#4285F4]/20",
      shadow: "shadow-[#4285F4]/20",
      link: about?.google_meta || undefined,
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
      link: about?.tiktok_meta || undefined,
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
      link: about?.you_tube_meta || undefined,
    },
  ];

  // حساب الإجمالي
  const total = [facebookCount, googleCount, tiktokCount, youtubeCount].reduce(
    (acc, val) => acc + (parseInt(val) || 0),
    0
  );

  if (total === 0) return null;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      
      {/* ✅ زخارف خلفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* نجوم صغيرة */}
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
                {formatNumber(total)} {lang === "ar" ? "متابع" : "Followers"}
              </span>
            </span>
            <span className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              +{Math.round((total / 100) * 5)}%
            </span>
          </div>
        </motion.div>

        {/* ✅ الكروت - من غير Progress Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {socialData.map((item, index) => {
            const Icon = item.icon;
            const formattedCount = formatNumber(item.count);
            const countValue = parseInt(item.count);

            return (
              <motion.a
                key={item.id}
                href={item.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
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
                className="group relative"
              >
                <div className={`relative p-6 md:p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border ${item.border} shadow-lg ${item.shadow} transition-all duration-300 hover:shadow-2xl`}>
                  
                  {/* ✅ Glow على hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative">
                    {/* ✅ الأيقونة */}
                    <div className={`w-16 h-16 rounded-2xl ${item.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className={`w-8 h-8 ${item.textColor}`} />
                    </div>

                    {/* ✅ العدد */}
                    <div className="mt-5">
                      <p className={`text-3xl md:text-4xl font-black ${item.textColor} tracking-tight`}>
                        {formattedCount}
                        <span className="text-lg font-normal text-gray-400 dark:text-gray-500">+</span>
                      </p>
                    </div>

                    {/* ✅ الاسم والسهم */}
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {lang === "ar" ? item.labelAr : item.label}
                      </p>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* ✅ Total Card */}
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
                {/* ✅ الإجمالي */}
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {lang === "ar" ? "إجمالي المتابعين" : "Total Followers"}
                    </p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                      {formatNumber(total)}
                    </p>
                  </div>
                </div>

                {/* ✅ إحصائيات */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{Math.round((total / 100) * 8)}%
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {lang === "ar" ? "نمو شهري" : "Monthly Growth"}
                    </p>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {socialData.filter(d => parseInt(d.count) > 0).length}/4
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {lang === "ar" ? "منصات نشطة" : "Active Platforms"}
                    </p>
                  </div>
                </div>

                {/* ✅ زر */}
               
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialCounters;