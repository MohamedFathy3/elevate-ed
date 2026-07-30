// src/pages/semester-details/components/CourseSection.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, BookOpen, Users, ShoppingCart, Loader2,
  PlayCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useBuyCourse } from "@/hooks/useEnroll";
import { OptimizedImage } from "@/components/OptimizedImage"; // ✅ استيراد
import { CourseSectionProps } from "../SemesterDetails.types";
import { LessonItem } from "./LessonItem";

export const CourseSection = ({ 
  course, 
  index, 
  slug, 
  lang, 
  pick, 
  isAuthenticated, 
  navigate,
  isNature, 
  isDark,
  primaryGradient
}: CourseSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const [buying, setBuying] = useState(false);
  const { buyCourse } = useBuyCourse();
  
  const courseTitle = pick(course.title, course.title_ar) || "Course";
  const courseImage = course.image?.fullUrl || course.imageUrl || "/default-course.jpg";
  const originalPrice = parseFloat(String(course.price || 0));
  const discount = parseFloat(String(course.discount || 0));
  const finalPrice = originalPrice - (originalPrice * discount / 100);
  const hasDiscount = discount > 0;
  const lessons = course.details || [];
  const hasPurchased = isAuthenticated;
  
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  const titleColor = isNature 
    ? (isDark ? 'text-amber-200' : 'text-amber-800') 
    : '';
  const priceColor = isNature 
    ? (isDark ? 'text-amber-400' : 'text-amber-600') 
    : 'text-primary';
  
  const handleBuyCourse = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
      return;
    }
    
    setBuying(true);
    try {
      await buyCourse(course.id, finalPrice);
      toast.success(lang === "ar" ? "تم شراء الكورس بنجاح!" : "Course purchased successfully!");
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setBuying(false);
    }
  };
  
  const goToCourseDetails = () => {
    navigate(`/courses/${course.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.08, 0.4) }}
      className={`rounded-2xl border overflow-hidden transition-all hover:shadow-md
        ${cardBg} ${cardBorder}`}
    >
      {/* Course Header */}
      <div 
        className={`p-4 md:p-6 cursor-pointer transition-colors
          ${isNature 
            ? (isDark ? 'hover:bg-amber-800/30' : 'hover:bg-amber-50') 
            : 'hover:bg-primary/5'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          {/* ✅ Course Image - باستخدام OptimizedImage */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
            <OptimizedImage
              src={courseImage}
              alt={courseTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              width={120}
              height={120}
              priority={index < 3} // ✅ أول 3 صور priority عالية
            />
          </div>
          
          {/* Course Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs
                ${isNature 
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300' 
                  : 'bg-primary/10 text-primary'}`}>
                {course.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center")}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs
                ${isNature 
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300' 
                  : 'bg-accent/10 text-accent'}`}>
                {pick(course.subject?.name, course.subject?.name_ar)}
              </span>
            </div>
            <h3 className={`text-lg md:text-xl font-bold transition-colors truncate ${titleColor}`}>
              {courseTitle}
            </h3>
            <p className="text-sm text-foreground/60 line-clamp-2 mt-1">
              {pick(course.description, course.description_ar)?.replace(/<[^>]*>/g, '')}
            </p>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-foreground/50">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {lessons.length} {lang === "ar" ? "دروس" : "lessons"}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {course.count_student || 0} {lang === "ar" ? "طالب" : "students"}
              </span>
            </div>
            
            {/* Price */}
            <div className="mt-3">
              {hasDiscount ? (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`text-lg md:text-xl font-black ${priceColor}`}>{finalPrice.toFixed(2)}</span>
                  <span className="text-xs text-foreground/40 line-through">{originalPrice.toFixed(2)}</span>
                  <span className="text-xs text-red-500">-{discount}%</span>
                </div>
              ) : (
                <span className={`text-lg md:text-xl font-black ${priceColor}`}>{originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className={`transform transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
              <ChevronRight className={`w-5 h-5 ${isNature ? 'text-amber-400' : 'text-foreground/40'}`} />
            </div>
            {!hasPurchased && (
              <button
                onClick={handleBuyCourse}
                disabled={buying}
                className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1
                  ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
              >
                {buying ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingCart className="w-3 h-3" />}
                <span className="hidden sm:inline">{lang === "ar" ? "شراء" : "Buy"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t" 
            style={{ borderColor: isNature ? (isDark ? '#854d0e' : '#fde68a') : 'var(--border)' }}
          >
            <div className="p-4 md:p-6 bg-secondary/20">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm md:text-base">
                <PlayCircle className={`w-4 h-4 ${isNature ? 'text-amber-600' : 'text-primary'}`} />
                {lang === "ar" ? "محتويات الكورس" : "Course Content"}
              </h4>
              
              <div className="space-y-3">
                {lessons.slice(0, 3).map((lesson: any, idx: number) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    index={idx}
                    slug={slug}
                    lang={lang}
                    isAuthenticated={isAuthenticated}
                    isNature={isNature}
                    isDark={isDark}
                  />
                ))}
              </div>
              
              {lessons.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={goToCourseDetails}
                    className={`inline-flex items-center gap-1 text-sm hover:underline
                      ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}
                  >
                    {lang === "ar" ? "عرض كل التفاصيل" : "View all details"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};