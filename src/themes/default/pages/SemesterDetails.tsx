/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/SemesterDetails.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useTeacher } from "@/context/TeacherContext";
import { useSemesterCourses } from "@/hooks/useCourses";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useBuyCourse } from "@/hooks/useEnroll";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, BookOpen, Clock, Award, 
  Users, Calendar, ChevronRight, Lock, Unlock,
  PlayCircle, FileQuestion, ClipboardList, CheckCircle,
  Loader2, GraduationCap, DollarSign, Percent, ShoppingCart,
  Eye, XCircle, Leaf, Sparkles
} from "lucide-react";
import { toast  } from "@/hooks/use-toast";

const SemesterDetails = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug, semesterId } = useParams();
  const { teacher, pick } = useTeacher();
  const { isAuthenticated, student } = useStudentAuth();
  const { data: coursesData, isLoading, refetch: refetchCourses } = useSemesterCourses(parseInt(semesterId || '0'));
  const { buyCourse, isLoading: buying } = useBuyCourse();
  const navigate = useNavigate();
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  // الألوان حسب الثيم
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  const bgColor = isNature ? 'bg-cream' : 'bg-background';
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  const statColors = isNature 
    ? [
        "from-amber-500 to-orange-600",
        "from-amber-600 to-orange-700",
        "from-amber-500 to-orange-600",
        "from-amber-600 to-orange-700"
      ]
    : [
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-orange-500 to-red-600",
        "from-purple-500 to-pink-600"
      ];
  
  const semester = teacher?.website?.semesters?.find((s: any) => s.id === parseInt(semesterId || '0'));
  const courses = coursesData?.data || [];
  
  if (isLoading) {
    return <SemesterSkeleton isNature={isNature} />;
  }
  
  return (
    <div className={`min-h-screen pt-32 pb-20 ${bgColor}`}>
      <div className="container-tight">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-foreground/60 flex-wrap">
            <Link to={`/${slug}`} className={`hover:${isNature ? 'text-amber-600' : 'text-primary'} transition-colors`}>
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${slug}/semesters`} className={`hover:${isNature ? 'text-amber-600' : 'text-primary'} transition-colors`}>
              {lang === "ar" ? "الترمات" : "Semesters"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={`${isNature ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'} line-clamp-1`}>
              {pick(semester?.name, semester?.name_ar)}
            </span>
          </div>
        </motion.div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl md:text-4xl font-black ${isNature ? 'text-amber-800 dark:text-amber-100' : ''}`}>
            {pick(semester?.name, semester?.name_ar)}
          </h1>
          <p className="text-foreground/60 mt-2">
            {lang === "ar" 
              ? `استعرض جميع الكورسات المتاحة في ${pick(semester?.name, semester?.name_ar)}`
              : `Browse all courses available in ${pick(semester?.name, semester?.name_ar)}`}
          </p>
        </motion.div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatCard 
            icon={<BookOpen className="w-5 h-5" />}
            label={lang === "ar" ? "الكورسات" : "Courses"}
            value={courses.length}
            color={statColors[0]}
            isNature={isNature}
          />
          <StatCard 
            icon={<Users className="w-5 h-5" />}
            label={lang === "ar" ? "عدد الطلاب" : "Students"}
            value={courses.reduce((acc, c) => acc + (c.count_student || 0), 0)}
            color={statColors[1]}
            isNature={isNature}
          />
        </div>
        
        {/* Courses List */}
        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full grid place-items-center
              ${isNature ? 'bg-amber-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {isNature ? <Leaf className="w-12 h-12 text-amber-400" /> : <BookOpen className="w-12 h-12 text-foreground/30" />}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {lang === "ar" ? "لا توجد كورسات" : "No courses found"}
            </h3>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {courses.map((course: any, idx: number) => (
              <CourseSection
                key={course.id}
                course={course}
                index={idx}
                slug={slug!}
                lang={lang}
                pick={pick}
                isAuthenticated={isAuthenticated}
                studentId={student?.id}
                navigate={navigate}
                isNature={isNature}
                isDark={isDark}
                primaryGradient={primaryGradient}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 🟢 Course Section Component (معدل للثيمات)
const CourseSection = ({ course, index, slug, lang, pick, isAuthenticated, studentId, navigate, isNature, isDark, primaryGradient }: any) => {
  const [expanded, setExpanded] = useState(false);
  const [buying, setBuying] = useState(false);
  const { buyCourse } = useBuyCourse();
  
  const courseTitle = pick(course.title, course.title_ar) || "Course";
  const courseImage = course.image?.fullUrl || course.imageUrl || "/default-course.jpg";
  const originalPrice = parseFloat(course.price) || 0;
  const discount = parseFloat(course.discount) || 0;
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
      setTimeout(() => navigate(`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
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
    navigate(`/${slug}/courses/${course.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl border overflow-hidden transition-all hover:shadow-md
        ${cardBg} ${cardBorder}`}
    >
      {/* Course Header */}
      <div 
        className={`p-6 cursor-pointer transition-colors
          ${isNature 
            ? (isDark ? 'hover:bg-amber-800/30' : 'hover:bg-amber-50') 
            : 'hover:bg-primary/5'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          {/* Course Image */}
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
            <img 
              src={courseImage} 
              alt={courseTitle}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "/default-course.jpg"; }}
            />
          </div>
          
          {/* Course Info */}
          <div className="flex-1">
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
            <h3 className={`text-xl font-bold transition-colors ${titleColor}`}>
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
                  <span className={`text-xl font-black ${priceColor}`}>{finalPrice.toFixed(2)} EGP</span>
                  <span className="text-xs text-foreground/40 line-through">{originalPrice.toFixed(2)} EGP</span>
                  <span className="text-xs text-red-500">-{discount}%</span>
                </div>
              ) : (
                <span className={`text-xl font-black ${priceColor}`}>{originalPrice.toFixed(2)} EGP</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className={`transform transition-transform ${expanded ? 'rotate-90' : ''}`}>
              <ChevronRight className={`w-5 h-5 ${isNature ? 'text-amber-400' : 'text-foreground/40'}`} />
            </div>
            {!hasPurchased && (
              <button
                onClick={handleBuyCourse}
                disabled={buying}
                className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1
                  ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'gradient-primary'}`}
              >
                {buying ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingCart className="w-3 h-3" />}
                {lang === "ar" ? "شراء" : "Buy"}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Content - Lessons & Exams */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t" style={{ borderColor: isNature ? (isDark ? '#854d0e' : '#fde68a') : 'var(--border)' }}
          >
            <div className="p-6 bg-secondary/20">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
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

// 🟢 Lesson Item Component (معدل للثيمات)
const LessonItem = ({ lesson, index, slug, lang, isAuthenticated, isNature, isDark }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const lessonTitle = lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title;
  const isPurchased = isAuthenticated;
  const isFree = parseFloat(lesson.price) === 0;
  const canWatch = isPurchased || isFree;
  
  const handleWatch = () => {
    navigate(`/${slug}/lesson/${lesson.id}`);
  };
  
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  const hoverBg = isNature 
    ? (isDark ? 'hover:bg-amber-800/30' : 'hover:bg-amber-50') 
    : 'hover:bg-primary/5';
  const numberBg = isNature 
    ? (isDark ? 'bg-amber-700' : 'bg-amber-600') 
    : 'bg-primary/10';
  
  return (
    <div className={`rounded-xl border overflow-hidden ${cardBg} ${cardBorder}`}>
      <div 
        className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${hoverBg}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold
            ${numberBg} ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-primary'}`}>
            {index + 1}
          </div>
          <div>
            <h5 className="font-medium">{lessonTitle}</h5>
            <div className="flex items-center gap-2 text-xs text-foreground/40">
              <span>{new Date(lesson.lession_date).toLocaleDateString()}</span>
              <span>{lesson.lession_time}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isFree && !isPurchased && (
            <span className={`text-sm font-bold ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
              {parseFloat(lesson.price).toFixed(2)} EGP
            </span>
          )}
          
          {canWatch && (
            <button
              onClick={handleWatch}
              className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1
                ${isNature ? 'bg-amber-600 hover:bg-amber-700' : 'gradient-primary'}`}
            >
              <PlayCircle className="w-3 h-3" />
              {lang === "ar" ? "مشاهدة" : "Watch"}
            </button>
          )}
          
          {!canWatch && !isFree && (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1
              ${isNature 
                ? 'bg-amber-100 text-amber-500 dark:bg-amber-800 dark:text-amber-500' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground/40'}`}>
              <Lock className="w-3 h-3" />
              {lang === "ar" ? "مقفل" : "Locked"}
            </div>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 pt-0 border-t" style={{ borderColor: isNature ? (isDark ? '#854d0e' : '#fde68a') : 'var(--border)' }}>
          <p className="text-sm text-foreground/60">
            {lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description}
          </p>
        </div>
      )}
    </div>
  );
};

// 🟢 Stat Card (معدل للثيمات)
const StatCard = ({ icon, label, value, color, isNature }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-4 text-white shadow-lg`}
  >
    <div className="flex items-center justify-between">
      {icon}
      <span className="text-2xl font-black">{value}</span>
    </div>
    <p className="text-sm opacity-90 mt-2">{label}</p>
  </motion.div>
);

// 🟢 Skeleton (معدل للثيمات)
const SemesterSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <div className={`min-h-screen pt-32 pb-20 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className={`h-8 w-48 rounded-lg mb-8 animate-pulse ${isNature ? 'bg-amber-200' : 'bg-gray-200 dark:bg-gray-700'}`} />
        <div className={`h-12 w-3/4 rounded-lg mb-4 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1,2].map(i => (
            <div key={i} className={`h-24 rounded-xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>
        <div className="space-y-4">
          {[1,2].map(i => (
            <div key={i} className={`rounded-2xl p-6 animate-pulse ${isNature ? 'bg-white border border-amber-200' : 'bg-card'}`}>
              <div className="flex gap-4">
                <div className={`w-24 h-24 rounded-xl ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className="flex-1">
                  <div className={`h-6 rounded w-1/3 mb-2 ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  <div className={`h-4 rounded w-1/2 ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SemesterDetails;