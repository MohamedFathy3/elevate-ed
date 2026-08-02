// components/site/Hero.tsx

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useTeacher } from "@/context/TeacherContext";
import { Zap, ArrowRight, ArrowLeft, Lightbulb, Atom, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import parse from 'html-react-parser';

interface HomeData {
  title?: string;
  title_ar?: string;
  sub_title?: string;
  sub_title_ar?: string;
  description?: string;
  description_ar?: string;
  imageUrl?: string;
  image?: {
    fullUrl?: string;
  };
}

export const Hero = () => {
  const { dir, lang } = useLang();
  const { colorMode } = useTheme(); // ✅ استخدم colorMode بدل theme
  const { teacher, slug, pick, isLoading } = useTeacher();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  // ✅ تحديد الـ mode
  const isDark = colorMode === 'dark'; // ✅ استخدم colorMode
  const isNature = colorMode === 'nature';
  const isLight = colorMode === 'light';

  const home = teacher?.website?.home as HomeData || {};
  
  const heroTitle = pick(home.title, home.title_ar) || teacher?.name || (lang === "ar" ? "مرحباً بك" : "Welcome");
  const heroSubTitle = pick(home.sub_title, home.sub_title_ar) || (lang === "ar" ? "تعلم مع أفضل المعلمين" : "Learn with the best teachers");
  const heroDescriptionHTML = pick(home.description, home.description_ar) || (lang === "ar" 
    ? "انضم إلينا اليوم وابدأ رحلتك التعليمية" 
    : "Join us today and start your learning journey");
  const heroImage = home.imageUrl || home.image?.fullUrl || teacher?.website?.home?.image?.fullUrl || "/default-hero.jpg";
  const teacherName = teacher?.name || (lang === "ar" ? "المعلم" : "Teacher");

  if (isLoading) {
    return <HeroSkeleton colorMode={colorMode} />;
  }

  // ✅ تحديد الألوان حسب colorMode
  const getColors = () => {
    if (isDark) {
      return {
        bg: 'bg-gray-950',
        bgCard: 'bg-gray-900/80',
        border: 'border-gray-800',
        text: 'text-gray-300',
        textStrong: 'text-gray-100',
        primary: 'text-indigo-400',
        primaryGradient: 'from-indigo-400 via-indigo-300 to-indigo-200',
        primaryBg: 'from-indigo-500 to-indigo-400',
        primaryBgHover: 'hover:from-indigo-600 hover:to-indigo-500',
        primaryLight: 'bg-indigo-950/30 hover:bg-indigo-950/50',
        primaryBorder: 'border-indigo-800/30',
        iconBg: 'bg-gray-800/90 border-gray-700',
        pattern: "linear-gradient(hsl(240, 10%, 30%) 1px, transparent 1px), linear-gradient(90deg, hsl(240, 10%, 30%) 1px, transparent 1px)",
      };
    }
    
    if (isNature) {
      return {
        bg: 'bg-gradient-to-b from-emerald-50/50 via-white to-white',
        bgCard: 'bg-white/80',
        border: 'border-emerald-200/80',
        text: 'text-gray-600',
        textStrong: 'text-gray-800',
        primary: 'text-emerald-600',
        primaryGradient: 'from-emerald-600 via-emerald-500 to-emerald-400',
        primaryBg: 'from-emerald-600 to-emerald-500',
        primaryBgHover: 'hover:from-emerald-700 hover:to-emerald-600',
        primaryLight: 'bg-emerald-50 hover:bg-emerald-100',
        primaryBorder: 'border-emerald-200/50',
        iconBg: 'bg-white/90 border-emerald-200/80',
        pattern: "linear-gradient(hsl(160, 20%, 90%) 1px, transparent 1px), linear-gradient(90deg, hsl(160, 20%, 90%) 1px, transparent 1px)",
      };
    }
    
    // Light mode (default)
    return {
      bg: 'bg-gradient-to-b from-indigo-50/50 via-white to-white',
      bgCard: 'bg-white/80',
      border: 'border-gray-200/80',
      text: 'text-gray-600',
      textStrong: 'text-gray-800',
      primary: 'text-indigo-600',
      primaryGradient: 'from-indigo-600 via-indigo-500 to-indigo-400',
      primaryBg: 'from-indigo-600 to-indigo-500',
      primaryBgHover: 'hover:from-indigo-700 hover:to-indigo-600',
      primaryLight: 'bg-indigo-50 hover:bg-indigo-100',
      primaryBorder: 'border-indigo-200/50',
      iconBg: 'bg-white/90 border-gray-200/80',
      pattern: "linear-gradient(hsl(220, 20%, 90%) 1px, transparent 1px), linear-gradient(90deg, hsl(220, 20%, 90%) 1px, transparent 1px)",
    };
  };

  const colors = getColors();

  return (
    <section className={`relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden transition-colors duration-300 ${colors.bg}`}>
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: colors.pattern,
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Animated decorative elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/4 left-[5%] w-32 h-32 rounded-full border-2 hidden md:block ${colors.primaryBorder}`}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] right-[3%] w-24 h-24 hidden md:block"
      >
        <Atom className={`w-full h-full ${colors.primaryBorder}`} strokeWidth={1} />
      </motion.div>

      <div className="container-tight relative grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-2 mb-6 font-semibold text-sm ${colors.primary}`}
          >
            <Sparkles className="w-4 h-4" fill="currentColor" />
            {lang === "ar" ? "أهلاً بك في" : "Welcome to"}
          </motion.div>

          <h1 className="font-display font-black tracking-tight text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className={`block bg-gradient-to-r ${colors.primaryGradient} bg-clip-text text-transparent`}
            >
              {heroTitle}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className={`mt-6 text-lg md:text-xl leading-relaxed max-w-xl ${colors.text}`}
          >
            {heroSubTitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`mt-8 p-5 md:p-6 rounded-3xl border shadow-soft max-w-xl backdrop-blur-sm transition-colors duration-300 ${colors.bgCard} ${colors.border}`}
          >
            <div className="flex gap-4 py-5">
              <div className="shrink-0 w-5 h-9 rounded-full grid place-items-center">
                <CheckCircle2 className={`w-5 h-5 ${colors.primary}`} />
              </div>
              
              <div className={`html-content min-w-0 break-words text-sm leading-relaxed transition-colors duration-300 ${colors.text}`}>
                {parse(heroDescriptionHTML)}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to={`/register`}
              className={`group inline-flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-2xl bg-gradient-to-r ${colors.primaryBg} ${colors.primaryBgHover} text-white font-bold text-base md:text-lg shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]`}
            >
              <Zap className="w-5 h-5" fill="white" />
              <span>{lang === "ar" ? "سجّل دلوقتي" : "Register Now"}</span>
              <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              to={`/center-hours`}
              className={`group inline-flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${colors.primaryLight} ${colors.primary}`}
            >
              <span>{lang === "ar" ? "مواعيد السناتر" : "Center Hours"}</span>
            </Link>
          </motion.div>
        </div>

        {/* Right side - Image with animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative aspect-square max-w-lg mx-auto w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 rounded-full border-2 ${colors.primaryBorder}`}
          >
            <span className={`absolute -top-2 left-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${colors.primaryBg} shadow-glow`} />
            <span className={`absolute top-1/2 -right-2 w-3 h-3 rounded-full shadow-glow ${isDark ? 'bg-cyan-500' : isNature ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-6 rounded-full border-2 ${isDark ? 'border-pink-800/30' : isNature ? 'border-amber-200/50' : 'border-pink-200/50'}`}
          >
            <span className={`absolute -bottom-1.5 left-1/3 w-3 h-3 rounded-full shadow-glow ${isDark ? 'bg-pink-500' : isNature ? 'bg-amber-400' : 'bg-pink-400'}`} />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-12 rounded-full border ${colors.primaryBorder} opacity-50`}
          />

          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-16 rounded-full blur-2xl bg-gradient-to-r ${colors.primaryGradient} opacity-30`}
          />

          <div className={`absolute inset-16 rounded-full shadow-glow overflow-hidden border-2 transition-colors duration-300 ${colors.border}`}>
            {heroImage ? (
              <img
                src={heroImage}
                alt={teacherName}
                className="w-full h-full object-cover"
                width={1155}
                height={650}
                loading="eager"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-r ${colors.primaryBg} grid place-items-center`}>
                <span className="text-white text-4xl font-bold">
                  {teacherName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-6 right-2 md:right-0 w-16 h-16 rounded-2xl shadow-card grid place-items-center backdrop-blur-sm border transition-colors duration-300 ${colors.iconBg}`}
          >
            <Zap className={`w-7 h-7 ${colors.primary}`} fill="currentColor" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className={`absolute bottom-12 left-2 md:left-0 w-16 h-16 rounded-2xl shadow-card grid place-items-center backdrop-blur-sm border transition-colors duration-300 ${colors.iconBg}`}
          >
            <Lightbulb className={`w-7 h-7 ${isDark ? 'text-amber-300' : isNature ? 'text-amber-500' : 'text-amber-400'}`} fill="currentColor" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className={`absolute top-1/2 left-0 md:-left-4 w-14 h-14 rounded-2xl bg-gradient-to-r ${colors.primaryBg} shadow-card grid place-items-center`}
          >
            <Atom className="w-7 h-7 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// 🟢 Skeleton component - متوافق مع colorMode
const HeroSkeleton = ({ colorMode }: { colorMode: string }) => {
  const isDark = colorMode === 'dark';
  const isNature = colorMode === 'nature';
  
  const getBg = () => {
    if (isDark) return 'bg-gray-950';
    if (isNature) return 'bg-gradient-to-b from-emerald-50/50 via-white to-white';
    return 'bg-gradient-to-b from-indigo-50/50 via-white to-white';
  };
  
  const getSkeletonBg = () => {
    if (isDark) return 'bg-gray-700';
    return 'bg-gray-200';
  };
  
  return (
    <section className={`relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden transition-colors duration-300 ${getBg()}`}>
      <div className="container-tight relative grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-pulse">
          <div className={`h-8 w-32 rounded-lg mb-6 ${getSkeletonBg()}`} />
          <div className={`h-16 md:h-24 rounded-2xl mb-4 w-3/4 ${getSkeletonBg()}`} />
          <div className={`h-16 md:h-24 rounded-2xl mb-4 w-2/3 ${getSkeletonBg()}`} />
          <div className={`h-6 rounded-lg mb-8 w-1/2 ${getSkeletonBg()}`} />
          <div className={`h-32 rounded-3xl mb-8 ${getSkeletonBg()}`} />
          <div className="flex gap-3">
            <div className={`h-14 w-40 rounded-2xl ${getSkeletonBg()}`} />
            <div className={`h-14 w-36 rounded-2xl ${getSkeletonBg()}`} />
          </div>
        </div>
        <div className="animate-pulse">
          <div className={`aspect-square rounded-full mx-auto max-w-lg ${getSkeletonBg()}`} />
        </div>
      </div>
    </section>
  );
};