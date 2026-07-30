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
  AlertTriangle, LogIn, GraduationCap, Trophy, Zap
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { RedeemModal } from "@/components/RedeemModal";
import { Badge } from "@/components/ui/badge";

// ✅ مكون LessonCard محسن مع ألوان جميلة
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

  // ✅ ألوان محسنة
  const getCardColors = () => {
    if (isSelected) {
      return isNature
        ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/30 dark:ring-amber-500/30 shadow-lg shadow-amber-500/20 dark:shadow-amber-400/20'
        : 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-400/30 dark:ring-blue-500/30 shadow-lg shadow-blue-500/20 dark:shadow-blue-400/20';
    }
    return isNature
      ? 'border-amber-200/50 dark:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-700'
      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700';
  };

  const getHoverBg = () => {
    if (isSelected) {
      return isNature
        ? 'bg-amber-50/80 dark:bg-amber-950/30'
        : 'bg-blue-50/80 dark:bg-blue-950/30';
    }
    return isNature
      ? 'hover:bg-amber-50/50 dark:hover:bg-amber-950/20'
      : 'hover:bg-blue-50/50 dark:hover:bg-blue-950/20';
  };

  const getButtonGradient = () => {
    if (isNature) {
      return 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25';
    }
    return 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25';
  };

  const getPriceColor = () => {
    return isNature ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400';
  };

  const goToLessonWithPart = (lessonId: number, partIndex: number) => {
    navigate(`/lesson/${lessonId}?part=${partIndex}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className={`
        border rounded-2xl 
        bg-white dark:bg-gray-900/50
        backdrop-blur-sm
        overflow-hidden 
        transition-all duration-300
        ${getCardColors()}
        ${getHoverBg()}
      `}
    >
      <div
        className={`
          p-3 sm:p-4 
          flex items-center justify-between 
          cursor-pointer 
          transition-colors duration-300
          ${isNature ? 'hover:bg-amber-50/30 dark:hover:bg-amber-950/20' : 'hover:bg-blue-50/30 dark:hover:bg-blue-950/20'}
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
            <h3 className={`font-semibold text-sm sm:text-base ${isNature ? 'text-amber-900 dark:text-amber-100' : 'text-gray-900 dark:text-white'} truncate`}>
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
            <span className={`text-sm sm:text-lg font-bold ${getPriceColor()}`}>
              {parseFloat(lesson.price).toFixed(2)}
            </span>
          )}

          {isPurchased && (
            <Link
              to={`/lesson/${lesson.id}`}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 bg-gradient-to-r ${getButtonGradient()} shadow-lg transition-all`}
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
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white text-xs sm:text-sm font-semibold disabled:opacity-50 flex items-center gap-1 sm:gap-2 bg-gradient-to-r ${getButtonGradient()} shadow-lg transition-all`}
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
            <div className={`pt-3 border-t ${isNature ? 'border-amber-200/50 dark:border-amber-800/30' : 'border-gray-200 dark:border-gray-700'}`}>
              {lessonDesc && (
                <p className={`text-sm mb-4 ${isNature ? 'text-amber-700/70 dark:text-amber-300/70' : 'text-gray-500 dark:text-gray-400'} line-clamp-3`}>
                  {lessonDesc}
                </p>
              )}

              {hasSubParts && isPurchased && (
                <div className="mt-2">
                  <h4 className={`text-sm font-semibold mb-3 ${isNature ? 'text-amber-800 dark:text-amber-200' : 'text-gray-700 dark:text-gray-300'}`}>
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
                        className={`rounded-xl overflow-hidden border transition-all hover:shadow-lg cursor-pointer 
                          ${isNature ? 'border-amber-200/50 dark:border-amber-800/30 hover:border-amber-400 dark:hover:border-amber-500' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'}
                          bg-white dark:bg-gray-900`}
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
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-r ${isNature ? 'from-amber-500 to-orange-500' : 'from-blue-600 to-indigo-600'} grid place-items-center text-white font-bold text-[10px] sm:text-xs flex-shrink-0`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className={`font-semibold text-xs sm:text-sm truncate ${isNature ? 'text-amber-900 dark:text-amber-100' : 'text-gray-900 dark:text-white'}`}>
                                {lang === "ar" ? part.title_ar : part.title}
                              </h5>
                            </div>
                          </div>
                          <div className={`mt-2 w-full py-1.5 sm:py-2 rounded-lg text-center text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r ${isNature ? 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} text-white shadow-lg ${isNature ? 'shadow-amber-500/25' : 'shadow-blue-500/25'}`}>
                            <Eye className="w-3 h-3" />
                            {lang === "ar" ? "مشاهدة" : "Watch"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {subParts.length > 6 && (
                      <div className={`flex items-center justify-center p-4 rounded-xl border ${isNature ? 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-800/30' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                        <span className={`text-sm ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          +{subParts.length - 6} {lang === "ar" ? "أجزاء أخرى" : "more parts"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {hasSubParts && !isPurchased && (
                <div className={`mt-2 p-6 sm:p-8 rounded-xl text-center border ${isNature ? 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-800/30' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                  <Lock className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${isNature ? 'text-amber-400 dark:text-amber-500' : 'text-gray-400 dark:text-gray-500'}`} />
                  <p className={`text-xs sm:text-sm ${isNature ? 'text-amber-700/70 dark:text-amber-300/70' : 'text-gray-500 dark:text-gray-400'}`}>
                    {lang === "ar" ? "اشتر الدرس لمشاهدة الأجزاء" : "Buy the lesson to watch parts"}
                  </p>
                  <button
                    onClick={onBuy}
                    className={`mt-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r ${getButtonGradient()} shadow-lg`}
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

  // ✅ ألوان محسنة للـ Theme
  const themeColors = {
    // Nature Theme
    nature: {
      primary: 'from-amber-500 to-orange-600',
      primaryHover: 'from-amber-600 to-orange-700',
      secondary: 'from-amber-400 to-yellow-500',
      bg: isDark ? 'bg-gray-950' : 'bg-gradient-to-b from-amber-50/30 to-white dark:from-gray-950 dark:to-gray-900',
      card: isDark ? 'bg-gray-900/80 border-amber-800/30' : 'bg-white/80 border-amber-200/50 backdrop-blur-sm',
      cardHover: isDark ? 'hover:bg-gray-800/80' : 'hover:bg-amber-50/80',
      text: {
        primary: isDark ? 'text-amber-100' : 'text-amber-900',
        secondary: isDark ? 'text-amber-300/80' : 'text-amber-700/80',
        muted: isDark ? 'text-amber-400/60' : 'text-amber-600/60',
      },
      border: isDark ? 'border-amber-800/30' : 'border-amber-200/50',
      badge: isDark ? 'bg-amber-900/40 text-amber-300 border-amber-800/50' : 'bg-amber-100 text-amber-700 border-amber-200',
      icon: isDark ? 'text-amber-400' : 'text-amber-600',
      shadow: 'shadow-amber-500/20 dark:shadow-amber-400/20',
      gradient: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
      button: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25',
    },
    // Default Theme
    default: {
      primary: 'from-blue-500 to-indigo-600',
      primaryHover: 'from-blue-600 to-indigo-700',
      secondary: 'from-blue-400 to-purple-500',
      bg: isDark ? 'bg-gray-950' : 'bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-950 dark:to-gray-900',
      card: isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50 backdrop-blur-sm',
      cardHover: isDark ? 'hover:bg-gray-800/80' : 'hover:bg-blue-50/80',
      text: {
        primary: isDark ? 'text-white' : 'text-gray-900',
        secondary: isDark ? 'text-gray-300/80' : 'text-gray-700/80',
        muted: isDark ? 'text-gray-400/60' : 'text-gray-500/60',
      },
      border: isDark ? 'border-gray-700/50' : 'border-gray-200/50',
      badge: isDark ? 'bg-gray-800/60 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-700 border-gray-200',
      icon: isDark ? 'text-blue-400' : 'text-blue-600',
      shadow: 'shadow-blue-500/20 dark:shadow-blue-400/20',
      gradient: 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20',
      button: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25',
    }
  };

  const colors = isNature ? themeColors.nature : themeColors.default;

  // ✅ دالة مساعدة للحصول على ألوان البادج
  const getBadgeColors = (type: string) => {
    const badges = {
      online: isNature 
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      center: isNature
        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      stage: isNature
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      subject: isNature
        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800'
        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      semester: isNature
        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    };
    return badges[type as keyof typeof badges] || badges.stage;
  };

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
      <div className={`min-h-screen flex items-center justify-center ${colors.bg}`}>
        <div className="text-center max-w-md p-8">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full ${isNature ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-red-100 dark:bg-red-900/20'} flex items-center justify-center`}>
            <LogIn className={`w-12 h-12 ${isNature ? 'text-amber-500' : 'text-red-500'}`} />
          </div>
          <h1 className={`text-2xl font-bold mb-3 ${colors.text.primary}`}>
            {lang === "ar" ? "تسجيل الدخول مطلوب" : "Login Required"}
          </h1>
          <p className={`${colors.text.secondary} mb-6`}>
            {lang === "ar"
              ? "يجب تسجيل الدخول أولاً لمشاهدة محتوى هذا الكورس"
              : "You must login first to view this course content"}
          </p>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath || window.location.pathname)}`}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-lg bg-gradient-to-r ${colors.button}`}
          >
            <LogIn className="w-5 h-5" />
            {lang === "ar" ? "تسجيل الدخول" : "Login"}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <CourseDetailSkeleton isNature={isNature} colors={colors} />;
  }

  if (!courseFromApi && !isLoading) {
    return <Navigate to={`/courses`} replace />;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`pt-28 md:pt-36 pb-20 min-h-screen ${colors.bg}`}
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
            className={`inline-flex items-center gap-2 text-sm ${isNature ? 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300' : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'} mb-6 transition-colors`}
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
                <div className="relative">
                  <div className={`aspect-video rounded-3xl overflow-hidden ${isNature ? 'shadow-amber-500/20' : 'shadow-blue-500/20'} shadow-lg`}>
                    <video
                      ref={videoRef}
                      src={getVideoUrlForPlayer(selectedLesson) || undefined}
                      poster={getVideoPoster(selectedLesson)}
                      controls
                      className="w-full h-full object-cover"
                      controlsList="nodownload"
                      onError={() => setVideoError(true)}
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isNature ? 'bg-amber-500/90 text-white' : 'bg-blue-500/90 text-white'} backdrop-blur-sm`}>
                      {selectedLesson.isIntro ? (lang === "ar" ? "🎬 تعريفي" : "🎬 Intro") : (lang === "ar" ? "📚 درس" : "📚 Lesson")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={`aspect-video rounded-3xl flex items-center justify-center ${isNature ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'}`}>
                  <div className="text-center p-4">
                    <PlayCircle className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-70 ${isNature ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'}`} />
                    <p className={`text-sm sm:text-base ${colors.text.secondary}`}>
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
                className={`mt-4 p-4 rounded-2xl ${isNature ? 'bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30' : 'bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30'}`}
              >
                <h3 className={`font-bold text-lg ${colors.text.primary}`}>
                  {getVideoTitle(selectedLesson)}
                </h3>
                <p className={`mt-1 text-sm ${colors.text.secondary}`}>
                  {lang === "ar" && selectedLesson.description_ar ? selectedLesson.description_ar : selectedLesson.description}
                </p>
              </motion.div>
            )}

            <motion.div className="mt-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColors(courseFromApi?.type === "online" ? 'online' : 'center')}`}>
                  {courseFromApi?.type === "online" ? (lang === "ar" ? "🖥️ أونلاين" : "💻 Online") : (lang === "ar" ? "🏛️ سنتر" : "🏛️ Center")}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${getBadgeColors('subject')}`}>
                  {isNature ? <Leaf className="w-3 h-3" /> : <Atom className="w-3 h-3" />}
                  {lang === "ar" ? courseFromApi?.subject?.name_ar : courseFromApi?.subject?.name}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${getBadgeColors('semester')}`}>
                  <GraduationCap className="w-3 h-3" />
                  {lang === "ar" ? courseFromApi?.semester?.name_ar : courseFromApi?.semester?.name}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${getBadgeColors('stage')}`}>
                  <Trophy className="w-3 h-3" />
                  {lang === "ar" ? courseFromApi?.stage?.name_ar : courseFromApi?.stage?.name}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${isNature ? 'bg-amber-50/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
                  <Clock className="w-3 h-3" />
                  {courseFromApi?.hour_time_course || (lang === "ar" ? "مرن" : "Flexible")}
                </span>
              </div>

              <h1 className={`font-display font-black text-2xl md:text-4xl tracking-tight ${colors.text.primary}`}>
                {courseTitle}
              </h1>

              <div className={`mt-3 text-base leading-relaxed ${colors.text.secondary}`}
                dangerouslySetInnerHTML={{ __html: courseDescription || '' }} />

              {courseAbout && (
                <div className={`mt-4 p-4 rounded-2xl ${isNature ? 'bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30' : 'bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30'}`}>
                  <h3 className={`font-bold text-base mb-1 flex items-center gap-2 ${colors.text.primary}`}>
                    <Info className={`w-4 h-4 ${colors.icon}`} />
                    {lang === "ar" ? "✨ نبذة عن الكورس" : "✨ About this course"}
                  </h3>
                  <div className={`text-sm leading-relaxed ${colors.text.secondary}`}
                    dangerouslySetInnerHTML={{ __html: courseAbout }} />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className={`p-3 rounded-xl text-center ${isNature ? 'bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30' : 'bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30'}`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{lang === "ar" ? "📚 المرحلة" : "📚 Stage"}</p>
                  <p className={`font-semibold text-sm ${colors.text.primary}`}>
                    {lang === "ar" ? courseFromApi?.stage?.name_ar : courseFromApi?.stage?.name}
                  </p>
                </div>
                <div className={`p-3 rounded-xl text-center ${isNature ? 'bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30' : 'bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30'}`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{lang === "ar" ? "📖 المادة" : "📖 Subject"}</p>
                  <p className={`font-semibold text-sm ${colors.text.primary}`}>
                    {lang === "ar" ? courseFromApi?.subject?.name_ar : courseFromApi?.subject?.name}
                  </p>
                </div>
                <div className={`p-3 rounded-xl text-center ${isNature ? 'bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30' : 'bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30'}`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{lang === "ar" ? "🗓️ الترم" : "🗓️ Semester"}</p>
                  <p className={`font-semibold text-sm ${colors.text.primary}`}>
                    {lang === "ar" ? courseFromApi?.semester?.name_ar : courseFromApi?.semester?.name}
                  </p>
                </div>
                <div className={`p-3 rounded-xl text-center ${isNature ? 'bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30' : 'bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30'}`}>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{lang === "ar" ? "📌 الدروس" : "📌 Lessons"}</p>
                  <p className={`font-semibold text-sm ${colors.text.primary}`}>
                    {lessons.length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className="mt-8">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${colors.text.primary}`}>
                <BookOpen className={`w-5 h-5 ${colors.icon}`} />
                {lang === "ar" ? "📚 محتويات الكورس" : "📚 Course Content"}
                <span className={`text-xs ${colors.text.muted} ml-2`}>({lessons.length} {lang === "ar" ? "دروس" : "lessons"})</span>
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
                  <div className={`text-center py-4 text-sm ${colors.text.muted}`}>
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
              <div className={`sticky top-24 rounded-3xl p-4 sm:p-6 shadow-xl border ${colors.card} ${colors.border} backdrop-blur-sm`}>
                <div className="mb-4">
                  {hasDiscount ? (
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`text-2xl sm:text-3xl font-black ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {finalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 line-through">{originalPrice.toFixed(2)}</span>
                      <span className="text-xs text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">-{discountPercent}%</span>
                    </div>
                  ) : (
                    <span className={`text-2xl sm:text-3xl font-black ${isNature ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {originalPrice.toFixed(2)}
                    </span>
                  )}
                  <p className={`text-[10px] ${colors.text.muted} mt-1`}>
                    {lang === "ar" ? "دفعة واحدة - وصول مدى الحياة" : "One-time payment - lifetime access"}
                  </p>
                </div>

                <div className={`space-y-2 text-xs pt-3 border-t ${isNature ? 'border-amber-200/50 dark:border-amber-800/30' : 'border-gray-200 dark:border-gray-700'}`}>
                  <div className="flex justify-between">
                    <span className={colors.text.muted}>{lang === "ar" ? "المرحلة" : "Stage"}</span>
                    <span className={`font-semibold ${colors.text.primary}`}>
                      {lang === "ar" ? courseFromApi?.stage?.name_ar : courseFromApi?.stage?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={colors.text.muted}>{lang === "ar" ? "المادة" : "Subject"}</span>
                    <span className={`font-semibold ${colors.text.primary}`}>
                      {lang === "ar" ? courseFromApi?.subject?.name_ar : courseFromApi?.subject?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={colors.text.muted}>{lang === "ar" ? "الترم" : "Semester"}</span>
                    <span className={`font-semibold ${colors.text.primary}`}>
                      {lang === "ar" ? courseFromApi?.semester?.name_ar : courseFromApi?.semester?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={colors.text.muted}>{lang === "ar" ? "الدروس" : "Lessons"}</span>
                    <span className={`font-semibold ${colors.text.primary}`}>
                      {lessons.length}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenBuyCourseModal}
                    disabled={buyingFullCourse}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm bg-gradient-to-r ${colors.button}`}
                  >
                    {buyingFullCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                    {lang === "ar" ? "شراء الكورس" : "Buy Course"}
                  </motion.button>

                  <div className={`flex items-center gap-2 text-xs ${colors.text.muted} justify-center`}>
                    <Shield className="w-3 h-3" />
                    {lang === "ar" ? "دفع آمن 100%" : "100% Secure Payment"}
                  </div>

                  {!Cookies.get('student_token') && (
                    <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition border ${isNature ? 'border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <LogIn className="w-3 h-3" />
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
                  ? 'bg-emerald-50/80 border-emerald-200/70 dark:bg-emerald-900/20 dark:border-emerald-800/50'
                  : 'bg-green-50/80 border-green-200/70 dark:bg-green-900/20 dark:border-green-800/50'}`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 ${isNature ? 'text-emerald-600 dark:text-emerald-400' : 'text-green-600 dark:text-green-400'}`} />
                </motion.div>
                <h3 className={`text-lg sm:text-xl font-bold mb-1 ${isNature ? 'text-emerald-700 dark:text-emerald-400' : 'text-green-700 dark:text-green-400'}`}>
                  {lang === "ar" ? "✅ تم الشراء" : "✅ Purchased"}
                </h3>
                <p className={`text-xs ${isNature ? 'text-emerald-600/70 dark:text-emerald-400/70' : 'text-green-600/70 dark:text-green-400/70'}`}>
                  {lang === "ar"
                    ? "يمكنك مشاهدة جميع الدروس"
                    : "You can watch all lessons"}
                </p>
                <div className={`mt-3 pt-3 border-t ${isNature ? 'border-emerald-200/50 dark:border-emerald-800/30' : 'border-green-200/50 dark:border-green-800/30'}`}>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Zap className={`w-3 h-3 ${isNature ? 'text-amber-500' : 'text-blue-500'}`} />
                    <span className={colors.text.muted}>
                      {lang === "ar" ? "وصول مدى الحياة" : "Lifetime access"}
                    </span>
                  </div>
                </div>
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

const CourseDetailSkeleton = ({ isNature, colors }: { isNature: boolean; colors: any }) => {
  return (
    <section className={`pt-28 md:pt-36 pb-20 ${colors.bg}`}>
      <div className="container-tight">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-10">
          <div className="lg:col-span-2">
            <div className={`aspect-video rounded-3xl animate-pulse ${isNature ? 'bg-amber-200/50 dark:bg-amber-900/30' : 'bg-gray-200 dark:bg-gray-800'}`} />
            <div className="mt-6 space-y-3">
              <div className={`h-6 rounded-lg w-3/4 animate-pulse ${isNature ? 'bg-amber-200/50 dark:bg-amber-900/30' : 'bg-gray-200 dark:bg-gray-800'}`} />
              <div className={`h-4 rounded-lg w-full animate-pulse ${isNature ? 'bg-amber-100/50 dark:bg-amber-900/20' : 'bg-gray-200 dark:bg-gray-800'}`} />
              <div className={`h-4 rounded-lg w-2/3 animate-pulse ${isNature ? 'bg-amber-100/50 dark:bg-amber-900/20' : 'bg-gray-200 dark:bg-gray-800'}`} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className={`h-80 rounded-3xl animate-pulse ${isNature ? 'bg-amber-200/50 dark:bg-amber-900/30' : 'bg-gray-200 dark:bg-gray-800'}`} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetail;