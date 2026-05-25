/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/Courses.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useBuyCourse } from "@/hooks/useEnroll";
import { ArrowRight, ArrowLeft, Clock, BookOpen, Atom, Zap, Sparkles, Users, Calendar, Percent, GraduationCap, BookMarked, Award, ShoppingCart, Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ICONS = [Atom, Zap, BookOpen, Sparkles, Award, BookMarked];
const COLORS = [
  "gradient-primary",
  "bg-gradient-to-br from-orange-400 to-pink-500",
  "bg-gradient-to-br from-blue-500 to-indigo-600",
  "bg-gradient-to-br from-emerald-400 to-teal-600",
  "bg-gradient-to-br from-purple-500 to-fuchsia-600",
  "bg-gradient-to-br from-rose-400 to-red-500",
];

// 🟢 Course Card Component with Buy Button
export const CourseCard = ({ course, index, slug, pick, lang, Arrow, dir }: any) => {
  const [isBuying, setIsBuying] = useState(false);
  const { buyCourse } = useBuyCourse();
  
  if (!course) return null;
  
  const Icon = ICONS[(index || 0) % ICONS.length];
  const color = COLORS[(index || 0) % COLORS.length];
  
  // حساب الخصم
  const originalPrice = parseFloat(course?.price) || 0;
  const discountPercent = parseFloat(course?.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;
  
  // الصورة
  const courseImage = course?.image?.fullUrl || course?.imageUrl || null;
  
  // البيانات
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  const stageName = pick(course?.stage?.name, course?.stage?.name_ar) || "";
  const subjectName = pick(course?.subject?.name, course?.subject?.name_ar) || "";
  const semesterName = pick(course?.semester?.name, course?.semester?.name_ar) || "";
  const lessonsCount = course?.details?.length || 0;
  const studentsCount = course?.count_student || 0;
  
  // معالجة الشراء
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
      className="group relative bg-card rounded-2xl shadow-card hover:shadow-elegant transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Header Section */}
      <div className={`relative h-36 overflow-hidden ${color}`}>
        {courseImage ? (
          <>
            <img
              src={courseImage}
              alt={courseTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-white/30" strokeWidth={1} />
          </div>
        )}
        
        {/* Animated Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-6 -top-6 opacity-20"
        >
          <Icon className="w-32 h-32 text-white" strokeWidth={1} />
        </motion.div>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold shadow-lg">
            <Percent className="w-3 h-3" />
            <span>{discountPercent}% OFF</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Stage, Subject, Semester Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {stageName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
              <GraduationCap className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{stageName}</span>
            </span>
          )}
          {subjectName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
              <BookMarked className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{subjectName}</span>
            </span>
          )}
          {semesterName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-foreground/70 text-xs">
              <Calendar className="w-3 h-3" />
              <span className="line-clamp-1 max-w-[80px]">{semesterName}</span>
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[48px]">
          {courseTitle}
        </h3>
        
        {/* Description */}
        {courseDescription && (
          <p className="text-xs text-foreground/60 line-clamp-2 mb-3 min-h-[32px]">
            {courseDescription.replace(/<[^>]*>/g, '')}
          </p>
        )}
        
        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-foreground/50">
          {lessonsCount > 0 && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{lessonsCount} {lang === "ar" ? "دروس" : "lessons"}</span>
            </div>
          )}
          {studentsCount > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{studentsCount} {lang === "ar" ? "طالب" : "students"}</span>
            </div>
          )}
        </div>
        
        {/* Price and Buttons */}
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div>
              {hasDiscount ? (
                <div className="flex flex-col">
                  <span className="text-xl font-black text-primary">{finalPrice.toFixed(2)} EGP</span>
                  <span className="text-xs text-foreground/40 line-through">{originalPrice.toFixed(2)} EGP</span>
                </div>
              ) : (
                <span className="text-xl font-black text-primary">{originalPrice.toFixed(2)} EGP</span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Buy Button */}
              <button
                onClick={handleBuy}
                disabled={isBuying}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                <span>{lang === "ar" ? "شراء" : "Buy"}</span>
              </button>
              
              {/* Details Link */}
              <Link
                to={`/${slug}/courses/${course?.id}`}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-card border border-border text-foreground font-semibold text-xs hover:border-primary/40 hover:bg-primary/5 transition-all"
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

// 🟢 Main Courses Component
export const Courses = ({ limit }: { limit?: number }) => {
  const { lang, dir } = useLang();
  const { courses, slug, pick, isLoading, teacher } = useSafeTeacherData();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  const allCourses = Array.isArray(courses) ? courses : [];
  const displayCourses = limit ? allCourses.slice(0, limit) : allCourses;
  const validCourses = displayCourses.filter((course: any) => course && typeof course === 'object');
  
  if (isLoading) {
    return <CoursesSkeleton />;
  }
  
  if (!validCourses.length) {
    return null;
  }
  
  return (
    <section id="courses" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      </div>
      
      <div className="container-tight relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold text-sm mb-5 backdrop-blur-sm"
          >
            <BookOpen className="w-4 h-4" />
            {lang === "ar" ? "أحدث الكورسات" : "Latest Courses"}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance leading-[1.1]"
          >
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {lang === "ar" ? "اكتشف محتوى يساعدك تتفوق" : "Discover content that helps you excel"}
            </span>
          </motion.h2>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {validCourses.map((course: any, i: number) => (
            <CourseCard
              key={course?.id || i}
              course={course}
              index={i}
              slug={slug}
              pick={pick}
              lang={lang}
              Arrow={Arrow}
              dir={dir}
            />
          ))}
        </div>
        
        {limit && allCourses.length > limit && (
          <div className="text-center mt-12">
            <Link
              to={`/${slug}/courses`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group"
            >
              <Sparkles className="w-4 h-4" />
              {lang === "ar" ? "جميع الكورسات" : "All Courses"}
              <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// 🟢 Skeleton Component
const CoursesSkeleton = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container-tight">
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-5 animate-pulse" />
          <div className="h-12 w-80 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
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