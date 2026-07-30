/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useCourseDetails, useStudentCourses } from "@/hooks/useCourseDetails";
import { useBuyCourse } from "@/hooks/useEnroll";
import { useStudentAuth } from "@/context/StudentAuthContext";
import {
  Clock, Atom, ArrowLeft, ArrowRight, CheckCircle2,
  PlayCircle, ShoppingCart, Lock, Calendar,
  Loader2, Shield, Leaf, Sparkles, Users, Award, Star,
  Eye, Video, FileText, ExternalLink, Info, BookOpen,
  AlertTriangle, LogIn
} from "lucide-react";
import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { RedeemModal } from "@/components/RedeemModal";
import { Badge } from "@/components/ui/badge";

// ✅ Lazy Loading للمكونات الثقيلة
const VideoPlayer = lazy(() => 
  import("@/components/lesson/video/VideoPlayer").then(module => ({
    default: module.VideoPlayer || module.default || module
  }))
);

// ✅ Skeleton للتحميل
const VideoSkeleton = () => (
  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center animate-pulse">
    <div className="text-center">
      <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-30 text-gray-400" />
      <p className="text-gray-400">جاري تحميل الفيديو...</p>
    </div>
  </div>
);

// ✅ مكون LessonCard محسن مع Lazy Loading للصور
const LessonCard = ({ lesson, index, lang, isPurchased, isFree, hasPurchasedFullCourse, isAuthenticated, onBuy, onWatch, isBuying, isSelected, isNature, isDark, onSelectPart }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();

  const lessonTitle = lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title;
  const lessonDesc = lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description;

  const subParts = (lesson.titles || []).map((title: string, idx: number) => ({
    id: idx,
    title: title,
    title_ar: lesson.titles_ar?.[idx] || title,
    videoUrl: lesson.link_video?.[idx] || lesson.content_link,
    imageUrl: lesson.imageUrl,
  }));

  const hasSubParts = subParts.length > 0;
  const lessonImage = lesson.imageUrl;

  const goToLessonWithPart = (lessonId: number, partIndex: number) => {
    navigate(`/lesson/${lessonId}?part=${partIndex}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className={`
        border border-gray-200 dark:border-gray-700 
        rounded-2xl 
        bg-white
        overflow-hidden 
        transition-all duration-300
        ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg shadow-blue-500/20 dark:shadow-blue-400/20' : ''}
      `}
    >
      <div
        className={`
          p-3 sm:p-4 
          flex items-center justify-between 
          cursor-pointer 
          transition-colors duration-300
          hover:bg-blue-50 dark:hover:bg-blue-950/30
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* ✅ صورة مع Lazy Loading */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
            {!imageLoaded && <div className="w-full h-full animate-pulse bg-gray-300 dark:bg-gray-600" />}
            <img
              src={lessonImage || "/default-course.jpg"}
              alt={lessonTitle}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              width={48}
              height={48}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
              {lessonTitle}
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(lesson.lession_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <Clock className="w-3 h-3" />
                {lesson.lession_time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {!isFree && !isPurchased && (
            <span className="text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400">
              {parseFloat(lesson.price).toFixed(2)}
            </span>
          )}

          {isPurchased && (
            <Link
              to={`/lesson/${lesson.id}`}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{lang === "ar" ? "مشاهدة" : "Watch"}</span>
            </Link>
          )}

          {!isFree && !isPurchased && isAuthenticated && !hasPurchasedFullCourse && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onBuy(); }}
              disabled={isBuying}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white text-xs sm:text-sm font-semibold disabled:opacity-50 flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25"
            >
              {isBuying ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />}
            </motion.button>
          )}

          {!isAuthenticated && !hasPurchasedFullCourse && (
            <div className="px-2 py-1 sm:px-4 sm:py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs sm:text-sm font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3" />
            </div>
          )}

          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0"
          >
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              {lessonDesc && (
                <p className="text-sm mb-4 text-gray-500 dark:text-gray-400 line-clamp-3">
                  {lessonDesc}
                </p>
              )}

              {hasSubParts && isPurchased && (
                <div className="mt-2">
                  <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    {lang === "ar" ? "📚 أجزاء الدرس:" : "📚 Lesson parts:"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {subParts.slice(0, 6).map((part: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                        onClick={() => goToLessonWithPart(lesson.id, idx)}
                        className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg cursor-pointer bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500"
                      >
                        <div className="relative h-24 sm:h-32 overflow-hidden">
                          <img
                            src={lessonImage || "/default-course.jpg"}
                            alt={part.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            loading="lazy"
                            width={300}
                            height={168}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
                          </div>
                        </div>
                        <div className="p-2 sm:p-3">
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 grid place-items-center text-white font-bold text-[10px] sm:text-xs flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-xs sm:text-sm truncate text-gray-900 dark:text-white">
                                {lang === "ar" ? part.title_ar : part.title}
                              </h5>
                            </div>
                          </div>
                          <div className="mt-2 w-full py-1.5 sm:py-2 rounded-lg text-center text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25">
                            <Eye className="w-3 h-3" />
                            {lang === "ar" ? "مشاهدة" : "Watch"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {subParts.length > 6 && (
                      <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          +{subParts.length - 6} {lang === "ar" ? "أجزاء أخرى" : "more parts"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {hasSubParts && !isPurchased && (
                <div className="mt-2 p-6 sm:p-8 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center border border-gray-200 dark:border-gray-700">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {lang === "ar" ? "اشتر الدرس لمشاهدة الأجزاء" : "Buy the lesson to watch parts"}
                  </p>
                  <button
                    onClick={onBuy}
                    className="mt-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25"
                  >
                    {lang === "ar" ? "شراء الدرس" : "Buy Lesson"}
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

const CourseDetail = () => {
  const { lang, dir } = useLang();
  const { theme, colorMode } = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, student, isLoading: authLoading } = useStudentAuth();
  const { courseId } = useParams();
  const courseIdNum = parseInt(courseId || '0');

  const { data: studentCourses, isLoading: coursesLoading } = useStudentCourses();
  const { data: courseApiData, isLoading: detailsLoading, refetch: refetchDetails } = useCourseDetails(courseIdNum);
  const { buyCourse, buyLesson, isLoading: buying } = useBuyCourse();

  const videoPlayerRef = useRef<any>(null);
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
  const [redirectPath, setRedirectPath] = useState<string>("");

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemItemId, setRedeemItemId] = useState<number | null>(null);
  const [redeemItemType, setRedeemItemType] = useState<'lesson' | 'course'>('lesson');
  const [redeemPrice, setRedeemPrice] = useState<number>(0);

  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(-1);

  const courseFromApi = courseApiData?.data;
  const lessons = courseFromApi?.details || [];

  const courseTitle = lang === "ar" ? courseFromApi?.title_ar : courseFromApi?.title;
  const courseDescription = lang === "ar" ? courseFromApi?.description_ar : courseFromApi?.description;
  const courseAbout = lang === "ar" ? courseFromApi?.about_ar : courseFromApi?.about;
  const courseImage = courseFromApi?.image?.fullUrl || courseFromApi?.imageUrl || "/default-course.jpg";

  const courseIntroVideo = courseFromApi?.link_video;
  const hasCourseIntroVideo = !!courseIntroVideo;

  const originalPrice = parseFloat(courseFromApi?.price) || 0;
  const discountPercent = parseFloat(courseFromApi?.discount) || 0;
  const finalPrice = courseFromApi?.price_before_discount || originalPrice;
  const hasDiscount = discountPercent > 0;

  const primaryGradient = isNature
    ? "from-amber-500 to-orange-600"
    : "from-primary to-accent";
  const bgColor = isNature ? '' : '';
  const cardBg = isNature
    ? (isDark ? 'bg-amber-900/30' : 'bg-white')
    : (isDark ? 'bg-gray-800/50' : 'bg-card');
  const cardBorder = isNature
    ? (isDark ? 'border-amber-700/50' : 'border-amber-200')
    : (isDark ? 'border-gray-700' : 'border-border');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (studentCourses && studentCourses.length > 0 && courseIdNum) {
      const isEnrolled = studentCourses.some((course: any) => course.id === courseIdNum);
      setHasPurchasedFullCourse(isEnrolled);
    }

    if (!hasPurchasedFullCourse && lessons.length > 0) {
      const hasAttendedLesson = lessons.some((lesson: any) => lesson.attended === true);
      if (hasAttendedLesson) {
        setHasPurchasedFullCourse(true);
      }
    }
  }, [studentCourses, courseIdNum, lessons, hasPurchasedFullCourse]);

  const defaultContent = useMemo(() => {
    if (hasCourseIntroVideo) {
      return {
        type: 'intro',
        id: 'intro',
        title: lang === 'ar' ? 'فيديو تعريفي للكورس' : 'Course Intro Video',
        title_ar: 'فيديو تعريفي للكورس',
        content_link: courseIntroVideo,
        description: courseDescription,
        description_ar: courseDescription,
        isIntro: true,
        lession_date: courseFromApi?.createdAt || new Date().toISOString(),
        lession_time: '00:00:00',
      };
    }
    
    if (hasPurchasedFullCourse && lessons.length > 0) {
      return {
        type: 'lesson',
        ...lessons[0],
        isIntro: false
      };
    }
    
    return null;
  }, [hasCourseIntroVideo, courseIntroVideo, hasPurchasedFullCourse, lessons, lang, courseDescription, courseFromApi]);

  useEffect(() => {
    if (defaultContent && !selectedLesson) {
      setSelectedLesson(defaultContent);
    }
  }, [defaultContent, selectedLesson]);

  const isPlayingIntroVideo = selectedLesson?.isIntro === true;

  const goToLessonPage = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };

  const handleCoursePaymentSuccess = (data: any) => {
    console.log('✅ Course payment success:', data);
    toast.success(lang === "ar" ? "تم شراء الكورس بنجاح!" : "Course purchased successfully!");
    setHasPurchasedFullCourse(true);
    setTimeout(() => refetchDetails(), 1000);
  };

  const handleCoursePaymentError = (error: any) => {
    console.error('❌ Course payment error:', error);
    toast.error(error?.message || (lang === "ar" ? "فشل الدفع، حاول مرة أخرى" : "Payment failed, please try again"));
  };

  const handleLessonPaymentSuccess = (data: any) => {
    console.log('✅ Lesson payment success:', data);
    toast.success(lang === "ar" ? "تم شراء الدرس بنجاح!" : "Lesson purchased successfully!");
    setTimeout(() => refetchDetails(), 1000);
    if (selectedLesson) {
      const updatedLesson = { ...selectedLesson, attended: true };
      setSelectedLesson(updatedLesson);
    }
  };

  const handleLessonPaymentError = (error: any) => {
    console.error('❌ Lesson payment error:', error);
    toast.error(error?.message || (lang === "ar" ? "فشل الدفع، حاول مرة أخرى" : "Payment failed, please try again"));
  };

  const handleOpenBuyCourseModal = () => {
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
      return;
    }
    setRedeemItemId(courseIdNum);
    setRedeemItemType('course');
    setRedeemPrice(finalPrice);
    setShowRedeemModal(true);
  };

  const handleOpenBuyLessonModal = (lessonId: number, price: number) => {
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
      return;
    }
    setRedeemItemId(lessonId);
    setRedeemItemType('lesson');
    setRedeemPrice(price);
    setShowRedeemModal(true);
  };

  const handleBuyFullCourse = async () => {
    const token = Cookies.get('student_token');
    if (!token) {
      toast.error(lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`), 1500);
      return;
    }

    setBuyingFullCourse(true);
    try {
      const result = await buyCourse(courseIdNum, finalPrice);

      if (result?.message && (
        result.message.includes("رصيد المحفظة غير كاف") ||
        result.message.includes("insufficient balance") ||
        result.message.includes("تم إرسال طلب للمدرس")
      )) {
        setTimeout(() => refetchDetails(), 2000);
      } else if (result?.status === true) {
        toast.success(lang === "ar" ? "تم شراء الكورس بنجاح!" : "Course purchased successfully!");
        setHasPurchasedFullCourse(true);
        setTimeout(() => refetchDetails(), 1000);
      } else {
        toast.error(result?.message || (lang === "ar" ? "حدث خطأ أثناء الشراء" : "Purchase failed"));
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error(error?.message || (lang === "ar" ? "حدث خطأ أثناء الشراء" : "Purchase failed"));
    } finally {
      setBuyingFullCourse(false);
    }
  };

  const selectLesson = (lesson: any, partIndex?: number) => {
    setSelectedLesson(lesson);
    setVideoError(false);

    if (partIndex !== undefined && lesson.titles && lesson.titles[partIndex]) {
      const part = {
        title: lesson.titles[partIndex],
        title_ar: lesson.titles_ar?.[partIndex] || lesson.titles[partIndex],
        videoUrl: lesson.link_video?.[partIndex] || lesson.content_link,
        imageUrl: lesson.imageUrl,
      };
      setSelectedPart(part);
      setSelectedPartIndex(partIndex);
    } else {
      setSelectedPart(null);
      setSelectedPartIndex(-1);
    }
  };

  const getVideoUrlForPlayer = (content: any) => {
    if (!content) return null;
    
    if (selectedPart && selectedPart.videoUrl) {
      return selectedPart.videoUrl;
    }
    
    if (content.isIntro && content.content_link) {
      return content.content_link;
    }
    
    if (content.content_link) {
      return content.content_link;
    }
    
    return null;
  };

  const getVideoTitle = (content: any) => {
    if (!content) return '';
    
    if (selectedPart && selectedPart.title) {
      return lang === 'ar' ? selectedPart.title_ar || selectedPart.title : selectedPart.title;
    }
    
    if (content.isIntro) {
      return lang === 'ar' ? 'فيديو تعريفي للكورس' : 'Course Intro Video';
    }
    
    return lang === 'ar' ? content.title_ar || content.title : content.title;
  };

  const getVideoPoster = (content: any) => {
    if (!content) return undefined;
    
    if (selectedPart && selectedPart.imageUrl) {
      return selectedPart.imageUrl;
    }
    
    if (content.imageUrl) {
      return content.imageUrl;
    }
    
    return courseImage;
  };

  const handleSelectPart = (lessonId: number, partIndex: number, part: any) => {
    const lesson = lessons.find((l: any) => l.id === lessonId);
    if (lesson) {
      setSelectedLesson({
        ...lesson,
        currentPart: part,
        currentPartIndex: partIndex,
      });
      setSelectedPart(part);
      setSelectedPartIndex(partIndex);
      setVideoError(false);
    }
  };

  const isLoading = detailsLoading || coursesLoading || authLoading;

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <LogIn className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {lang === "ar" ? "تسجيل الدخول مطلوب" : "Login Required"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {lang === "ar"
              ? "يجب تسجيل الدخول أولاً لمشاهدة محتوى هذا الكورس"
              : "You must login first to view this course content"}
          </p>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath || window.location.pathname)}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            <LogIn className="w-5 h-5" />
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <CourseDetailSkeleton isNature={isNature} />;
  }

  if (!courseFromApi && !isLoading) {
    return <Navigate to={`/courses`} replace />;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`pt-28 md:pt-36 pb-20 min-h-screen ${bgColor}`}
    >
      <div className="container-tight">
        <AnimatePresence>
          {showProtectionWarning && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-lg"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              {lang === "ar" ? "🔒 هذه الصفحة محمية" : "🔒 This page is protected"}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to={`/courses`}
            className={`inline-flex items-center gap-2 text-sm ${isNature ? 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300' : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light'} mb-6 transition-colors`}
          >
            <Arrow className="w-4 h-4 rotate-180 rtl:rotate-0" />
            {lang === "ar" ? "كل الكورسات" : "All courses"}
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-10">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {selectedLesson ? (
                <Suspense fallback={<VideoSkeleton />}>
                  <VideoPlayer
                    ref={videoPlayerRef}
                    videoUrl={getVideoUrlForPlayer(selectedLesson) || undefined}
                    title={getVideoTitle(selectedLesson)}
                    poster={getVideoPoster(selectedLesson)}
                    isLocked={!hasPurchasedFullCourse && !selectedLesson.isIntro && !selectedLesson.attended}
                    requiredExam={selectedLesson?.must_pass_to_unlock}
                    onStartExam={() => {
                      toast.info(lang === "ar" ? "جاري التوجيه للامتحان..." : "Redirecting to exam...");
                    }}
                    parts={selectedLesson?.titles?.map((title: string, idx: number) => ({
                      title: title,
                      title_ar: selectedLesson.titles_ar?.[idx] || title,
                      videoUrl: selectedLesson.link_video?.[idx] || selectedLesson.content_link,
                    }))}
                    selectedPartIndex={selectedPartIndex}
                    onPartChange={(index: number) => {
                      if (selectedLesson && selectedLesson.titles && selectedLesson.titles[index]) {
                        const part = {
                          title: selectedLesson.titles[index],
                          title_ar: selectedLesson.titles_ar?.[index] || selectedLesson.titles[index],
                          videoUrl: selectedLesson.link_video?.[index] || selectedLesson.content_link,
                          imageUrl: selectedLesson.imageUrl,
                        };
                        setSelectedPart(part);
                        setSelectedPartIndex(index);
                      }
                    }}
                  />
                </Suspense>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
                  <div className="text-center p-4">
                    <PlayCircle className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-70 ${isNature ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'}`} />
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {hasPurchasedFullCourse
                        ? (lang === "ar" ? "اختر درساً للمشاهدة" : "Select a lesson to watch")
                        : (lang === "ar" ? "اشتر الكورس لمشاهدة الدروس" : "Buy the course to watch lessons")}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {selectedLesson && hasPurchasedFullCourse && !selectedLesson.isIntro && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-2xl ${isNature ? (isDark ? 'bg-amber-900/20' : 'bg-amber-50') : 'bg-gray-100 dark:bg-gray-800/50'}`}
              >
                <h3 className={`font-bold text-lg ${isNature ? 'text-amber-800 dark:text-amber-200' : 'text-gray-900 dark:text-white'}`}>
                  {getVideoTitle(selectedLesson)}
                </h3>
                <p className={`mt-1 text-sm ${isNature ? 'text-amber-700/70 dark:text-amber-300/70' : 'text-gray-700 dark:text-gray-300'}`}>
                  {lang === "ar" && selectedLesson.description_ar ? selectedLesson.description_ar : selectedLesson.description}
                </p>
              </motion.div>
            )}

            <motion.div className="mt-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                  ${isNature
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                  {courseFromApi?.type === "online" ? (lang === "ar" ? "أونلاين" : "Online") : (lang === "ar" ? "سنتر" : "Center")}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1
                  ${isNature
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'}`}>
                  {isNature ? <Leaf className="w-3 h-3" /> : <Atom className="w-3 h-3" />}
                  {lang === "ar" ? courseFromApi?.subject?.name_ar : courseFromApi?.subject?.name}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1
                  ${isNature
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                  <Clock className="w-3 h-3" />
                  {courseFromApi?.hour_time_course || (lang === "ar" ? "مرن" : "Flexible")}
                </span>
              </div>

              <h1 className={`font-display font-black text-2xl md:text-4xl tracking-tight ${isNature ? 'text-amber-800 dark:text-amber-100' : 'text-gray-900 dark:text-white'}`}>
                {courseTitle}
              </h1>

              <div className={`mt-3 text-base leading-relaxed ${isNature ? 'text-amber-700/80 dark:text-amber-300/70' : 'text-gray-700 dark:text-gray-300'}`}
                dangerouslySetInnerHTML={{ __html: courseDescription || '' }} />

              {courseAbout && (
                <div className={`mt-4 p-4 rounded-2xl ${isNature ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                  <h3 className={`font-bold text-base mb-1 flex items-center gap-2 ${isNature ? 'text-amber-800 dark:text-amber-200' : 'text-gray-900 dark:text-white'}`}>
                    <Info className="w-4 h-4" />
                    {lang === "ar" ? "نبذة عن الكورس" : "About this course"}
                  </h3>
                  <div className={`text-sm leading-relaxed ${isNature ? 'text-amber-700/70 dark:text-amber-300/70' : 'text-gray-700 dark:text-gray-300'}`}
                    dangerouslySetInnerHTML={{ __html: courseAbout }} />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className={`p-2 rounded-xl text-center ${isNature ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{lang === "ar" ? "المرحلة" : "Stage"}</p>
                  <p className={`font-semibold text-sm ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                    {lang === "ar" ? courseFromApi?.stage?.name_ar : courseFromApi?.stage?.name}
                  </p>
                </div>
                <div className={`p-2 rounded-xl text-center ${isNature ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{lang === "ar" ? "المادة" : "Subject"}</p>
                  <p className={`font-semibold text-sm ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                    {lang === "ar" ? courseFromApi?.subject?.name_ar : courseFromApi?.subject?.name}
                  </p>
                </div>
                <div className={`p-2 rounded-xl text-center ${isNature ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{lang === "ar" ? "الترم" : "Semester"}</p>
                  <p className={`font-semibold text-sm ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                    {lang === "ar" ? courseFromApi?.semester?.name_ar : courseFromApi?.semester?.name}
                  </p>
                </div>
                <div className={`p-2 rounded-xl text-center ${isNature ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{lang === "ar" ? "الدروس" : "Lessons"}</p>
                  <p className={`font-semibold text-sm ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                    {lessons.length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className="mt-8">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isNature ? 'text-amber-800 dark:text-amber-100' : 'text-gray-900 dark:text-white'}`}>
                <BookOpen className="w-5 h-5" />
                {lang === "ar" ? "محتويات الكورس" : "Course Content"}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({lessons.length} {lang === "ar" ? "دروس" : "lessons"})</span>
              </h2>
              <div className="space-y-2">
                {lessons.slice(0, 20).map((lesson: any, index: number) => {
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
                      onBuy={() => handleOpenBuyLessonModal(lesson.id, parseFloat(lesson.price))}
                      onWatch={() => {
                        setSelectedLesson(lesson);
                        setSelectedPart(null);
                        setSelectedPartIndex(-1);
                        setVideoError(false);
                      }}
                      onSelectPart={handleSelectPart}
                      isBuying={buyingLessonId === lesson.id}
                      isSelected={selectedLesson?.id === lesson.id}
                      isNature={isNature}
                      isDark={isDark}
                    />
                  );
                })}
                {lessons.length > 20 && (
                  <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                    +{lessons.length - 20} {lang === "ar" ? "درس إضافي" : "more lessons"}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {!hasPurchasedFullCourse && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className={`sticky top-24 rounded-3xl p-4 sm:p-6 shadow-card border ${cardBg} ${cardBorder}`}>
                <div className="mb-4">
                  {hasDiscount ? (
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`text-2xl sm:text-3xl font-black ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {finalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 line-through">{originalPrice.toFixed(2)}</span>
                      <span className="text-xs text-red-500">-{discountPercent}%</span>
                    </div>
                  ) : (
                    <span className={`text-2xl sm:text-3xl font-black ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {originalPrice.toFixed(2)}
                    </span>
                  )}
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {lang === "ar" ? "دفعة واحدة - وصول مدى الحياة" : "One-time payment - lifetime access"}
                  </p>
                </div>

                <div className="space-y-2 text-xs border-t pt-3" style={{ borderColor: isNature ? (isDark ? '#854d0e' : '#fde68a') : 'var(--border)' }}>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? "المرحلة" : "Stage"}</span>
                    <span className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                      {lang === "ar" ? courseFromApi?.stage?.name_ar : courseFromApi?.stage?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? "المادة" : "Subject"}</span>
                    <span className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                      {lang === "ar" ? courseFromApi?.subject?.name_ar : courseFromApi?.subject?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? "الترم" : "Semester"}</span>
                    <span className={`font-semibold ${isNature ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                      {lang === "ar" ? courseFromApi?.semester?.name_ar : courseFromApi?.semester?.name}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenBuyCourseModal}
                    disabled={buyingFullCourse}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-white font-bold shadow-soft hover:shadow-glow transition-all disabled:opacity-50 text-sm
                      ${isNature
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
                  >
                    {buyingFullCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                    {lang === "ar" ? "شراء الكورس" : "Buy Course"}
                  </motion.button>

                  {!Cookies.get('student_token') && (
                    <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition
                        ${isNature
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                      {lang === "ar" ? "لديك حساب؟ سجل دخول" : "Already have an account? Login"}
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          )}

          {hasPurchasedFullCourse && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className={`sticky top-24 rounded-3xl p-4 sm:p-6 border text-center
                ${isNature
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 ${isNature ? 'text-green-600 dark:text-green-400' : 'text-green-600 dark:text-green-400'}`} />
                </motion.div>
                <h3 className={`text-lg sm:text-xl font-bold mb-1 ${isNature ? 'text-green-700 dark:text-green-400' : 'text-green-700 dark:text-green-400'}`}>
                  {lang === "ar" ? "تم الشراء" : "Purchased"}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {lang === "ar"
                    ? "يمكنك مشاهدة جميع الدروس"
                    : "You can watch all lessons"}
                </p>
              </div>
            </motion.aside>
          )}
        </div>
      </div>

      <RedeemModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        itemId={redeemItemId || 0}
        itemType={redeemItemType}
        price={redeemPrice}
        onSuccess={redeemItemType === 'course' ? handleCoursePaymentSuccess : handleLessonPaymentSuccess}
        onError={redeemItemType === 'course' ? handleCoursePaymentError : handleLessonPaymentError}
      />

      <style>{`
        .recording-detected { filter: blur(40px) !important; opacity: 0.2 !important; transition: all 0.3s ease; }
        video::-webkit-media-controls-download-button { display: none !important; }
        video::-webkit-media-controls-enclosure { overflow: hidden; }
        video::-webkit-media-controls-panel { width: calc(100% + 30px); }
      `}</style>
    </motion.section>
  );
};

const CourseDetailSkeleton = ({ isNature }: { isNature: boolean }) => {
  return (
    <section className={`pt-28 md:pt-36 pb-20 ${isNature ? 'bg-amber-50 dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-950'}`}>
      <div className="container-tight">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-10">
          <div className="lg:col-span-2">
            <div className={`aspect-video rounded-3xl animate-pulse ${isNature ? 'bg-amber-200 dark:bg-amber-900/30' : 'bg-gray-200 dark:bg-gray-800'}`} />
            <div className="mt-6 space-y-3">
              <div className={`h-6 rounded-lg w-3/4 animate-pulse ${isNature ? 'bg-amber-200 dark:bg-amber-900/30' : 'bg-gray-200 dark:bg-gray-800'}`} />
              <div className={`h-4 rounded-lg w-full animate-pulse ${isNature ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-gray-200 dark:bg-gray-800'}`} />
              <div className={`h-4 rounded-lg w-2/3 animate-pulse ${isNature ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-gray-200 dark:bg-gray-800'}`} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className={`h-80 rounded-3xl animate-pulse ${isNature ? 'bg-amber-200 dark:bg-amber-900/30' : 'bg-gray-200 dark:bg-gray-800'}`} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetail; 