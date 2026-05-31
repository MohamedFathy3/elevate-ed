/* eslint-disable @typescript-eslint/no-explicit-any */
// components/site/Courses.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { useSafeTeacherData } from "@/hooks/useSafeTeacherData";
import { useBuyCourse } from "@/hooks/useEnroll";
import { useTheme } from "@/context/ThemeContext";
import { 
  ArrowRight, ArrowLeft, BookOpen, Atom, Zap, Sparkles, 
  Users, Calendar, Percent, GraduationCap, BookMarked, Award, 
  ShoppingCart, Loader2, Leaf, Flower2, Trees, Clock
} from "lucide-react";
import { Link } from "react-router-dom";

// ============================================
// أيقونات وألوان الثيمات
// ============================================

// أيقونات الثيم nature (للكاروسيل)
const NATURE_ICONS = [Leaf, Flower2, Trees, Sparkles, Award, BookMarked];
// أيقونات الثيم default (للكروت)
const DEFAULT_ICONS = [Atom, Zap, BookOpen, Sparkles, Award, BookMarked];

// ألوان الثيم default (للكروت)
const DEFAULT_COLORS = [
  "gradient-primary",
  "bg-gradient-to-br from-orange-400 to-pink-500",
  "bg-gradient-to-br from-blue-500 to-indigo-600",
  "bg-gradient-to-br from-emerald-400 to-teal-600",
  "bg-gradient-to-br from-purple-500 to-fuchsia-600",
  "bg-gradient-to-br from-rose-400 to-red-500",
];

// ============================================
// Course Card Component للثيم default (Grid)
// ============================================

const DefaultCourseCard = ({ course, index, slug, pick, lang, Arrow }: any) => {
  const [isBuying, setIsBuying] = useState(false);
  const { buyCourse } = useBuyCourse();
  
  if (!course) return null;
  
  const Icon = DEFAULT_ICONS[(index || 0) % DEFAULT_ICONS.length];
  const color = DEFAULT_COLORS[(index || 0) % DEFAULT_COLORS.length];
  
  // حساب السعر والخصم
  const originalPrice = parseFloat(course?.price) || 0;
  const discountPercent = parseFloat(course?.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;
  
  // الصورة
  const courseImage = course?.image?.fullUrl || course?.imageUrl || null;
  
  // البيانات الأساسية
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  
  // البيانات الإضافية
  const stageName = pick(course?.stage?.name, course?.stage?.name_ar) || "";
  const subjectName = pick(course?.subject?.name, course?.subject?.name_ar) || "";
  const semesterName = pick(course?.semester?.name, course?.semester?.name_ar) || "";
  const studentsCount = course?.count_student || 0;
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
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-6 -top-6 opacity-20"
        >
          <Icon className="w-32 h-32 text-white" strokeWidth={1} />
        </motion.div>
        
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold shadow-lg">
            <Percent className="w-3 h-3" />
            <span>{discountPercent}% OFF</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {type}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        {/* Tags */}
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
            
            <div className="flex gap-2">
              <button
                onClick={handleBuy}
                disabled={isBuying}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-soft hover:shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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

// ============================================
// Carousel Component للثيم nature (الدائري)
// ============================================

const NatureCarouselCourses = ({ courses, pick, slug, lang, Arrow, dir }: any) => {
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
  const studentsCount = c?.count_student || 0;
  const courseImage = c?.image?.fullUrl || c?.imageUrl || null;
  const courseTitle = pick(c?.title, c?.title_ar) || "Course";
  const courseDescription = pick(c?.description, c?.description_ar) || "";
  const type = c?.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center");
  
  return (
    <section className="py-20 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Carousel */}
        <div className="relative order-2 lg:order-1">
          <div className="relative rounded-[2rem] p-1.5 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 shadow-soft">
            <div className="relative bg-white rounded-[1.7rem] overflow-hidden animate-fade-in">
              <div className="relative h-72 bg-gradient-to-br from-amber-200 to-amber-100 grid place-items-center overflow-hidden">
                {courseImage ? (
                  <img 
                    src={courseImage} 
                    alt={courseTitle} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Leaf className="w-24 h-24 text-amber-300" />
                )}
                {hasDiscount && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-black shadow-soft">
                    {discount}% OFF
                  </span>
                )}
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                  {type}
                </div>
                <button
                  onClick={() => go(-1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-soft hover:bg-white hover:scale-110 transition"
                >
                  <ArrowRight className="size-5 text-amber-600" />
                </button>
                <button
                  onClick={() => go(1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-soft hover:bg-white hover:scale-110 transition"
                >
                  <ArrowIcon className="size-5 text-amber-600" />
                </button>
              </div>

              <div className="p-6 text-center">
                <h3 className="font-extrabold text-xl text-amber-800">{courseTitle}</h3>
                <p className="mt-1 text-sm text-amber-600/70">{courseDescription.replace(/<[^>]*>/g, '')}</p>

                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-600">
                  <Users className="w-3 h-3" />
                  <span>{studentsCount} {lang === "ar" ? "طالب" : "students"}</span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-black text-amber-700">{finalPrice.toFixed(2)} EGP</span>
                      <span className="text-sm text-amber-400 line-through">{originalPrice.toFixed(2)} EGP</span>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-amber-700">{originalPrice.toFixed(2)} EGP</span>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link to={`/${slug}/courses/${c?.id}`} className="px-4 py-3 rounded-xl bg-amber-600 text-white text-sm font-bold hover-lift">
                    {lang === "ar" ? "اشترك الآن" : "Enroll Now"}
                  </Link>
                  <Link to={`/${slug}/courses/${c?.id}`} className="px-4 py-3 rounded-xl bg-amber-100 text-amber-700 text-sm font-bold border border-amber-200 hover-lift">
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
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-amber-600" : "w-2 bg-amber-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="order-1 lg:order-2 text-center lg:text-right relative">
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            <Leaf className="inline-block size-9 text-amber-600 animate-spin-slow mx-2" />
            <span className="text-amber-700">{lang === "ar" ? "الكورسات" : "Courses"}</span>
            <span className="text-amber-600"> {lang === "ar" ? "المُرشّحة" : "Featured"}</span>
            <Leaf className="inline-block size-9 text-amber-600 animate-spin-slow mx-2" />
          </h2>
          <p className="mt-4 text-lg text-amber-600/70">
            {lang === "ar" ? "دول أهم الكورسات اللي جمعناهالك هنا" : "Our featured courses for you"}
          </p>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Main Courses Component (يختار الشكل حسب الثيم)
// ============================================

export const Courses = ({ limit = 4 }: { limit?: number }) => {
  const { lang, dir } = useLang();
  const { theme } = useTheme();
  const { courses, slug, pick, isLoading } = useSafeTeacherData();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  const isNature = theme === 'nature';
  const allCourses = Array.isArray(courses) ? courses : [];
  const displayCourses = limit ? allCourses.slice(0, limit) : allCourses;
  const validCourses = displayCourses.filter((course: any) => course && typeof course === 'object');
  
  if (isLoading) {
    return <CoursesSkeleton isNature={isNature} />;
  }
  
  if (!validCourses.length) {
    return null;
  }
  
  // ✅ الثيم nature: استخدم الكاروسيل
  if (isNature) {
    return <NatureCarouselCourses courses={validCourses} pick={pick} slug={slug} lang={lang} Arrow={Arrow} dir={dir} />;
  }
  
  // ✅ الثيم default: استخدم الـ Grid مع البطاقات
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
            <DefaultCourseCard
              key={course?.id || i}
              course={course}
              index={i}
              slug={slug}
              pick={pick}
              lang={lang}
              Arrow={Arrow}
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

// ============================================
// Skeleton Component
// ============================================

const CoursesSkeleton = ({ isNature }: { isNature: boolean }) => {
  if (isNature) {
    return (
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-tight">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-amber-200 rounded-full mx-auto mb-5 animate-pulse" />
            <div className="h-12 w-80 bg-amber-100 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-[2rem] p-1.5 bg-amber-200">
                <div className="bg-white rounded-[1.7rem] overflow-hidden">
                  <div className="h-72 bg-amber-100 animate-pulse" />
                  <div className="p-6 text-center">
                    <div className="h-6 bg-amber-100 rounded w-3/4 mx-auto mb-2 animate-pulse" />
                    <div className="h-4 bg-amber-50 rounded w-1/2 mx-auto mb-4 animate-pulse" />
                    <div className="h-8 bg-amber-100 rounded w-1/3 mx-auto animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="h-12 bg-amber-100 rounded-lg w-3/4 mx-auto animate-pulse" />
              <div className="h-4 bg-amber-50 rounded w-1/2 mx-auto mt-4 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
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

export default Courses;