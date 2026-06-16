/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/Courses.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useBuyCourse } from "@/hooks/useEnroll";
import { useTheme } from "@/context/ThemeContext";
import { OfferTimerDisplay } from "@/components/ui/OfferTimer";

import { 
  ArrowRight, ArrowLeft, BookOpen, Atom, Zap, Sparkles, 
  Users, Calendar, Percent, GraduationCap, BookMarked, Award, 
  ShoppingCart, Loader2, Leaf, Flower2, Trees, Clock,
  Star, Timer, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

// ============================================
// ⏱️ Hook للمؤقت التنازلي
// ============================================






const NATURE_ICONS = [Leaf, Flower2, Trees, Sparkles, Award, BookMarked];
const DEFAULT_ICONS = [Atom, Zap, BookOpen, Sparkles, Award, BookMarked];

// ✅ ألوان ثابتة ومتناسقة للـ light mode
const LIGHT_COLORS = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600", 
  "from-purple-500 to-purple-600",
  "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600",
  "from-cyan-500 to-cyan-600",
];

// ✅ ألوان ثابتة للـ dark mode
const DARK_COLORS = [
  "from-blue-400 to-blue-500",
  "from-emerald-400 to-emerald-500",
  "from-purple-400 to-purple-500", 
  "from-rose-400 to-rose-500",
  "from-amber-400 to-amber-500",
  "from-cyan-400 to-cyan-500",
];

// ============================================
// Course Card Component مع المؤقت
// ============================================

const DefaultCourseCard = ({ course, index, slug, pick, lang, Arrow, isDark }: any) => {
  const [isBuying, setIsBuying] = useState(false);
  const { buyCourse } = useBuyCourse();
  
  if (!course) return null;
  
  const Icon = DEFAULT_ICONS[(index || 0) % DEFAULT_ICONS.length];
  const lightColor = LIGHT_COLORS[(index || 0) % LIGHT_COLORS.length];
  const darkColor = DARK_COLORS[(index || 0) % DARK_COLORS.length];
  const gradientColor = isDark ? darkColor : lightColor;
  
  const originalPrice = parseFloat(course?.price) || 0;
  const discountPercent = parseFloat(course?.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;
  
  // ✅ استخراج تواريخ العرض
  const offerStartDate = course?.offer_start_date;
  const offerEndDate = course?.offer_end_date;
  const hasOfferDates = offerStartDate && offerEndDate;
  
  const courseImage = course?.image?.fullUrl || course?.imageUrl || null;
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  const stageName = pick(course?.stage?.name, course?.stage?.name_ar) || "";
  const subjectName = pick(course?.subject?.name, course?.subject?.name_ar) || "";
  const semesterName = pick(course?.semester?.name, course?.semester?.name_ar) || "";
  const type = course?.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center");
  
  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBuying) return;
    setIsBuying(true);
    try {
      await buyCourse(course.id, finalPrice);
    } finally {
      setIsBuying(false);
    }
  };
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index || 0) * 0.08, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700"
    >
      {/* Header Section */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        {courseImage ? (
          <>
            <img
              src={courseImage}
              alt={courseTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-white/20" strokeWidth={1} />
          </div>
        )}
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-6 -top-6 opacity-10"
        >
          <Icon className="w-32 h-32 text-white" strokeWidth={1} />
        </motion.div>
        
        {/* ✅ Badge الخصم مع المؤقت */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold shadow-lg">
              <Percent className="w-3 h-3" />
              <span>{discountPercent}% OFF</span>
            </div>
            
            {/* ⏱️ عرض المؤقت إذا كان هناك تواريخ للعرض */}
            {hasOfferDates && (
              <OfferTimerDisplay 
                startDate={offerStartDate} 
                endDate={offerEndDate} 
                lang={lang}
                isDark={isDark}
              />
            )}
          </div>
        )}
        
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
          {type}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {stageName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs">
              <GraduationCap className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{stageName}</span>
            </span>
          )}
          {subjectName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-xs">
              <BookMarked className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{subjectName}</span>
            </span>
          )}
          {semesterName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 text-xs">
              <Calendar className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{semesterName}</span>
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-h-[48px] text-gray-900 dark:text-white">
          {courseTitle}
        </h3>
        
        {/* Description */}
        {courseDescription && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 min-h-[32px]">
            {courseDescription.replace(/<[^>]*>/g, '')}
          </p>
        )}
        
        {/* Price and Buttons */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between gap-2">
            <div>
              {hasDiscount ? (
                <div className="flex flex-col">
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">{finalPrice.toFixed(2)} EGP</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 line-through">{originalPrice.toFixed(2)} EGP</span>
                </div>
              ) : (
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{originalPrice.toFixed(2)} EGP</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBuy}
                disabled={isBuying}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isBuying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                <span>{lang === "ar" ? "شراء" : "Buy"}</span>
              </button>
              
              <Link
                to={`/${slug}/courses/${course?.id}`}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                <span>{lang === "ar" ? "تفاصيل" : "Details"}</span>
                <Arrow className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// ============================================
// Nature Carousel Component مع المؤقت
// ============================================

const NatureCarouselCourses = ({ courses, pick, slug, lang, Arrow, dir, isDark }: any) => {
  const [index, setIndex] = useState(0);
  const ArrowIcon = ArrowLeft;
  
  if (!courses?.length) return null;
  
  const total = courses.length;
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  const c = courses[index];
  
  const originalPrice = parseFloat(c?.price) || 0;
  const discount = parseFloat(c?.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discount / 100);
  const hasDiscount = discount > 0;
  
  // ✅ استخراج تواريخ العرض
  const offerStartDate = c?.offer_start_date;
  const offerEndDate = c?.offer_end_date;
  const hasOfferDates = offerStartDate && offerEndDate;
  
  const courseImage = c?.image?.fullUrl || c?.imageUrl || null;
  const courseTitle = pick(c?.title, c?.title_ar) || "Course";
  const courseDescription = pick(c?.description, c?.description_ar) || "";
  const type = c?.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center");
  
  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-amber-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Carousel */}
        <div className="relative order-2 lg:order-1">
          <div className="relative rounded-[2rem] p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl">
            <div className="relative bg-white dark:bg-gray-800 rounded-[1.7rem] overflow-hidden">
              <div className="relative h-72 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-gray-700 dark:to-gray-800 grid place-items-center overflow-hidden">
                {courseImage ? (
                  <img 
                    src={courseImage} 
                    alt={courseTitle} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Leaf className="w-24 h-24 text-amber-300 dark:text-amber-600" />
                )}
                
                {/* ✅ Badge الخصم مع المؤقت */}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-black shadow-lg">
                      {discount}% OFF
                    </span>
                    
                    {/* ⏱️ عرض المؤقت */}
                    {hasOfferDates && (
                      <OfferTimerDisplay 
                        startDate={offerStartDate} 
                        endDate={offerEndDate} 
                        lang={lang}
                        isDark={isDark}
                      />
                    )}
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                  {type}
                </div>
                
                <button
                  onClick={() => go(-1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur grid place-items-center shadow-md hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition"
                >
                  <ArrowRight className="size-5 text-amber-600 dark:text-amber-400" />
                </button>
                <button
                  onClick={() => go(1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur grid place-items-center shadow-md hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition"
                >
                  <ArrowIcon className="size-5 text-amber-600 dark:text-amber-400" />
                </button>
              </div>

              <div className="p-6 text-center">
                <h3 className="font-extrabold text-xl text-amber-800 dark:text-amber-300">{courseTitle}</h3>
                <p className="mt-1 text-sm text-amber-600/70 dark:text-amber-400/70">{courseDescription.replace(/<[^>]*>/g, '')}</p>

                <div className="mt-4 flex items-center justify-center gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{finalPrice.toFixed(2)} جنيه</span>
                      <span className="text-sm text-amber-400 dark:text-amber-500 line-through font-bold">{originalPrice.toFixed(2)} جنيه</span>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{originalPrice.toFixed(2)} جنيه</span>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link to={`/${slug}/courses/${c?.id}`} className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105">
                    {lang === "ar" ? "اشترك الآن" : "Enroll Now"}
                  </Link>
                  <Link to={`/${slug}/courses/${c?.id}`} className="px-4 py-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all">
                    {lang === "ar" ? "تفاصيل الكورس" : "Details"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {courses.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index 
                    ? "w-8 bg-amber-600 dark:bg-amber-500" 
                    : "w-2 bg-amber-300 dark:bg-amber-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="order-1 lg:order-2 text-center">
          <h2 className="text-4xl md:text-5xl font-black leading-tight flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Leaf className="size-9 text-amber-600 dark:text-amber-400 animate-spin-slow" />
              <span className="text-amber-800 dark:text-amber-300">{lang === "ar" ? "الكورسات" : "Courses"}</span>
              <span className="text-amber-600 dark:text-amber-400"> {lang === "ar" ? "المُرشّحة" : "Featured"}</span>
              <Leaf className="size-9 text-amber-600 dark:text-amber-400 animate-spin-slow" />
            </div>
          </h2>
          <p className="mt-4 text-lg text-amber-600/70 dark:text-amber-400/70 max-w-md mx-auto">
            {lang === "ar" ? "دول أهم الكورسات اللي جمعناهالك هنا" : "Our featured courses for you"}
          </p>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Main Courses Component
// ============================================

export const Courses = ({ limit = 4 }: { limit?: number }) => {
  const { lang, dir } = useLang();
  const { theme } = useTheme();
  const { featured_courses, slug, pick, isLoading } = useSafeTeacherData();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  const isDark = document.documentElement.classList.contains('dark');
  const isNature = theme === 'nature';
  const allCourses = Array.isArray(featured_courses) ? featured_courses : [];
  const displayCourses = limit ? allCourses.slice(0, limit) : allCourses;
  const validCourses = displayCourses.filter((course: any) => course && typeof course === 'object');
  
  if (isLoading) {
    return <CoursesSkeleton isNature={isNature} isDark={isDark} />;
  }
  
  if (!validCourses.length) {
    return null;
  }
  
  if (isNature) {
    return <NatureCarouselCourses courses={validCourses} pick={pick} slug={slug} lang={lang} Arrow={Arrow} dir={dir} isDark={isDark} />;
  }
  
  return (
    <section id="courses" className="py-24 md:py-32 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* ✅ خلفية متحركة قوية وواضحة */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* كتب كبيرة متحركة - يمين */}
        <motion.div
          animate={{ 
            y: [0, -30, 0, 30, 0],
            rotate: [0, 10, -10, 5, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-10 right-10 opacity-20 dark:opacity-10"
        >
          <div className="relative">
            <BookOpen className="w-32 h-32 text-blue-500 drop-shadow-2xl" strokeWidth={1} />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* كتاب كبير متحرك - يسار */}
        <motion.div
          animate={{ 
            y: [0, 40, 0, -40, 0],
            rotate: [0, -15, 10, -5, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-10 opacity-20 dark:opacity-10"
        >
          <div className="relative">
            <BookOpen className="w-40 h-40 text-emerald-500 drop-shadow-2xl" strokeWidth={1} />
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-3 -left-3"
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* كتاب متوسط - أعلى الوسط */}
        <motion.div
          animate={{ 
            y: [0, -25, 0, 25, 0],
            rotate: [0, 8, -12, 6, 0],
            scale: [1, 1.15, 0.95, 1.1, 1],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/4 left-1/4 opacity-15 dark:opacity-8"
        >
          <BookOpen className="w-24 h-24 text-purple-500 drop-shadow-2xl" strokeWidth={1} />
        </motion.div>
        
        {/* كتاب صغير جداً - يتحرك بسرعة */}
        <motion.div
          animate={{ 
            x: [0, 60, -40, 30, 0],
            y: [0, -20, 30, -15, 0],
            rotate: [0, 20, -25, 15, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-1/3 right-1/4 opacity-30 dark:opacity-20"
        >
          <BookOpen className="w-12 h-12 text-amber-500 drop-shadow-xl" strokeWidth={1.5} />
        </motion.div>

        {/* ⭐ نجوم كبيرة متلألئة */}
        <motion.div
          animate={{ 
            scale: [1, 1.8, 1.2, 2, 1],
            opacity: [0.2, 0.9, 0.5, 1, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/5 right-1/3"
        >
          <svg className="w-8 h-8 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </motion.div>
        
        <motion.div
          animate={{ 
            scale: [1, 1.5, 0.8, 1.7, 1],
            opacity: [0.1, 0.8, 0.3, 1, 0.1],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute bottom-1/4 left-1/4"
        >
          <svg className="w-10 h-10 text-amber-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </motion.div>
        
        <motion.div
          animate={{ 
            scale: [1, 2, 1.5, 2.2, 1],
            opacity: [0.15, 0.7, 0.4, 0.9, 0.15],
            x: [0, 20, -15, 10, 0],
            y: [0, -15, 10, -5, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2.5
          }}
          className="absolute top-2/3 right-1/5"
        >
          <svg className="w-6 h-6 text-yellow-300 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </motion.div>

        {/* كرات ملونة كبيرة متحركة بشكل واضح */}
        <motion.div
          animate={{ 
            x: [0, 80, -60, 100, -40, 0],
            y: [0, -50, 40, -70, 30, 0],
            scale: [1, 1.3, 0.8, 1.4, 0.9, 1],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/3 left-5 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"
        />
        
        <motion.div
          animate={{ 
            x: [0, -70, 50, -90, 40, 0],
            y: [0, 40, -60, 50, -30, 0],
            scale: [1, 1.2, 0.9, 1.3, 0.8, 1],
          }}
          transition={{ 
            duration: 22, 
            repeat: Infinity, 
            ease: "linear",
            delay: 2
          }}
          className="absolute bottom-1/3 right-5 w-56 h-56 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-3xl"
        />
        
        <motion.div
          animate={{ 
            x: [0, 50, -80, 40, -60, 0],
            y: [0, -60, 30, -80, 50, 0],
            scale: [1, 1.4, 0.7, 1.5, 0.8, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear",
            delay: 4
          }}
          className="absolute top-2/3 left-1/3 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
        />

        {/* دوائر متحدة المركز */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 2, 1.5, 1],
            opacity: [0.3, 0.15, 0.05, 0.15, 0.3],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-blue-400/20"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1.6, 1.3, 1],
            opacity: [0.2, 0.1, 0.05, 0.1, 0.2],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full border border-emerald-400/20"
        />

        {/* جزيئات متطايرة كتيرة */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -150, -300],
              x: [null, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 300],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeOut",
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400"
          />
        ))}

        {/* جزيئات ذهبية */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`gold-${i}`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, -200],
              x: [null, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 200],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
            className="absolute w-1 h-1 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"
          />
        ))}
      </div>
      
      {/* بقع ضبابية متحركة */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, -50, 150, 0],
            y: [0, -80, 60, -100, 0],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            x: [0, -80, 60, -120, 0],
            y: [0, 60, -80, 50, 0],
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear",
            delay: 3
          }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container-tight relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-5 backdrop-blur-sm"
          >
            <BookOpen className="w-4 h-4 animate-pulse" />
            {lang === "ar" ? "أحدث الكورسات" : "Latest Courses"}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance leading-[1.1]"
          >
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              {lang === "ar" ? "اكتشف محتوى يساعدك تتفوق" : "Discover content that helps you excel"}
            </span>
          </motion.h2>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {validCourses.map((course: any, i: number) => (
            <DefaultCourseCard
              key={course?.id || i}
              course={course}
              index={i}
              slug={slug}
              pick={pick}
              lang={lang}
              Arrow={Arrow}
              isDark={isDark}
            />
          ))}
        </div>
        
        {limit && allCourses.length > limit && (
          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={`/${slug}/courses`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all group"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                {lang === "ar" ? "جميع الكورسات" : "All Courses"}
                <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================
// Skeleton Component مُحسّن
// ============================================

const CoursesSkeleton = ({ isNature, isDark }: { isNature: boolean; isDark: boolean }) => {
  if (isNature) {
    return (
      <section className="py-24 md:py-32 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-tight">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-amber-200 dark:bg-amber-800 rounded-full mx-auto mb-5 animate-pulse" />
            <div className="h-12 w-80 bg-amber-100 dark:bg-amber-900 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-[2rem] p-1.5 bg-amber-200 dark:bg-amber-800">
                <div className="bg-white dark:bg-gray-800 rounded-[1.7rem] overflow-hidden">
                  <div className="h-72 bg-amber-100 dark:bg-gray-700 animate-pulse" />
                  <div className="p-6 text-center">
                    <div className="h-6 bg-amber-100 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2 animate-pulse" />
                    <div className="h-4 bg-amber-50 dark:bg-gray-800 rounded w-1/2 mx-auto mb-4 animate-pulse" />
                    <div className="h-8 bg-amber-100 dark:bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="h-12 bg-amber-100 dark:bg-amber-900 rounded-lg w-3/4 mx-auto animate-pulse" />
              <div className="h-4 bg-amber-50 dark:bg-gray-800 rounded w-1/2 mx-auto mt-4 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-gray-950">
    <div className="container-tight">
      <div className="text-center mb-16">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-5 animate-pulse" />
        <div className="h-12 w-80 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700">
            <div className="h-36 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Courses;