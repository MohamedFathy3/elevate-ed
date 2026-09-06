/* eslint-disable @typescript-eslint/no-explicit-any */
// src/themes/nature/pages/TeacherHome.tsx - Hero Component

import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus, BookOpen, Sparkles, Calendar,
  Star, ChevronRight, Users
} from "lucide-react";
import { useTeacher } from "@/context/TeacherContext";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

// ✅ Lazy Loading للـ HTML Parser
const RenderHTML = lazy(() => 
  import('html-react-parser').then(module => ({
    default: ({ html, className }: { html: string; className?: string }) => {
      if (!html) return null;
      return <div className={className}>{module.default(html)}</div>;
    }
  }))
);

// ✅ Skeleton بسيط جداً
const HTMLSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`${className} bg-gray-200/50 dark:bg-gray-700/50 rounded`}>
    <div className="invisible">Loading...</div>
  </div>
);

const Hero = () => {
  const { teacher, home, pick } = useTeacher();
  const { lang } = useLang();
  const { colorMode } = useTheme();
  const heroRef = useRef<HTMLElement>(null);

  const teacherName = teacher?.name || pick(teacher?.name, teacher?.name_ar) || "المعلم";
  
  const titleHTML = pick(home?.title, home?.title_ar) || "";
  const subTitleHTML = pick(home?.sub_title, home?.sub_title_ar) || "";
  const descriptionHTML = pick(home?.description, home?.description_ar) || "";
  const imageUrl = home?.image?.fullUrl || home?.imageUrl;

  const rotatingWords = lang === "ar"
    ? ["التميز", "النجاح", "الإبداع", "التفوق"]
    : ["Excellence", "Success", "Creativity", "Excellence"];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const isDark = colorMode === 'dark';
  
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  return (
    <section 
      ref={heroRef}
      className={`relative overflow-hidden pt-20 md:pt-24 pb-20 md:pb-28 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-6 md:gap-8 items-center relative z-10">

        {/* Left Content */}
        <div className="text-center lg:text-right order-2 lg:order-1">

          {/* Badge */}
          <div className={`inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full mb-3 md:mb-4 ${
            isDark ? 'bg-emerald-500/10 border border-emerald-800' : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200'
          }`}>
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span className={`text-[10px] font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {lang === "ar" ? "تعليم" : "Education"}
            </span>
          </div>

          {/* Title */}
          <div className="min-h-[80px] md:min-h-[100px]">
            {titleHTML ? (
              <Suspense fallback={<HTMLSkeleton className="hero-title-content font-black text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight" />}>
                <div className="hero-title-content font-black text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight" style={{ color: textColor }}>
                  <RenderHTML html={titleHTML} />
                </div>
              </Suspense>
            ) : null}
          </div>

          {/* Rotating Text */}
          <div className="mt-2 md:mt-3 flex items-center justify-center lg:justify-start gap-1.5 md:gap-2 flex-wrap">
            <span className={`text-xs md:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {lang === "ar" ? "نحو" : "Towards"}
            </span>
            <span className={`text-sm md:text-base font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {rotatingWords[currentWordIndex]}
            </span>
          </div>

          {/* Subtitle */}
          {subTitleHTML && (
            <div className="min-h-[40px] md:min-h-[50px]">
              <Suspense fallback={<HTMLSkeleton className="hero-subtitle-content mt-3 md:mt-4" />}>
                <div className="hero-subtitle-content mt-3 md:mt-4 text-sm md:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: textSecondary }}>
                  <RenderHTML html={subTitleHTML} />
                </div>
              </Suspense>
            </div>
          )}

          {/* Description */}
          {descriptionHTML && (
            <div className="min-h-[30px] md:min-h-[40px]">
              <Suspense fallback={<HTMLSkeleton className="hero-description-content mt-2 md:mt-3" />}>
                <div className="hero-description-content mt-2 md:mt-3 text-xs md:text-sm lg:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: textMuted }}>
                  <RenderHTML html={descriptionHTML} />
                </div>
              </Suspense>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-4 md:mt-6 flex flex-col items-center lg:items-start gap-2 md:gap-3">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <UserPlus className="size-4 md:size-5" />
              {lang === "ar" ? "انضم" : "Join"}
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <Link
                to="/center-hours"
                className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs transition-all duration-300 hover:shadow-md ${
                  isDark ? 'bg-slate-800 border border-emerald-800 hover:border-emerald-600 text-slate-200' : 'bg-white border border-emerald-200 hover:border-emerald-400 text-slate-800'
                }`}
              >
                <Calendar className="size-3 text-emerald-500" />
                {lang === "ar" ? "السناتر" : "Centers"}
              </Link>
              <a
                href="#books"
                className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs transition-all duration-300 hover:shadow-md ${
                  isDark ? 'bg-slate-800 border border-emerald-800 hover:border-emerald-600 text-slate-200' : 'bg-white border border-emerald-200 hover:border-emerald-400 text-slate-800'
                }`}
              >
                <BookOpen className="size-3 text-emerald-500" />
                {lang === "ar" ? "الكتب" : "Books"}
              </a>
            </div>
          </div>
        </div>

        {/* ✅ Right Image - مع أنيميشن مستمر من فوق لتحت */}
        <motion.div 
          className="relative order-1 lg:order-2 flex justify-center"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative w-[80%] md:w-[88%] max-w-[400px] aspect-square">
            {imageUrl ? (
              // ✅ img مع تحسينات قصوى
              <img
                src={`${imageUrl}?w=250&q=60`}
                srcSet={`
                  ${imageUrl}?w=120&q=60 120w,
                  ${imageUrl}?w=250&q=60 250w,
                  ${imageUrl}?w=400&q=60 400w
                `}
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 250px"
                alt={teacherName}
                width={250}
                height={250}
                loading="eager"
                fetchpriority="high"
                decoding="async"
                className="w-full h-full drop-shadow-2xl rounded-full object-cover"
                style={{ 
                  aspectRatio: '1/1',
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30" />
            )}
          </div>

          {/* Floating Cards - مبسطة مع حركة خفيفة */}
          <motion.div 
            className={`absolute -bottom-6 md:-bottom-8 right-2 md:right-4 rounded-xl md:rounded-2xl p-1.5 md:p-2.5 shadow-lg border ${
              isDark ? 'bg-slate-800 border-emerald-800' : 'bg-white border-emerald-100'
            }`}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="flex items-center gap-1 md:gap-1.5">
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'
              }`}>
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-500 fill-emerald-500" />
              </div>
              <div>
                <div className={`text-[10px] md:text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>4.9</div>
                <div className={`text-[6px] md:text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lang === "ar" ? "تقييم" : "Rate"}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`absolute -top-6 md:-top-8 left-2 md:left-4 rounded-xl md:rounded-2xl p-1.5 md:p-2.5 shadow-lg border ${
              isDark ? 'bg-slate-800 border-teal-800' : 'bg-white border-teal-100'
            }`}
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="flex items-center gap-1 md:gap-1.5">
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                isDark ? 'bg-teal-900/50' : 'bg-teal-100'
              }`}>
                <Users className="w-2.5 h-2.5 md:w-3 md:h-3 text-teal-500" />
              </div>
              <div>
                <div className={`text-[10px] md:text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>5k+</div>
                <div className={`text-[6px] md:text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lang === "ar" ? "طلاب" : "Std"}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg className="relative block w-full h-6 md:h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            fill="#10b981"
            fillOpacity={isDark ? 0.05 : 0.08}
            d="M0,64 C250,140 950,0 1200,64 L1200,120 L0,120 Z"
          />
        </svg>
      </div>

    </section>
  );
};

export default Hero;