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
  Loader2, Video, ExternalLink, EyeOff,
  XCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast  } from "@/hooks/use-toast";
import { preventVideoDownload, disablePictureInPicture } from "@/utils/protection";
import Cookies from "js-cookie";

const getYouTubeVideoId = (value: unknown) => {
  const raw = String(value || '').trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null;
    if (url.hostname.endsWith('youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      const match = url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/);
      return match?.[1] || null;
    }
  } catch {
    return null;
  }
  return null;
};

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
  const [hasPurchasedFullCourse, setHasPurchasedFullCourse] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoError(false);
  }, [selectedLesson?.id, selectedLesson?.content_link]);

  // التحقق من المصادقة وشراء الكورس
  useEffect(() => {
    const token = Cookies.get('student_token');
    console.log("🔐 CourseDetail - Token exists:", !!token);
    console.log("🔐 CourseDetail - isAuthenticated:", isAuthenticated);
    
    // Prefer the course-level purchase flag; keep lesson attendance as a legacy fallback.
    if (courseData?.data && !Array.isArray(courseData.data) && courseData.data.isPurchased === true) {
      setHasPurchasedFullCourse(true);
    } else if (courseData?.data?.details?.length > 0) {
      const anyLessonPurchased = courseData.data.details.some((lesson: any) => lesson.attended === true);
      setHasPurchasedFullCourse(anyLessonPurchased);
    }
  }, [isAuthenticated, student, courseData]);

  // Use the front-end course response as the source of truth, with teacher data as fallback.
  const contextCourse = teacher?.website?.courses?.find((c: any) => String(c.id) === courseId);
  const courseDetails = courseData?.data;
  const course = courseDetails
    ? {
        ...contextCourse,
        ...courseDetails,
        image: courseDetails.image || contextCourse?.image,
        imageUrl: courseDetails.imageUrl || contextCourse?.imageUrl,
      }
    : contextCourse;
  
  if (!course && !detailsLoading) {
    return <Navigate to={`/courses`} replace />;
  }

  const lessons = courseDetails?.details || [];
  const courseImage = course?.image?.fullUrl || course?.imageUrl || "/default-course.jpg";
  const courseTitle = pick(course?.title, course?.title_ar) || "Course";
  const courseDescription = pick(course?.description, course?.description_ar) || "";
  
  // حساب الخصم
  const originalPrice = Number(course?.original_price ?? course?.price) || 0;
  const discountPercent = Number(course?.offer_discount || course?.discount) || 0;
  const responsePrice = Number(course?.price);
  const finalPrice = Number.isFinite(responsePrice)
    ? responsePrice === originalPrice && discountPercent > 0
      ? originalPrice - (originalPrice * discountPercent / 100)
      : responsePrice
    : originalPrice;
  const hasDiscount = discountPercent > 0 || finalPrice < originalPrice;

  // شراء الكورس كاملاً
  const handleBuyFullCourse = async () => {
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
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
      if (error.message?.includes("authenticated") || error.response?.status === 401) {
        toast.error(lang === "ar" ? "انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مرة أخرى" : "Session expired, please login again");
        setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`), 2000);
      }
    } finally {
      setBuyingFullCourse(false);
    }
  };

  // شراء درس فردي
  const handleBuyLesson = async (lessonId: number, price: number) => {
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
      return;
    }
    
    setBuyingLessonId(lessonId);
    try {
      await buyLesson(lessonId, price);
      toast.success(lang === "ar" ? "تم شراء الدرس بنجاح!" : "Lesson purchased successfully!");
      setTimeout(() => refetchDetails(), 1000);
    } catch (error: any) {
      console.error("Purchase error:", error);
    } finally {
      setBuyingLessonId(null);
    }
  };

  // ✅ التوجيه لصفحة الدرس
  const goToLesson = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };

  if (detailsLoading) {
    return <CourseDetailSkeleton />;
  }

  return (
    <section className="pt-36 md:pt-40 pb-24">
      <div className="container-tight">
        {/* Back Link */}
        <Link
          to={`/courses`}
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
                <div className="relative aspect-video bg-black">
                  {(() => {
                    const videoId = getYouTubeVideoId(selectedLesson.content_link);
                    if (videoId) {
                      return (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1&enablejsapi=1`}
                          className="w-full h-full"
                          title={selectedLesson.title || 'Course video'}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onError={() => setVideoError(true)}
                        />
                      );
                    }
                    return (
                      <video
                        ref={videoRef}
                        src={selectedLesson.content_link}
                        className="w-full h-full object-contain"
                        controls
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture
                        playsInline
                        preload="metadata"
                        onError={() => setVideoError(true)}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    );
                  })()}
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 text-center text-white p-6">
                      <div>
                        <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                        <p className="font-semibold mb-3">{lang === 'ar' ? 'تعذر تحميل الفيديو' : 'The video could not be loaded'}</p>
                        <a href={selectedLesson.content_link} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-lg bg-primary text-white text-sm">
                          {lang === 'ar' ? 'فتح الفيديو' : 'Open video'}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black hidden items-center justify-center z-10 recording-overlay" style={{ display: 'none' }}>
                    <div className="text-center text-white p-8">
                      <EyeOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">{lang === "ar" ? "تم اكتشاف تسجيل شاشة" : "Screen Recording Detected"}</p>
                      <p className="text-sm opacity-75">{lang === "ar" ? "الرجاء إغلاق برنامج التسجيل" : "Please close the recording software"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center cursor-pointer"
                  onClick={() => lessons[0] && hasPurchasedFullCourse && goToLesson(lessons[0].id)}
                >
                  <div className="text-center">
                    <img
                      src={courseImage}
                      alt={courseTitle}
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="relative z-10 rounded-full bg-background/80 p-4">
                      <PlayCircle className="w-12 h-12 text-primary" />
                    </div>
                    <p className="relative z-10 mt-3 rounded-lg bg-background/80 px-3 py-2 text-foreground/80">
                      {hasPurchasedFullCourse 
                        ? (lang === "ar" ? "اختر درساً للمشاهدة" : "Select a lesson to watch")
                        : (lang === "ar" ? "اشتر الكورس لمشاهدة الدروس" : "Buy the course to watch lessons")}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Selected Lesson Info */}
            {selectedLesson && (
              <motion.div className="mt-6 p-5 bg-secondary/30 rounded-2xl">
                <h3 className="font-bold text-xl">
                  {lang === "ar" && selectedLesson.title_ar ? selectedLesson.title_ar : selectedLesson.title}
                </h3>
                <p className="text-foreground/60 mt-2">
                  {lang === "ar" && selectedLesson.description_ar ? selectedLesson.description_ar : selectedLesson.description}
                </p>
              </motion.div>
            )}

            {/* Course Info */}
            <motion.div className="mt-8">
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
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={courseImage}
                  alt={courseTitle}
                  className="w-full sm:w-48 h-36 object-cover rounded-2xl border border-border"
                />
                <div className="flex-1 min-w-0">
                  <h1 className="font-display font-black text-3xl md:text-5xl tracking-tight">{courseTitle}</h1>
                  {courseDescription && (
                    <div className="mt-4 text-lg text-foreground/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: courseDescription }} />
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-semibold">
                      {finalPrice.toFixed(2)} EGP
                    </span>
                    {hasDiscount && (
                      <span className="text-foreground/50 line-through">{originalPrice.toFixed(2)} EGP</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-500 font-semibold">
                        {lang === "ar" ? `خصم ${discountPercent}%` : `${discountPercent}% off`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                {[
                  [lang === "ar" ? "المرحلة" : "Stage", pick(course?.stage?.name, course?.stage?.name_ar)],
                  [lang === "ar" ? "المادة" : "Subject", pick(course?.subject?.name, course?.subject?.name_ar)],
                  [lang === "ar" ? "الترم" : "Semester", pick(course?.semester?.name, course?.semester?.name_ar)],
                  [lang === "ar" ? "عدد الدروس" : "Lessons", String(lessons.length)],
                  ...(course?.start_date ? [[lang === "ar" ? "تاريخ البداية" : "Starts", new Date(course.start_date).toLocaleDateString()]] : []),
                  ...(course?.end_date ? [[lang === "ar" ? "تاريخ النهاية" : "Ends", new Date(course.end_date).toLocaleDateString()]] : []),
                  ...(course?.count_student ? [[lang === "ar" ? "عدد الطلاب" : "Students", Number(course.count_student).toLocaleString()]] : []),
                  ...(Number(course?.star) > 0 ? [[lang === "ar" ? "التقييم" : "Rating", String(course.star)]] : []),
                ].filter(([, value]) => value).map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-secondary/40 border border-border p-3">
                    <p className="text-xs text-foreground/50">{label}</p>
                    <p className="font-semibold mt-1">{value}</p>
                  </div>
                ))}
              </div>

              {course?.offer_discount && Number(course.offer_discount) > 0 && (course.offer_start_date || course.offer_end_date) && (
                <p className="mt-3 text-sm text-foreground/60">
                  {lang === "ar" ? "فترة العرض: " : "Offer period: "}
                  {course.offer_start_date ? new Date(course.offer_start_date).toLocaleDateString() : ""}
                  {course.offer_start_date && course.offer_end_date ? " - " : ""}
                  {course.offer_end_date ? new Date(course.offer_end_date).toLocaleDateString() : ""}
                </p>
              )}
            </motion.div>

            {/* Lessons List */}
            <motion.div className="mt-10">
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
                    hasPurchasedFullCourse={hasPurchasedFullCourse}
                    onBuy={() => handleBuyLesson(lesson.id, parseFloat(lesson.price))}
                    onWatch={() => goToLesson(lesson.id)}
                    isBuying={buyingLessonId === lesson.id}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Purchase Card (يظهر فقط إذا لم يتم شراء الكورس) */}
          {!hasPurchasedFullCourse && (
            <motion.aside className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-3xl p-6 shadow-card border border-border">
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
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleBuyFullCourse}
                    disabled={buyingFullCourse}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-primary text-white font-bold shadow-soft hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {buyingFullCourse ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                    {lang === "ar" ? "شراء الكورس كاملاً" : "Buy Full Course"}
                  </button>
                  
                  {!Cookies.get('student_token') && (
                    <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-sm font-semibold hover:bg-primary/10 transition">
                      {lang === "ar" ? "لديك حساب؟ سجل دخول" : "Already have an account? Login"}
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          )}

          {/* ✅ إذا تم شراء الكورس، اعرض رسالة نجاح */}
          {hasPurchasedFullCourse && (
            <motion.aside className="lg:col-span-1">
              <div className="sticky top-28 bg-green-500/10 rounded-3xl p-6 border border-green-500/30 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {lang === "ar" ? "تم شراء الكورس بنجاح" : "Course Purchased"}
                </h3>
                <p className="text-sm text-foreground/60">
                  {lang === "ar" 
                    ? "يمكنك الآن مشاهدة جميع الدروس والامتحانات"
                    : "You can now watch all lessons and exams"}
                </p>
                <Link to={`/dashboard`} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold">
                  {lang === "ar" ? "الذهاب للوحة التحكم" : "Go to Dashboard"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
    </section>
  );
};

// 🟢 Updated Lesson Card Component
const LessonCard = ({ lesson, index, lang, slug, isAuthenticated, hasPurchasedFullCourse, onBuy, onWatch, isBuying }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lessonTitle = lang === "ar"
    ? lesson.titles_ar?.[0] || lesson.title_ar || lesson.titles?.[0] || lesson.title
    : lesson.titles?.[0] || lesson.title || lesson.titles_ar?.[0] || lesson.title_ar;
  const lessonDesc = lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description;
  const isFree = Number(lesson.price) === 0;
  const isPurchased = hasPurchasedFullCourse || lesson.attended;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
    >
      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center text-white font-bold">{index + 1}</div>
          <div className="flex-1">
            <h3 className="font-semibold">{lessonTitle}</h3>
            <div className="flex items-center gap-3 text-xs text-foreground/50 mt-1">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(lesson.lession_date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.lession_time}</span>
              <span>{lang === "ar" ? "سعر الدرس:" : "Lesson price:"} {Number(lesson.price).toFixed(2)} EGP</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isFree && !isPurchased && <span className="text-lg font-bold text-primary">{parseFloat(lesson.price).toFixed(2)} EGP</span>}
          
          {isPurchased && (
            <button onClick={(e) => { e.stopPropagation(); onWatch(); }} className="px-4 py-2 rounded-xl gradient-primary text-white text-sm font-semibold">
              <PlayCircle className="w-4 h-4 inline mr-1" /> {lang === "ar" ? "مشاهدة" : "Watch"}
            </button>
          )}
          
          {!isFree && !isPurchased && isAuthenticated && !hasPurchasedFullCourse && (
            <button onClick={(e) => { e.stopPropagation(); onBuy(); }} disabled={isBuying} className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold disabled:opacity-50">
              {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          )}
          
          {!isAuthenticated && !hasPurchasedFullCourse && (
            <div className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-foreground/40 text-sm font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3" /> {lang === "ar" ? "مقفل" : "Locked"}
            </div>
          )}
          
          <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-3 border-t border-border mt-2">
          <div className="flex flex-col sm:flex-row gap-4">
            {(lesson.image?.fullUrl || lesson.imageUrl) && (
              <img
                src={lesson.image?.fullUrl || lesson.imageUrl}
                alt={lessonTitle || ""}
                className="w-full sm:w-40 h-28 object-cover rounded-xl"
                loading="lazy"
              />
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-foreground/50">{lang === "ar" ? "رقم الدرس" : "Lesson ID"}</p>
                <p className="font-semibold">{lesson.id}</p>
              </div>
              {lesson.createdAt && (
                <div>
                  <p className="text-xs text-foreground/50">{lang === "ar" ? "تاريخ الإضافة" : "Added on"}</p>
                  <p className="font-semibold">{lesson.createdAt}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-foreground/50">{lang === "ar" ? "السعر" : "Price"}</p>
                <p className="font-semibold">{Number(lesson.price).toFixed(2)} EGP</p>
              </div>
            </div>
          </div>
          {lessonDesc && <p className="text-sm text-foreground/60 mb-3">{lessonDesc}</p>}
          {lesson.must_pass_to_unlock && !isPurchased && (
            <div className="mt-3 flex items-center gap-2 text-amber-600 text-sm">
              <Lock className="w-4 h-4" /> {lang === "ar" ? "يجب اجتياز الامتحان السابق" : "Must pass previous exam"}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const CourseDetailSkeleton = () => (
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

export default CourseDetail;