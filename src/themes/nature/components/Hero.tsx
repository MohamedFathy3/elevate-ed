/* eslint-disable @typescript-eslint/no-explicit-any */
// src/themes/nature/pages/TeacherHome.tsx - Hero Component

import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  UserPlus, MapPin, BookOpen, Sparkles, Calendar,
  Star, ChevronRight, Users, Award, GraduationCap, Play
} from "lucide-react";
import heroTeacher from "@/assets/hero-teacher.png";
import { useTeacher } from "@/context/TeacherContext";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

const Hero = () => {
  const { teacher, home, pick } = useTeacher();
  const { lang } = useLang();
  const { slug } = useParams();
  const { apiColors, colorMode, theme } = useTheme();

  // ✅ Force re-render عند تغيير colorMode
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    console.log("🔄 ColorMode changed to:", colorMode);
    setKey(prev => prev + 1);
  }, [colorMode]);

  const teacherName = teacher?.name || pick(teacher?.name, teacher?.name_ar) || "المعلم";
  const title = pick(home?.title, home?.title_ar) || "";
  const subTitle = pick(home?.sub_title, home?.sub_title_ar) || "";
  const description = pick(home?.description, home?.description_ar) || "";
  const imageUrl = home?.image?.fullUrl || home?.imageUrl || heroTeacher;

  // كلمات متحركة
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

  // ✅ حساب الألوان بناءً على colorMode مع تحديث فوري
const colors = useMemo(() => {
  console.log("🎨 Calculating colors for mode:", colorMode);
  const isDark = colorMode === 'dark';
  
  // ✅ لو في API Colors - استخدمها دايماً
  if (apiColors) {
    const bgColor = isDark 
      ? adjustColorForDarkMode(apiColors.background) 
      : apiColors.background;
    
    // ✅ في Dark Mode، خلي النص أبيض أو فاتح
    const textColor = isDark 
      ? '#f1f5f9'  // ✅ أبيض فاتح
      : apiColors.text;
    
    const textSecondary = isDark 
      ? '#94a3b8'  // ✅ رمادي فاتح
      : `${apiColors.text}cc`;
    
    const textMuted = isDark 
      ? '#64748b'  // ✅ رمادي متوسط
      : `${apiColors.text}80`;

    return {
      background: bgColor,
      textPrimary: textColor,
      textSecondary: textSecondary,
      textMuted: textMuted,
      cardBg: isDark ? '#1e293b' : '#ffffff',
      cardBorder: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.8)',
      badgeBg: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
      badgeBorder: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
      sectionBg: isDark 
        ? `bg-[${adjustColorForDarkMode(apiColors.background)}]` 
        : 'bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50',
      floatCardBg: isDark ? 'bg-slate-800' : 'bg-white',
      floatCardBorder: isDark ? 'border-emerald-800' : 'border-emerald-100',
      badgeText: isDark ? 'text-emerald-400' : 'text-emerald-600',
      badgeBgClass: isDark ? 'bg-emerald-500/10 border-emerald-800' : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200',
      secondaryBtnBg: isDark ? 'bg-slate-800 border-emerald-800 hover:border-emerald-600 text-slate-200' : 'bg-white border-emerald-200 hover:border-emerald-400 text-slate-800',
      rotatingText: isDark ? 'text-emerald-400' : 'text-emerald-600',
      sectionBgColor: bgColor,
      sectionBgGradient: isDark 
        ? `radial-gradient(circle at 20% 30%, ${bgColor} 0%, #0f172a 100%)`
        : `radial-gradient(circle at 20% 30%, ${bgColor} 0%, #f8fafc 100%)`,
    };
  }

  // ✅ الألوان الافتراضية (بدون API)
  return {
    background: isDark ? '#0f172a' : '#f8fafc',
    textPrimary: isDark ? '#f1f5f9' : '#0f172a',  // ✅ أبيض في Dark Mode
    textSecondary: isDark ? '#94a3b8' : '#64748b', // ✅ رمادي فاتح
    textMuted: isDark ? '#64748b' : '#94a3b8',     // ✅ رمادي متوسط
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.8)',
    badgeBg: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
    badgeBorder: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
    sectionBg: isDark 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
      : 'bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50',
    floatCardBg: isDark ? 'bg-slate-800' : 'bg-white',
    floatCardBorder: isDark ? 'border-emerald-800' : 'border-emerald-100',
    badgeText: isDark ? 'text-emerald-400' : 'text-emerald-600',
    badgeBgClass: isDark ? 'bg-emerald-500/10 border-emerald-800' : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200',
    secondaryBtnBg: isDark ? 'bg-slate-800 border-emerald-800 hover:border-emerald-600 text-slate-200' : 'bg-white border-emerald-200 hover:border-emerald-400 text-slate-800',
    rotatingText: isDark ? 'text-emerald-400' : 'text-emerald-600',
    sectionBgColor: isDark ? '#0f172a' : '#f8fafc',
    sectionBgGradient: isDark 
      ? 'radial-gradient(circle at 20% 30%, #0f172a 0%, #0a0f1a 100%)'
      : 'radial-gradient(circle at 20% 30%, #f8fafc 0%, #eef2f6 100%)',
  };
}, [colorMode, apiColors, key]);

  return (
    <section
      key={`hero-${colorMode}-${key}`}
      className={`relative overflow-hidden pt-28 pb-40 transition-all duration-500`}
      style={{
        background: colors.sectionBgGradient,
        backgroundColor: colors.sectionBgColor,
      }}
    >
      {/* ==================== BACKGROUND ANIMATIONS ==================== */}

      {/* 1. الطبقة الأولى - خلفية متدرجة متحركة */}
      <div className="absolute inset-0 -z-20 transition-all duration-500">
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: colors.sectionBgGradient,
            opacity: colorMode === 'dark' ? 0.8 : 0.6
          }}
        />
      </div>

      {/* 2. الطبقة الثانية - دوائر متحركة */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          key={`circle1-${colorMode}`}
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, 50, 0, -50, 0],
            scale: [1, 1.2, 1, 0.8, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-10 -left-20 w-96 h-96 rounded-full blur-3xl transition-all duration-500 ${
            colorMode === 'dark'
              ? 'bg-emerald-500/10'
              : 'bg-emerald-300/20'
          }`}
        />

        <motion.div
          key={`circle2-${colorMode}`}
          animate={{
            x: [0, -80, 0, 80, 0],
            y: [0, -60, 0, 60, 0],
            scale: [1, 0.8, 1, 1.2, 1]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-10 -right-20 w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-500 ${
            colorMode === 'dark'
              ? 'bg-teal-500/10'
              : 'bg-teal-300/20'
          }`}
        />

        <motion.div
          key={`circle3-${colorMode}`}
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className={`absolute top-1/2 left-1/3 w-80 h-80 rounded-full blur-3xl transition-all duration-500 ${
            colorMode === 'dark'
              ? 'bg-amber-500/8'
              : 'bg-amber-300/15'
          }`}
        />
      </div>

      {/* 3. الطبقة الثالثة - جزيئات متحركة */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={`particle-${i}-${colorMode}`}
            initial={{ opacity: 0 }}
            animate={{
              y: [0, -200, 0],
              x: [0, (Math.random() - 0.5) * 100, 0],
              opacity: [0, colorMode === 'dark' ? 0.3 : 0.4, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 7,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
            className="absolute rounded-full transition-all duration-500"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              bottom: 0,
              backgroundColor: colorMode === 'dark'
                ? `hsl(${Math.random() * 60 + 140}, 70%, 50%)`
                : `hsl(${Math.random() * 60 + 140}, 70%, 50%)`,
              opacity: colorMode === 'dark' ? 0.3 : 0.4
            }}
          />
        ))}
      </div>

      {/* 4. الطبقة الرابعة - خطوط منحنية متحركة */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" viewBox="0 0 1000 600">
          <defs>
            <linearGradient id={`lineGrad1-${colorMode}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity={colorMode === 'dark' ? 0.4 : 0.5} />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`lineGrad2-${colorMode}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity={colorMode === 'dark' ? 0.35 : 0.4} />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M-100,100 Q200,50 400,150 T800,100 T1100,120"
            fill="none"
            stroke={`url(#lineGrad1-${colorMode})`}
            strokeWidth="2"
          >
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="
                M-100,100 Q200,50 400,150 T800,100 T1100,120;
                M-100,120 Q200,180 400,80 T800,140 T1100,100;
                M-100,100 Q200,50 400,150 T800,100 T1100,120"
            />
          </path>

          <path
            d="M-100,250 Q300,200 500,300 T900,250 T1100,280"
            fill="none"
            stroke={`url(#lineGrad2-${colorMode})`}
            strokeWidth="1.5"
          >
            <animate
              attributeName="d"
              dur="20s"
              repeatCount="indefinite"
              values="
                M-100,250 Q300,200 500,300 T900,250 T1100,280;
                M-100,280 Q300,330 500,230 T900,300 T1100,250;
                M-100,250 Q300,200 500,300 T900,250 T1100,280"
            />
          </path>

          <path
            d="M-100,400 Q400,350 600,450 T1000,400 T1100,420"
            fill="none"
            stroke={`url(#lineGrad1-${colorMode})`}
            strokeWidth="1"
          >
            <animate
              attributeName="d"
              dur="25s"
              repeatCount="indefinite"
              values="
                M-100,400 Q400,350 600,450 T1000,400 T1100,420;
                M-100,420 Q400,480 600,380 T1000,450 T1100,400;
                M-100,400 Q400,350 600,450 T1000,400 T1100,420"
            />
          </path>
        </svg>
      </div>

      {/* 5. الطبقة الخامسة - شبكة خفيفة */}
      <div
        className="absolute inset-0 -z-5 pointer-events-none transition-all duration-500"
        style={{
          opacity: colorMode === 'dark' ? 0.05 : 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23${colorMode === 'dark' ? 'ffffff' : '000000'}' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* ==================== MAIN CONTENT ==================== */}

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center relative z-10">

        {/* Left Content */}
        <div className="text-center lg:text-right order-2 lg:order-1">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 transition-all duration-500 ${colors.badgeBgClass}`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className={`text-sm font-medium transition-all duration-500 ${colors.badgeText}`}>
              {lang === "ar" ? "منصة تعليمية متكاملة" : "Integrated Educational Platform"}
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="font-black leading-[1.05] tracking-tight">
            {title && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-5xl md:text-6xl transition-all duration-500"
                style={{ color: colors.textPrimary }}
              >
                {title}
              </motion.span>
            )}
          </h1>

          {/* Animated Rotating Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center justify-center lg:justify-start gap-2 flex-wrap"
          >
            <span className={`transition-all duration-500 ${colorMode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {lang === "ar" ? "نحو" : "Towards"}
            </span>
            <div className="relative h-10 overflow-hidden">
              <span className={`text-lg font-bold transition-all duration-500 ${colors.rotatingText}`}>
                {rotatingWords[currentWordIndex]}
              </span>
            </div>
          </motion.div>

          {/* Subtitle */}
          {subTitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all duration-500"
              style={{ color: colors.textSecondary }}
            >
              {subTitle}
            </motion.p>
          )}

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all duration-500"
              style={{ color: colors.textMuted }}
            >
              {description}
            </motion.p>
          )}

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-col items-center lg:items-start gap-3"
          >
            {/* الزر الرئيسي */}
            <Link
              to={`/register`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-soft hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <UserPlus className="size-5" />
              {lang === "ar" ? "انضم لينا الآن" : "Join Now"}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* الأزرار الثانوية */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href={`/center-hours`}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:shadow-md ${colors.secondaryBtnBg}`}
              >
                <Calendar className="size-4 text-emerald-500" />
                {lang === "ar" ? "مواعيد السناتر" : "Center Hours"}
              </a>
              <a
                href="#books"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:shadow-md ${colors.secondaryBtnBg}`}
              >
                <BookOpen className="size-4 text-emerald-500" />
                {lang === "ar" ? "الكتب" : "Books"}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Image */}
        <div className="relative order-1 lg:order-2 flex justify-center">
          <div className="absolute inset-0 bg-sun blur-2xl animate-pulse-glow" aria-hidden />
          <img
            src={imageUrl}
            alt={teacherName}
            width={1024}
            height={1024}
            className="relative w-[88%] max-w-[520px] drop-shadow-2xl animate-float"
          />

          {/* Floating Card 1 */}
          <motion.div
            key={`float1-${colorMode}`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className={`absolute -bottom-10 right-5 lg:right-10 rounded-2xl p-3 shadow-xl border transition-all duration-500 ${colors.floatCardBg} ${colors.floatCardBorder}`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                colorMode === 'dark' ? 'bg-emerald-900/50' : 'bg-emerald-100'
              }`}>
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              </div>
              <div>
                <div className={`text-sm font-bold transition-all duration-500 ${
                  colorMode === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>4.9</div>
                <div className={`text-[10px] transition-all duration-500 ${
                  colorMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {lang === "ar" ? "تقييم الطلاب" : "Student Rating"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            key={`float2-${colorMode}`}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className={`absolute -top-10 left-5 lg:left-10 rounded-2xl p-3 shadow-xl border transition-all duration-500 ${colors.floatCardBg} ${
              colorMode === 'dark' ? 'border-teal-800' : 'border-teal-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                colorMode === 'dark' ? 'bg-teal-900/50' : 'bg-teal-100'
              }`}>
                <Users className="w-4 h-4 text-teal-500" />
              </div>
              <div>
                <div className={`text-sm font-bold transition-all duration-500 ${
                  colorMode === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>5000+</div>
                <div className={`text-[10px] transition-all duration-500 ${
                  colorMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {lang === "ar" ? "طالب مسجل" : "Enrolled"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave Footer */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            fill="#10b981"
            fillOpacity={colorMode === 'dark' ? 0.1 : 0.15}
            d="M0,64 C250,140 950,0 1200,64 L1200,120 L0,120 Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,64 C250,140 950,0 1200,64 L1200,120 L0,120 Z;
                M0,85 C300,0 900,140 1200,85 L1200,120 L0,120 Z;
                M0,64 C250,140 950,0 1200,64 L1200,120 L0,120 Z"
            />
          </path>
          <path
            fill="#14b8a6"
            fillOpacity={colorMode === 'dark' ? 0.15 : 0.25}
            d="M0,80 C350,20 850,140 1200,80 L1200,120 L0,120 Z"
          >
            <animate
              attributeName="d"
              dur="7s"
              repeatCount="indefinite"
              values="
                M0,80 C350,20 850,140 1200,80 L1200,120 L0,120 Z;
                M0,60 C300,140 900,0 1200,60 L1200,120 L0,120 Z;
                M0,80 C350,20 850,140 1200,80 L1200,120 L0,120 Z"
            />
          </path>
        </svg>
      </div>

    </section>
  );
};

// ==================== دوال مساعدة لمعالجة الألوان ====================

// ✅ تعديل اللون ليتناسب مع Dark Mode
function adjustColorForDarkMode(hexColor: string): string {
  if (!hexColor || !hexColor.startsWith('#')) return '#0f172a';

  try {
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // ✅ لو اللون فاتح، استخدم dark mode
    if (brightness > 200) {
      return '#0f172a';
    }

    // ✅ لو اللون غامق، استخدم نسخة داكنة منه
    r = Math.floor(r * 0.2);
    g = Math.floor(g * 0.2);
    b = Math.floor(b * 0.2);

    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return '#0f172a';
  }
}

// ✅ تفتيح اللون
function lightenColor(hex: string, percent: number): string {
  if (!hex || !hex.startsWith('#')) return hex;

  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * (1 - percent)));
  g = Math.min(255, Math.floor(g + (255 - g) * (1 - percent)));
  b = Math.min(255, Math.floor(b + (255 - b) * (1 - percent)));

  return `rgb(${r}, ${g}, ${b})`;
}

export default Hero;