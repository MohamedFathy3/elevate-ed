/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTeacher } from "@/context/TeacherContext";
import { useCourseDetails } from "@/hooks/useCourseDetails";
import { useBuyCourse } from "@/hooks/useEnroll";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { 
  Clock, Atom, ArrowLeft, ArrowRight, CheckCircle2, 
  PlayCircle, ShoppingCart, Lock, Calendar, 
  Loader2, Video, ExternalLink, Shield, EyeOff
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { enableFullProtection, preventVideoDownload, disablePictureInPicture } from "@/utils/protection";
import Cookies from "js-cookie";

const CourseDetail = () => {
  const { lang, dir } = useLang();
  const { teacher, slug, pick } = useTeacher();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, student } = useStudentAuth();
  const { data: courseData, isLoading: detailsLoading, refetch: refetchDetails } = useCourseDetails(parseInt(courseId || '0'));
  const { buyCourse, buyLesson, isLoading: buying } = useBuyCourse();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [buyingLessonId, setBuyingLessonId] = useState<number | null>(null);
  const [buyingFullCourse, setBuyingFullCourse] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showProtectionWarning, setShowProtectionWarning] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // التحقق من المصادقة
  useEffect(() => {
    const token = Cookies.get('student_token');
    console.log("🔐 CourseDetail - Token exists:", !!token);
    console.log("🔐 CourseDetail - isAuthenticated:", isAuthenticated);
    console.log("🔐 CourseDetail - Student:", student);
    setIsAuthChecked(true);
  }, [isAuthenticated, student]);

  // تفعيل الحماية عند تحميل الصفحة
  useEffect(() => {
    enableFullProtection();
    setShowProtectionWarning(true);
    setTimeout(() => setShowProtectionWarning(false), 5000);
  }, []);

  // جلب بيانات الكورس الرئيسية من teacher context
  const course = teacher?.website?.courses?.find((c: any) => String(c.id) === courseId);
  
  if (!course && !detailsLoading) {
    return <Navigate to={`/${slug}/courses`} replace />;
  }

  const lessons = courseData?.data || [];
  const courseImage = course?.image?.fullUrl || course?.imageUrl || "/default-course.jpg";
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  
  // حساب الخصم
  const originalPrice = parseFloat(course?.price) || 0;
  const discountPercent = parseFloat(course?.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  const hasDiscount = discountPercent > 0;

  // شراء الكورس كاملاً
  const handleBuyFullCourse = async () => {
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        navigate(`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }, 1500);
      return;
    }
    
    setBuyingFullCourse(true);
    try {
      await buyCourse(parseInt(courseId || '0'), finalPrice);
      toast.success(lang === "ar" ? "تم شراء الكورس بنجاح!" : "Course purchased successfully!");
      // إعادة تحميل بيانات الدروس لتحديث حالة attendance
      setTimeout(() => {
        refetchDetails();
      }, 1000);
    } catch (error: any) {
      console.error("Purchase error:", error);
      if (error.message?.includes("authenticated") || error.response?.status === 401) {
        toast.error(lang === "ar" ? "انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مرة أخرى" : "Session expired, please login again");
        setTimeout(() => {
          navigate(`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        }, 2000);
      }
    } finally {
      setBuyingFullCourse(false);
    }
  };

  // شراء درس فردي
  const handleBuyLesson = async (lessonId: number, price: number) => {
    console.log("🛒 handleBuyLesson called - isAuthenticated:", isAuthenticated);
    
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        navigate(`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }, 1500);
      return;
    }
    
    setBuyingLessonId(lessonId);
    try {
      await buyLesson(lessonId, price);
      toast.success(lang === "ar" ? "تم شراء الدرس بنجاح!" : "Lesson purchased successfully!");
      setTimeout(() => {
        refetchDetails();
      }, 1000);
    } catch (error: any) {
      console.error("Purchase error:", error);
      if (error.message?.includes("authenticated") || error.response?.status === 401) {
        toast.error(lang === "ar" ? "انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مرة أخرى" : "Session expired, please login again");
        setTimeout(() => {
          navigate(`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        }, 2000);
      }
    } finally {
      setBuyingLessonId(null);
    }
  };

  // تشغيل الفيديو مع حماية
  const playLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setTimeout(() => {
      if (videoRef.current) {
        preventVideoDownload(videoRef.current);
        disablePictureInPicture(videoRef.current);
      }
    }, 100);
  };

  if (detailsLoading) {
    return <CourseDetailSkeleton />;
  }

  return (
    <section className="pt-36 md:pt-40 pb-24">
      <div className="container-tight">
        {/* تحذير الحماية */}
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

        {/* Back Link */}
        <Link
          to={`/${slug}/courses`}
          className="inline-flex items-center gap-2 text-sm text-foreground/65 hover:text-primary mb-8"
        >
          <Arrow className="w-4 h-4 rotate-180 rtl:rotate-0" />
          {lang === "ar" ? "كل الكورسات" : "All courses"}
        </Link>

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
              {selectedLesson ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={selectedLesson.content_link}
                    className="w-full aspect-video"
                    controls
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div 
                    className="absolute inset-0 bg-black hidden items-center justify-center z-10 recording-overlay"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center text-white p-8">
                      <EyeOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">{lang === "ar" ? "تم اكتشاف تسجيل شاشة" : "Screen Recording Detected"}</p>
                      <p className="text-sm opacity-75">{lang === "ar" ? "الرجاء إغلاق برنامج التسجيل" : "Please close the recording software"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center cursor-pointer"
                  onClick={() => lessons[0] && playLesson(lessons[0])}
                >
                  <div className="text-center">
                    <PlayCircle className="w-20 h-20 text-primary mx-auto mb-4 opacity-70" />
                    <p className="text-foreground/60">{lang === "ar" ? "اختر درساً للمشاهدة" : "Select a lesson to watch"}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Selected Lesson Info */}
            {selectedLesson && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 bg-secondary/30 rounded-2xl"
              >
                <h3 className="font-bold text-xl">
                  {lang === "ar" && selectedLesson.title_ar ? selectedLesson.title_ar : selectedLesson.title}
                </h3>
                <p className="text-foreground/60 mt-2">
                  {lang === "ar" && selectedLesson.description_ar ? selectedLesson.description_ar : selectedLesson.description}
                </p>
              </motion.div>
            )}

            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {course?.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center")}
                </span>
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold inline-flex items-center gap-1">
                  <Atom className="w-3 h-3" />
                  {pick(course?.subject?.name, course?.subject?.name_ar) || "Subject"}
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-bold inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course?.hour_time_course || (lang === "ar" ? "مرن" : "Flexible")}
                </span>
              </div>

              <h1 className="font-display font-black text-3xl md:text-5xl tracking-tight">
                {courseTitle}
              </h1>
              
              <div 
                className="mt-4 text-lg text-foreground/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: courseDescription }}
              />
            </motion.div>

            {/* Lessons List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10"
            >
              <h2 className="text-2xl font-bold mb-6">
                {lang === "ar" ? "محتويات الكورس" : "Course Content"}
                <span className="text-sm text-foreground/50 ml-2">({lessons.length} {lang === "ar" ? "دروس" : "lessons"})</span>
              </h2>
              
              <div className="space-y-3">
                {lessons.map((lesson: any, index: number) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    index={index}
                    lang={lang}
                    slug={slug!}
                    isAuthenticated={!!Cookies.get('student_token')}
                    onBuy={() => handleBuyLesson(lesson.id, parseFloat(lesson.price))}
                    onPlay={() => playLesson(lesson)}
                    isBuying={buyingLessonId === lesson.id}
                    isSelected={selectedLesson?.id === lesson.id}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Purchase Card */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 bg-card rounded-3xl p-6 shadow-card border border-border">
              {/* Course Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-black text-gradient">{finalPrice.toFixed(2)}</span>
                      <span className="text-sm text-foreground/60 line-through">{originalPrice.toFixed(2)}</span>
                      <span className="text-xs text-red-500">-{discountPercent}%</span>
                    </>
                  ) : (
                    <span className="text-3xl font-black text-gradient">{originalPrice.toFixed(2)}</span>
                  )}
                  <span className="text-sm text-foreground/60 font-semibold">EGP</span>
                </div>
                <p className="text-xs text-foreground/50 mt-1">
                  {lang === "ar" ? "دفعة واحدة - وصول مدى الحياة" : "One-time payment - lifetime access"}
                </p>
              </div>

              {/* Info List */}
              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-foreground/60">{lang === "ar" ? "المرحلة" : "Stage"}</span>
                  <span className="font-semibold">{pick(course?.stage?.name, course?.stage?.name_ar)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">{lang === "ar" ? "المادة" : "Subject"}</span>
                  <span className="font-semibold">{pick(course?.subject?.name, course?.subject?.name_ar)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">{lang === "ar" ? "الترم" : "Semester"}</span>
                  <span className="font-semibold">{pick(course?.semester?.name, course?.semester?.name_ar)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">{lang === "ar" ? "عدد الدروس" : "Lessons"}</span>
                  <span className="font-semibold">{lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">{lang === "ar" ? "عدد الطلاب" : "Students"}</span>
                  <span className="font-semibold">{course?.count_student || 0}</span>
                </div>
              </div>

              {/* ✅ Purchase Buttons - Buy Full Course */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleBuyFullCourse}
                  disabled={buyingFullCourse}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-primary text-white font-bold shadow-soft hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buyingFullCourse ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {lang === "ar" ? "شراء الكورس كاملاً" : "Buy Full Course"}
                </button>
                
                {!Cookies.get('student_token') && (
                  <Link
                    to={`/${slug}/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-sm font-semibold hover:bg-primary/10 transition"
                  >
                    {lang === "ar" ? "لديك حساب؟ سجل دخول" : "Already have an account? Login"}
                  </Link>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
      
      <style>{`
        .recording-detected {
          filter: blur(40px) !important;
          opacity: 0.2 !important;
          transition: all 0.3s ease;
        }
        video::-webkit-media-controls-download-button {
          display: none !important;
        }
        video::-webkit-media-controls-enclosure {
          overflow: hidden;
        }
        video::-webkit-media-controls-panel {
          width: calc(100% + 30px);
        }
      `}</style>
    </section>
  );
};

// 🟢 Lesson Card Component
const LessonCard = ({ lesson, index, lang, slug, isAuthenticated, onBuy, onPlay, isBuying, isSelected }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const lessonTitle = lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title;
  const lessonDesc = lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description;
  const isFree = parseFloat(lesson.price) === 0;
  const isPurchased = lesson.attended;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-card border rounded-2xl overflow-hidden hover:border-primary/30 transition-all ${
        isSelected ? 'border-primary shadow-glow' : 'border-border'
      }`}
    >
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center text-white font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{lessonTitle}</h3>
            <div className="flex items-center gap-3 text-xs text-foreground/50 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(lesson.lession_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lesson.lession_time}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isFree && !isPurchased && (
            <span className="text-lg font-bold text-primary">{parseFloat(lesson.price).toFixed(2)} EGP</span>
          )}
          
          {isPurchased && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-semibold"
            >
              <PlayCircle className="w-4 h-4 inline mr-1" />
              {lang === "ar" ? "مشاهدة" : "Watch"}
            </button>
          )}
          
          {!isFree && !isPurchased && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuy();
              }}
              disabled={isBuying || !isAuthenticated}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold disabled:opacity-50"
            >
              {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          )}
          
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-border mt-2">
          {lessonDesc && (
            <p className="text-sm text-foreground/60 mb-3">{lessonDesc}</p>
          )}
          
          {lesson.must_pass_to_unlock && !isPurchased && (
            <div className="mt-3 flex items-center gap-2 text-amber-600 text-sm">
              <Lock className="w-4 h-4" />
              {lang === "ar" ? "يجب اجتياز الامتحان السابق" : "Must pass previous exam"}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// 🟢 Skeleton Component
const CourseDetailSkeleton = () => {
  return (
    <section className="pt-36 md:pt-40 pb-24">
      <div className="container-tight">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />
            <div className="mt-8 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetail;