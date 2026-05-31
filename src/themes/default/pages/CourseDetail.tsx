/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { useTheme } from "@/context/ThemeContext";
import { useStudentCourses, useCourseDetails } from "@/hooks/useCourseDetails";
import { useBuyCourse } from "@/hooks/useEnroll";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { 
  Clock, Atom, ArrowLeft, ArrowRight, CheckCircle2, 
  PlayCircle, ShoppingCart, Lock, Calendar, 
  Loader2, Shield, Leaf, Sparkles, Users, Award, Star,
  Eye, Video, FileText, ExternalLink
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { enableFullProtection } from "@/utils/protection";
import Cookies from "js-cookie";

const CourseDetail = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { teacher, slug, pick } = useTeacher();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, student } = useStudentAuth();
  
  // جلب كورسات الطالب المشترك فيها
  const { data: studentCourses, isLoading: coursesLoading } = useStudentCourses();
  const { data: courseData, isLoading: detailsLoading, refetch: refetchDetails } = useCourseDetails(parseInt(courseId || '0'));
  const { buyCourse, buyLesson, isLoading: buying } = useBuyCourse();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const isNature = theme === 'nature';
  const isDark = colorMode === 'dark';
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [buyingLessonId, setBuyingLessonId] = useState<number | null>(null);
  const [buyingFullCourse, setBuyingFullCourse] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showProtectionWarning, setShowProtectionWarning] = useState(false);
  const [hasPurchasedFullCourse, setHasPurchasedFullCourse] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // الألوان حسب الثيم
  const primaryGradient = isNature 
    ? "from-amber-500 to-orange-600" 
    : "from-primary to-accent";
  const bgColor = isNature ? 'bg-cream' : 'bg-background';
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/30' : 'bg-white') 
    : (isDark ? 'bg-gray-800/50' : 'bg-card');
  const cardBorder = isNature 
    ? (isDark ? 'border-amber-700/50' : 'border-amber-200') 
    : (isDark ? 'border-gray-700' : 'border-border');

  // ✅ التحقق من شراء الكورس من بيانات الطالب
  useEffect(() => {
    if (studentCourses && studentCourses.length > 0 && courseId) {
      const isEnrolled = studentCourses.some((course: any) => course.id === parseInt(courseId || '0'));
      setHasPurchasedFullCourse(isEnrolled);
      console.log("🎓 Course enrollment check:", { courseId, isEnrolled });
    }
  }, [studentCourses, courseId]);

  // ✅ تعيين أول درس كافتراضي إذا كان الكورس مشترى
  useEffect(() => {
    if (hasPurchasedFullCourse && courseData?.data && courseData.data.length > 0 && !selectedLesson) {
      setSelectedLesson(courseData.data[0]);
    }
  }, [hasPurchasedFullCourse, courseData]);

  // تفعيل الحماية عند تحميل الصفحة
  useEffect(() => {
    enableFullProtection();
    setShowProtectionWarning(true);
    setTimeout(() => setShowProtectionWarning(false), 5000);
  }, []);

  const course = teacher?.website?.courses?.find((c: any) => String(c.id) === courseId);
  
  if ((!course && !detailsLoading) || (!course && !coursesLoading && !hasPurchasedFullCourse)) {
    return <Navigate to={`/${slug}/courses`} replace />;
  }
const goToLessonPage = (lessonId: number) => {
  navigate(`/${slug}/lesson/${lessonId}`);
};
  const lessons = courseData?.data || [];
  const courseImage = course?.image?.fullUrl || course?.imageUrl || "/default-course.jpg";
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  
  const originalPrice = parseFloat(course?.price) || 0;
  const discountPercent = parseFloat(course?.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;

  // ✅ شراء الكورس كاملاً
  const handleBuyFullCourse = async () => {
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setTimeout(() => navigate(`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
      return;
    }
    
    setBuyingFullCourse(true);
    try {
      await buyCourse(parseInt(courseId || '0'), finalPrice);
      toast.success(lang === "ar" ? "تم شراء الكورس بنجاح!" : "Course purchased successfully!");
      setHasPurchasedFullCourse(true);
      setTimeout(() => refetchDetails(), 1000);
    } catch (error: any) {
      console.error("Purchase error:", error);
    } finally {
      setBuyingFullCourse(false);
    }
  };

  // ✅ شراء درس فردي
  const handleBuyLesson = async (lessonId: number, price: number) => {
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setTimeout(() => navigate(`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
      return;
    }
    
    setBuyingLessonId(lessonId);
    try {
      await buyLesson(lessonId, price);
      toast.success(lang === "ar" ? "تم شراء الدرس بنجاح!" : "Lesson purchased successfully!");
      setTimeout(() => refetchDetails(), 1000);
      // تحديث حالة الدرس
      const updatedLesson = { ...selectedLesson, attended: true };
      setSelectedLesson(updatedLesson);
    } catch (error: any) {
      console.error("Purchase error:", error);
    } finally {
      setBuyingLessonId(null);
    }
  };

  // ✅ تحديد الدرس للمشاهدة
  const selectLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setVideoError(false);
  };

  // ✅ الحصول على رابط الفيديو المناسب
  const getVideoUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
    return url;
  };

  const isLoading = detailsLoading || coursesLoading;

  if (isLoading) {
    return <CourseDetailSkeleton isNature={isNature} />;
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`pt-36 md:pt-40 pb-24 min-h-screen ${bgColor}`}
    >
      <div className="container-tight">
        {/* تحذير الحماية */}
        <AnimatePresence>
          {showProtectionWarning && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
            >
              <Shield className="w-4 h-4" />
              {lang === "ar" ? "🔒 هذه الصفحة محمية ضد التصوير والاختراق" : "🔒 This page is protected against recording and hacking"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to={`/${slug}/courses`}
            className={`inline-flex items-center gap-2 text-sm ${isNature ? 'text-amber-600 hover:text-amber-700' : 'text-foreground/65 hover:text-primary'} mb-8 transition-colors`}
          >
            <Arrow className="w-4 h-4 rotate-180 rtl:rotate-0" />
            {lang === "ar" ? "كل الكورسات" : "All courses"}
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden shadow-elegant bg-black"
            >
              {hasPurchasedFullCourse && selectedLesson ? (
                <div className="relative">
                  {selectedLesson.content_link?.includes('youtube.com') || selectedLesson.content_link?.includes('youtu.be') ? (
                    <iframe
                      src={getVideoUrl(selectedLesson.content_link)}
                      className="w-full aspect-video"
                      title={selectedLesson.title}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      onError={() => setVideoError(true)}
                    />
                  ) : selectedLesson.content_link?.endsWith('.mp4') ? (
                    <video
                      ref={videoRef}
                      src={selectedLesson.content_link}
                      className="w-full aspect-video"
                      controls
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      onError={() => setVideoError(true)}
                    />
                  ) : selectedLesson.content_link?.endsWith('.pdf') ? (
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <div className="text-center p-8">
                        <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="mb-4">{lang === "ar" ? "ملف PDF" : "PDF File"}</p>
                        <a
                          href={selectedLesson.content_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white ${isNature ? 'bg-amber-600' : 'gradient-primary'}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          {lang === "ar" ? "فتح الملف" : "Open File"}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <ExternalLink className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                        <p className="text-foreground/60">
                          {lang === "ar" ? "جاري تجهيز المحتوى..." : "Preparing content..."}
                        </p>
                        <a
                          href={selectedLesson.content_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white ${isNature ? 'bg-amber-600' : 'gradient-primary'}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          {lang === "ar" ? "فتح الرابط" : "Open Link"}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <div className="text-center text-white p-4">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
                        <p>{lang === "ar" ? "عذراً، لا يمكن تحميل المحتوى" : "Sorry, cannot load content"}</p>
                        <a 
                          href={selectedLesson.content_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-3 inline-block px-4 py-2 rounded-lg bg-primary text-white text-sm"
                        >
                          {lang === "ar" ? "فتح الرابط مباشرة" : "Open Link Directly"}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className={`w-20 h-20 mx-auto mb-4 opacity-70 ${isNature ? 'text-amber-500' : 'text-primary'}`} />
                    <p className="text-foreground/60">
                      {hasPurchasedFullCourse 
                        ? (lang === "ar" ? "اختر درساً للمشاهدة من القائمة" : "Select a lesson to watch from the list")
                        : (lang === "ar" ? "اشتر الكورس لمشاهدة الدروس" : "Buy the course to watch lessons")}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Selected Lesson Info */}
            {selectedLesson && hasPurchasedFullCourse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-5 rounded-2xl ${isNature ? (isDark ? 'bg-amber-900/20' : 'bg-amber-50') : 'bg-secondary/30'}`}
              >
                <h3 className={`font-bold text-xl ${isNature ? 'text-amber-800 dark:text-amber-200' : ''}`}>
                  {lang === "ar" && selectedLesson.title_ar ? selectedLesson.title_ar : selectedLesson.title}
                </h3>
                <p className={`mt-2 ${isNature ? 'text-amber-700/70 dark:text-amber-300/70' : 'text-foreground/60'}`}>
                  {lang === "ar" && selectedLesson.description_ar ? selectedLesson.description_ar : selectedLesson.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-foreground/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedLesson.lession_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedLesson.lession_time}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Course Info */}
            <motion.div className="mt-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold
                  ${isNature 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300' 
                    : 'bg-primary/10 text-primary'}`}>
                  {course?.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center")}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                  ${isNature 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300' 
                    : 'bg-accent/10 text-accent'}`}>
                  {isNature ? <Leaf className="w-3 h-3" /> : <Atom className="w-3 h-3" />}
                  {pick(course?.subject?.name, course?.subject?.name_ar) || "Subject"}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                  ${isNature 
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' 
                    : 'bg-secondary'}`}>
                  <Clock className="w-3 h-3" />
                  {course?.hour_time_course || (lang === "ar" ? "مرن" : "Flexible")}
                </span>
              </div>
              <h1 className={`font-display font-black text-3xl md:text-5xl tracking-tight ${isNature ? 'text-amber-800 dark:text-amber-100' : ''}`}>
                {courseTitle}
              </h1>
              <div className={`mt-4 text-lg leading-relaxed ${isNature ? 'text-amber-700/80 dark:text-amber-300/70' : 'text-foreground/70'}`} 
                   dangerouslySetInnerHTML={{ __html: courseDescription }} />
            </motion.div>

            {/* Lessons List - ✅ إضافة زرار المشاهدة هنا */}
            <motion.div className="mt-10">
              <h2 className={`text-2xl font-bold mb-6 ${isNature ? 'text-amber-800 dark:text-amber-100' : ''}`}>
                {lang === "ar" ? "محتويات الكورس" : "Course Content"}
                <span className="text-sm text-foreground/50 ml-2">({lessons.length} {lang === "ar" ? "دروس" : "lessons"})</span>
              </h2>
              <div className="space-y-3">
                {lessons.map((lesson: any, index: number) => {
                  const isPurchased = hasPurchasedFullCourse || lesson.attended;
                  const isFree = parseFloat(lesson.price) === 0;
                  
                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      index={index}
                      lang={lang}
                      
                      isPurchased={isPurchased}
                      isFree={isFree}
                      hasPurchasedFullCourse={hasPurchasedFullCourse}
                      isAuthenticated={!!Cookies.get('student_token')}
                      onBuy={() => handleBuyLesson(lesson.id, parseFloat(lesson.price))}
                      onWatch={() => goToLessonPage(lesson.id)}  
                      isBuying={buyingLessonId === lesson.id}
                      isSelected={selectedLesson?.id === lesson.id}
                      isNature={isNature}
                      isDark={isDark}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Purchase Card (يظهر فقط إذا لم يتم شراء الكورس) */}
          {!hasPurchasedFullCourse && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className={`sticky top-28 rounded-3xl p-6 shadow-card border ${cardBg} ${cardBorder}`}>
                <div className="mb-6">
                  {hasDiscount ? (
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`text-3xl font-black ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-gradient'}`}>
                        {finalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-foreground/60 line-through">{originalPrice.toFixed(2)}</span>
                      <span className="text-xs text-red-500">-{discountPercent}%</span>
                    </div>
                  ) : (
                    <span className={`text-3xl font-black ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-gradient'}`}>
                      {originalPrice.toFixed(2)}
                    </span>
                  )}
                  <p className="text-xs text-foreground/50 mt-1">
                    {lang === "ar" ? "دفعة واحدة - وصول مدى الحياة" : "One-time payment - lifetime access"}
                  </p>
                </div>

                <div className="space-y-3 text-sm border-t pt-4" style={{ borderColor: isNature ? (isDark ? '#854d0e' : '#fde68a') : 'var(--border)' }}>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">{lang === "ar" ? "المرحلة" : "Stage"}</span>
                    <span className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-300' : ''}`}>
                      {pick(course?.stage?.name, course?.stage?.name_ar)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">{lang === "ar" ? "المادة" : "Subject"}</span>
                    <span className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-300' : ''}`}>
                      {pick(course?.subject?.name, course?.subject?.name_ar)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">{lang === "ar" ? "الترم" : "Semester"}</span>
                    <span className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-300' : ''}`}>
                      {pick(course?.semester?.name, course?.semester?.name_ar)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">{lang === "ar" ? "عدد الدروس" : "Lessons"}</span>
                    <span className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-300' : ''}`}>
                      {lessons.length}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyFullCourse}
                    disabled={buyingFullCourse}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white font-bold shadow-soft hover:shadow-glow transition-all disabled:opacity-50
                      ${isNature 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600' 
                        : 'gradient-primary'}`}
                  >
                    {buyingFullCourse ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                    {lang === "ar" ? "شراء الكورس كاملاً" : "Buy Full Course"}
                  </motion.button>
                  
                  {!Cookies.get('student_token') && (
                    <Link to={`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`} 
                      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition
                        ${isNature 
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300' 
                          : 'bg-secondary hover:bg-primary/10'}`}>
                      {lang === "ar" ? "لديك حساب؟ سجل دخول" : "Already have an account? Login"}
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          )}

          {/* Purchased Success Card */}
          {hasPurchasedFullCourse && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className={`sticky top-28 rounded-3xl p-6 border text-center
                ${isNature 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-green-500/10 border-green-500/30'}`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className={`w-16 h-16 mx-auto mb-3 ${isNature ? 'text-green-600' : 'text-green-500'}`} />
                </motion.div>
                <h3 className={`text-xl font-bold mb-2 ${isNature ? 'text-green-700 dark:text-green-400' : 'text-green-600 dark:text-green-400'}`}>
                  {lang === "ar" ? "تم شراء الكورس بنجاح" : "Course Purchased"}
                </h3>
                <p className="text-sm text-foreground/60">
                  {lang === "ar" 
                    ? "يمكنك الآن مشاهدة جميع الدروس والامتحانات"
                    : "You can now watch all lessons and exams"}
                </p>
              </div>
            </motion.aside>
          )}
        </div>
      </div>
      
      <style>{`
        .recording-detected { filter: blur(40px) !important; opacity: 0.2 !important; transition: all 0.3s ease; }
        video::-webkit-media-controls-download-button { display: none !important; }
        video::-webkit-media-controls-enclosure { overflow: hidden; }
        video::-webkit-media-controls-panel { width: calc(100% + 30px); }
      `}</style>
    </motion.section>
  );
};

// 🟢 Lesson Card Component (مع زرار المشاهدة)
const LessonCard = ({ lesson, index, lang, isPurchased, isFree, hasPurchasedFullCourse, isAuthenticated, onBuy, onWatch, isBuying, isSelected, isNature, isDark }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lessonTitle = lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title;
  const lessonDesc = lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description;
  
  const cardBg = isNature 
    ? (isDark ? 'bg-amber-900/20' : 'bg-white') 
    : 'bg-card';
  const borderColor = isNature 
    ? (isDark ? 'border-amber-800' : 'border-amber-200') 
    : 'border-border';
  const hoverBg = isNature 
    ? (isDark ? 'hover:bg-amber-800/30' : 'hover:bg-amber-50') 
    : 'hover:bg-primary/5';
  const numberBg = isNature 
    ? 'from-amber-500 to-orange-600' 
    : 'gradient-primary';
  const titleColor = isNature 
    ? (isDark ? 'text-amber-200' : 'text-amber-800') 
    : '';
  const selectedBorder = isNature ? 'border-amber-500 ring-2 ring-amber-500' : 'border-primary ring-2 ring-primary';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-2xl overflow-hidden transition-all ${cardBg} ${borderColor} ${isSelected ? selectedBorder : ''}`}
    >
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${hoverBg}`} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-10 h-10 rounded-xl ${numberBg} grid place-items-center text-white font-bold text-sm`}>
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${titleColor}`}>{lessonTitle}</h3>
            <div className="flex items-center gap-3 text-xs text-foreground/50 mt-1">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(lesson.lession_date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.lession_time}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* سعر الدرس */}
          {!isFree && !isPurchased && (
            <span className={`text-lg font-bold ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
              {parseFloat(lesson.price).toFixed(2)} EGP
            </span>
          )}
          
          {/* ✅ زرار المشاهدة - الأهم */}
          {isPurchased && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onWatch(); }} 
              className={`px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2
                ${isNature 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600' 
                  : 'gradient-primary'}`}
            >
              <Eye className="w-4 h-4" />
              {lang === "ar" ? "مشاهدة" : "Watch"}
            </motion.button>
          )}
          
          {/* زرار الشراء (إذا لم يكن مشترى) */}
          {!isFree && !isPurchased && isAuthenticated && !hasPurchasedFullCourse && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onBuy(); }} 
              disabled={isBuying} 
              className={`px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50
                ${isNature ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}
            >
              {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            </motion.button>
          )}
          
          {/* الدرس مقفل (غير مسجل دخول) */}
          {!isAuthenticated && !hasPurchasedFullCourse && (
            <div className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-foreground/40 text-sm font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3" /> {lang === "ar" ? "مقفل" : "Locked"}
            </div>
          )}
          
          {/* السهم للتوسيع */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4 pt-0"
          >
            <div className={`pt-3 border-t ${isNature ? 'border-amber-200 dark:border-amber-800' : 'border-border'}`}>
              {lessonDesc && (
                <p className={`text-sm mb-3 ${isNature ? 'text-amber-700/70 dark:text-amber-300/70' : 'text-foreground/60'}`}>
                  {lessonDesc}
                </p>
              )}
              {lesson.must_pass_to_unlock && !isPurchased && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <Lock className="w-4 h-4" /> 
                  {lang === "ar" ? "يجب اجتياز الامتحان السابق" : "Must pass previous exam"}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Skeleton Component
const CourseDetailSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <section className={`pt-36 md:pt-40 pb-24 ${isNature ? 'bg-cream' : 'bg-background'}`}>
      <div className="container-tight">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className={`aspect-video rounded-3xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <div className="mt-8 space-y-4">
              <div className={`h-8 rounded-lg w-3/4 animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-4 rounded-lg w-full animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`h-4 rounded-lg w-2/3 animate-pulse ${isNature ? 'bg-amber-50' : 'bg-gray-200 dark:bg-gray-700'}`} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className={`h-96 rounded-3xl animate-pulse ${isNature ? 'bg-amber-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
          </div>
        </div>
      </div>
    </section>
  );
};

// إضافة AlertCircle للاستيراد
const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default CourseDetail;