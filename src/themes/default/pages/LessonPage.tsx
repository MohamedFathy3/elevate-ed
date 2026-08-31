/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { 
  useState, 
  useEffect, 
  useRef, 
  useMemo, 
  lazy, 
  Suspense, 
  memo, 
  useCallback 
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useLessonDetails } from "@/hooks/useLessonDetails";
import { useCurrentStudent } from "@/hooks/useStudent";
import { useAttendance } from "@/hooks/useAttendance";
import { useWatermark } from '@/hooks/useWatermark';
import { usePreventScreenshot } from '@/hooks/usePreventScreenshot';
import { useAdvancedProtection } from '@/hooks/useScreenRecorderProtection';
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, FileQuestion, Lock, Unlock, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { enableFullProtection } from "@/utils/protection";
import Cookies from "js-cookie";
import { useTeacher } from "@/context/TeacherContext";

// ✅ دالة مساعدة للـ Lazy Loading
const lazyLoad = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default?: T } | { [key: string]: T }>
) => {
  return lazy(() =>
    importFn().then((module) => {
      if (module.default) {
        return { default: module.default };
      }
      const namedExport = Object.values(module).find(
        (value) => typeof value === 'function' || typeof value === 'object'
      ) as T;
      return { default: namedExport };
    })
  );
};

// ✅ Lazy Loading
const VideoPlayer = lazyLoad(() => import("@/components/lesson/video/VideoPlayer"));
const LessonBreadcrumb = lazyLoad(() => import("@/components/lesson/LessonBreadcrumb"));
const LessonPartsList = lazyLoad(() => import("@/components/lesson/LessonSidebar/LessonPartsList"));
const LessonSkeleton = lazyLoad(() => import("@/components/lesson/LessonSkeleton"));
const LessonFiles = lazyLoad(() => import("@/components/lesson/LessonPage/components/LessonFiles"));
const ContactTeacherModal = lazyLoad(() => import("@/components/lesson/LessonPage/components/ContactTeacherModal"));
const ExamCard = lazyLoad(() => import("@/components/lesson/LessonPage/components/ExamCard"));
const AssignmentCard = lazyLoad(() => import("@/components/lesson/LessonPage/components/AssignmentCard"));

// ✅ Hooks
import { useLessonParts } from "@/hooks/useLessonParts";
import { useExamResults } from "@/hooks/useExamResults";
import { useAssignmentResults } from "@/hooks/useAssignmentResults";

// ✅ Skeleton ثابت - بدون animate-pulse لتقليل CLS
const LoadingSkeleton = memo(({ lang }: { lang: string }) => (
  <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-gray-950">
    <div className="container-tight max-w-7xl mx-auto px-4">
      {/* ✅ أبعاد ثابتة لمنع CLS */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-video"></div>
          <div className="mt-6 bg-gray-200 dark:bg-gray-700 rounded-2xl h-32"></div>
        </div>
        <div className="space-y-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64"></div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48"></div>
        </div>
      </div>
    </div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// ✅ المكون الرئيسي
const LessonPage = memo(() => {
  const { lang, dir } = useLang();
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  const { teacher } = useTeacher();
  
  const initialPartIndexRef = useRef<number | null>(null);
  const attendanceAttempted = useRef(false);
  const isMounted = useRef(true);
  
  // ✅ قراءة query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const partParam = params.get('part');
    if (partParam !== null) {
      const index = parseInt(partParam);
      if (!isNaN(index) && index >= 0) {
        initialPartIndexRef.current = index;
      }
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const lessonIdNum = parseInt(lessonId || '0');
  
  const { data: lessonData, isLoading, refetch: refetchLesson } = useLessonDetails(
    lessonIdNum,
    student?.id
  );
  const lesson = lessonData?.data;
  
  const memoizedLesson = useMemo(() => lesson, [lesson]);
  
  const { parts, currentPart, selectedPartIndex, selectPart, totalParts } = useLessonParts(memoizedLesson);
  
  // ✅ اختيار الجزء
  useEffect(() => {
    if (initialPartIndexRef.current !== null && parts.length > 0 && isMounted.current) {
      const partIndex = initialPartIndexRef.current;
      if (partIndex >= 0 && partIndex < parts.length) {
        selectPart(partIndex);
        toast.success(
          lang === "ar"
            ? `📺 تم فتح الجزء: ${parts[partIndex]?.title_ar || parts[partIndex]?.title}`
            : `📺 Opened part: ${parts[partIndex]?.title}`
        );
      }
    }
  }, [parts, selectPart, lang]);

  const { mutate: markAttendance, isPending: attendancePending, isSuccess: attendanceSuccess } = useAttendance();

  const [attended, setAttended] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactModalType, setContactModalType] = useState<'default' | 'exam_hidden' | 'need_support'>('default');

  const exams = memoizedLesson?.exams || [];
  const assignments = memoizedLesson?.assignments || [];
  
  const { examStatuses, loadingExams, setExamStatuses } = useExamResults(exams, student?.id || 0);
  const { assignmentStatuses, loadingAssignments } = useAssignmentResults(assignments, student?.id || 0);

  // ✅ تفعيل الحماية (مؤجل)
  const { BlueScreen } = useAdvancedProtection({
    enabled: false,
    sensitivity: 'medium',
    showBlueScreen: true,
    preventDevTools: true,
    preventExternalLinks: true,
    onDetect: useCallback(() => {
      console.warn('⚠️ تم اكتشاف محاولة تصوير!');
      toast.error(
        lang === "ar" 
          ? "⚠️ تم اكتشاف محاولة تصوير الشاشة! تم إيقاف الفيديو."
          : "⚠️ Screen recording detected! Video paused."
      );
    }, [lang])
  });

  // ✅ Watermark - مع تأخير لتقليل LCP و CLS
  const watermarkText = useMemo(() => {
    if (!student) return 'زائر | يرجى تسجيل الدخول';
    return `${student.name} | ID: ${student.id} | ${new Date().toLocaleDateString('ar-EG')}`;
  }, [student]);

  // ✅ تأخير تفعيل العلامة المائية
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  
  useEffect(() => {
    // ✅ تفعيل بعد تحميل الصفحة بالكامل
    const timer = setTimeout(() => {
      setWatermarkEnabled(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  usePreventScreenshot(true);
  
  // ✅ تفعيل العلامة المائية فقط بعد التأخير
  useWatermark(watermarkText, watermarkEnabled);

  // ✅ Attendance
  const getAttendanceCookieKey = useCallback(() => `attendance_${slug}_${lessonId}`, [slug, lessonId]);
  const hasAttendanceCookie = useCallback(() => Cookies.get(getAttendanceCookieKey()) === 'true', [getAttendanceCookieKey]);
  const setAttendanceCookie = useCallback(() => {
    Cookies.set(getAttendanceCookieKey(), 'true', { expires: 365, path: '/', sameSite: 'Lax' });
  }, [getAttendanceCookieKey]);

  useEffect(() => {
    if (memoizedLesson && isMounted.current) {
      const cookieAttended = hasAttendanceCookie();
      setAttended(cookieAttended || memoizedLesson.attended || false);
    }
  }, [memoizedLesson, hasAttendanceCookie]);

  useEffect(() => {
    if (!isMounted.current) return;
    
    const shouldRecordAttendance = 
      student?.id && 
      lessonIdNum && 
      memoizedLesson && 
      !attendanceAttempted.current &&
      !hasAttendanceCookie() &&
      !memoizedLesson.attended &&
      !!Cookies.get('student_token');

    if (shouldRecordAttendance) {
      attendanceAttempted.current = true;
      markAttendance({ lesson_id: lessonIdNum, student_id: student.id, slug: slug || '' });
    }
  }, [student?.id, lessonIdNum, memoizedLesson, markAttendance, slug, hasAttendanceCookie]);

  useEffect(() => {
    if (attendanceSuccess && isMounted.current) {
      setAttended(true);
      setAttendanceCookie();
      refetchLesson();
    }
  }, [attendanceSuccess, refetchLesson, setAttendanceCookie]);

  // ✅ منطق الامتحانات - محسن
  const { activeExamIndex } = useMemo(() => {
    if (exams.length === 0 || loadingExams) {
      return { activeExamIndex: -1 };
    }

    let firstFailedIndex = -1;
    for (let i = 0; i < exams.length; i++) {
      const exam = exams[i];
      const status = examStatuses[exam.id];
      if (status?.failed === true) {
        firstFailedIndex = i;
        break;
      }
    }

    let activeIdx = -1;
    if (firstFailedIndex !== -1) {
      activeIdx = firstFailedIndex;
    } else if (!examStatuses[exams[0]?.id]?.checked) {
      activeIdx = 0;
    } else {
      const allPassed = exams.every((exam: any) => {
        const status = examStatuses[exam.id];
        return status?.passed === true;
      });
      activeIdx = allPassed ? -2 : -1;
    }

    return { activeExamIndex: activeIdx };
  }, [exams, examStatuses, loadingExams]);

  // ✅ تحديث حالة القفل - محسن
  useEffect(() => {
    if (Object.keys(examStatuses).length === 0 || loadingExams || !isMounted.current) return;

    let hasChanges = false;
    const newStatuses = { ...examStatuses };
    
    exams.forEach((exam: any, index: number) => {
      if (index === 0) {
        if (newStatuses[exam.id]?.locked !== false || newStatuses[exam.id]?.hidden !== false) {
          newStatuses[exam.id] = {
            ...newStatuses[exam.id],
            locked: false,
            hidden: false,
            checked: newStatuses[exam.id]?.checked || false
          };
          hasChanges = true;
        }
        return;
      }

      const previousExam = exams[index - 1];
      const previousStatus = examStatuses[previousExam?.id];
      
      const shouldLock = previousStatus?.passed === true;
      const shouldHide = previousStatus?.passed === true;
      
      if (newStatuses[exam.id]?.locked !== shouldLock || newStatuses[exam.id]?.hidden !== shouldHide) {
        newStatuses[exam.id] = {
          ...newStatuses[exam.id],
          locked: shouldLock,
          hidden: shouldHide,
          checked: newStatuses[exam.id]?.checked || false
        };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setExamStatuses(newStatuses);
    }
  }, [exams, examStatuses, loadingExams, setExamStatuses]);

  const canWatch = useMemo(() => {
    if (!memoizedLesson?.must_pass_to_unlock) return true;
    if (exams.length === 0) return true;
    if (loadingExams) return false;
    
    return exams.every((exam: any) => {
      const status = examStatuses[exam.id];
      return status?.passed === true;
    });
  }, [memoizedLesson?.must_pass_to_unlock, exams, examStatuses, loadingExams]);

  // ✅ عرض المودال - محسن
  useEffect(() => {
    if (!isMounted.current) return;

    let timer: NodeJS.Timeout;

    const showModal = (type: 'default' | 'exam_hidden' | 'need_support') => {
      timer = setTimeout(() => {
        if (isMounted.current) {
          setContactModalType(type);
          setShowContactModal(true);
        }
      }, 500);
    };

    if (memoizedLesson?.need_support === true) {
      showModal('need_support');
      return () => clearTimeout(timer);
    }

    if (!memoizedLesson?.must_pass_to_unlock || loadingExams || exams.length === 0) return;
    
    const hiddenExams = exams.filter((exam: any) => {
      const status = examStatuses[exam.id];
      return status?.waitingResult === true;
    });
    
    if (hiddenExams.length > 0) {
      showModal('exam_hidden');
      return () => clearTimeout(timer);
    }
    
    const failedList = exams.filter((exam: any) => {
      const status = examStatuses[exam.id];
      return status?.passed === false && status?.checked === true;
    });
    
    if (failedList.length > 0) {
      const allExamsDone = exams.every((exam: any) => {
        const status = examStatuses[exam.id];
        return status?.passed === true || (status?.passed === false && status?.checked === true);
      });
      
      if (allExamsDone) {
        showModal('default');
        return () => clearTimeout(timer);
      }
    }

    return () => clearTimeout(timer);
  }, [memoizedLesson?.need_support, memoizedLesson?.must_pass_to_unlock, exams, examStatuses, loadingExams]);

  // ✅ Enable protection (مؤجل)
  useEffect(() => {
    const timer = setTimeout(() => {
      enableFullProtection();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Handlers - محسنة مع useCallback
  const handlePartChange = useCallback((index: number) => {
    selectPart(index);
    
    const newUrl = `/lesson/${lessonId}?part=${index}`;
    window.history.replaceState({}, '', newUrl);
    
    toast.success(
      lang === "ar"
        ? `تم التبديل إلى: ${parts[index]?.title_ar || parts[index]?.title}`
        : `Switched to: ${parts[index]?.title}`
    );
  }, [selectPart, lessonId, parts, lang]);

  const handleStartExam = useCallback((examId: number) => {
    const status = examStatuses[examId];
    
    if (status?.waitingResult) {
      setContactModalType('exam_hidden');
      setShowContactModal(true);
      return;
    }
    
    if (status?.locked) {
      toast.warning(
        lang === "ar" 
          ? "🔒 هذا الامتحان مقفول"
          : "🔒 This exam is locked"
      );
      return;
    }
    
    navigate(`/exam/${examId}?redirect=${encodeURIComponent(window.location.pathname)}`);
  }, [examStatuses, navigate, lang]);

  const handleStartAssignment = useCallback((assignmentId: number) => {
    const status = assignmentStatuses[assignmentId];
    
    if (status?.waitingResult) {
      setContactModalType('exam_hidden');
      setShowContactModal(true);
      return;
    }
    
    if (status?.locked) {
      toast.warning(
        lang === "ar" 
          ? "🔒 هذا الواجب مقفول"
          : "🔒 This assignment is locked"
      );
      return;
    }
    
    navigate(`/exam/${assignmentId}?redirect=${encodeURIComponent(window.location.pathname)}`);
  }, [assignmentStatuses, navigate, lang]);

  const getVideoUrlFromPart = useCallback((part: any) => {
    if (!part) return null;
    return part.videoUrl || part.video_url || part.link_video || part.content_link || null;
  }, []);

  const getVideoUrl = useCallback((url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
    }
    return url;
  }, []);

  const partVideoUrl = useMemo(() => getVideoUrlFromPart(currentPart), [currentPart, getVideoUrlFromPart]);
  const lessonVideoUrl = useMemo(() => memoizedLesson?.content_link || memoizedLesson?.video_url, [memoizedLesson]);
  const finalVideoUrl = useMemo(() => partVideoUrl || lessonVideoUrl, [partVideoUrl, lessonVideoUrl]);

  if (isLoading) {
    return (
      <Suspense fallback={<LoadingSkeleton lang={lang} />}>
        <LessonSkeleton lang={lang} />
      </Suspense>
    );
  }

  if (!memoizedLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 grid place-items-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {lang === "ar" ? "الدرس غير موجود" : "Lesson not found"}
          </h2>
          <Link to={`/dashboard`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {lang === "ar" ? "العودة للوحة التحكم" : "Back to Dashboard"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {BlueScreen}

      <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-gray-950" dir={dir}>
        <div className="container-tight max-w-7xl mx-auto px-4">
          <Suspense fallback={<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>}>
            <LessonBreadcrumb slug={slug || ''} title={memoizedLesson.title} />
          </Suspense>

          {/* تقدم الامتحانات */}
          {memoizedLesson?.must_pass_to_unlock && exams.length > 0 && (
            <div className="mb-6 p-4 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <FileQuestion className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {lang === "ar" ? "تقدم الامتحانات" : "Exam Progress"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {loadingExams 
                        ? (lang === "ar" ? "جاري التحميل..." : "Loading...")
                        : `${exams.filter((e: any) => examStatuses[e.id]?.passed).length} / ${exams.length} ${lang === "ar" ? "تم اجتيازها" : "passed"}`
                      }
                    </p>
                  </div>
                </div>
                {!loadingExams && (
                  <div className="flex items-center gap-2">
                    {exams.map((exam: any, idx: number) => {
                      const status = examStatuses[exam.id];
                      const isActive = idx === activeExamIndex;
                      const isPassed = status?.passed;
                      const isFailed = status?.failed;
                      const isHidden = status?.hidden;
                      const isWaitingResult = status?.waitingResult;
                      
                      if (isHidden) return null;
                      
                      return (
                        <div
                          key={exam.id}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPassed
                              ? 'bg-green-500 text-white'
                              : isFailed
                                ? 'bg-red-500 text-white'
                                : isWaitingResult
                                  ? 'bg-blue-500 text-white ring-4 ring-blue-500/30 animate-pulse'
                                  : isActive
                                    ? 'bg-amber-500 text-white ring-4 ring-amber-500/30 animate-pulse'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                          title={`${exam.title} - ${isPassed ? '✅ نجح' : isFailed ? '❌ فشل' : isWaitingResult ? '⏳ جاري انتظار النتيجة' : isActive ? '⏳ ينتظر' : '🔒 مقفول'}`}
                        >
                          {isPassed ? '✓' : isFailed ? '✗' : isWaitingResult ? '⏳' : idx + 1}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Video Player */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative bg-black rounded-2xl overflow-hidden shadow-card"
              >
                <Suspense fallback={
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-white" />
                  </div>
                }>
                  <VideoPlayer
                    key={selectedPartIndex}
                    videoUrl={finalVideoUrl ? getVideoUrl(finalVideoUrl) : null}
                    title={currentPart?.title || memoizedLesson.title}
                    poster={currentPart?.imageUrl || memoizedLesson.imageUrl}
                    isLocked={!canWatch}
                    requiredExam={activeExamIndex >= 0 ? exams[activeExamIndex] : null}
                    onStartExam={() => {
                      if (activeExamIndex >= 0 && activeExamIndex < exams.length) {
                        handleStartExam(exams[activeExamIndex].id);
                      }
                    }}
                    parts={parts}
                    onPartChange={handlePartChange}
                    selectedPartIndex={selectedPartIndex}
                  />
                </Suspense>
              </motion.div>

              {canWatch && currentPart && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">#{selectedPartIndex + 1}</span>
                    <span>{lang === "ar" ? "الجزء الحالي" : "Current part"}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {lang === "ar" ? currentPart.title_ar : currentPart.title}
                  </h3>
                </motion.div>
              )}

              {/* Lesson Info - مع أبعاد ثابتة لمنع CLS */}
              <div className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 min-h-[200px]">
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {lang === "ar" && memoizedLesson.title_ar ? memoizedLesson.title_ar : memoizedLesson.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {lang === "ar" && memoizedLesson.description_ar ? memoizedLesson.description_ar : memoizedLesson.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>{new Date(memoizedLesson.lession_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{memoizedLesson.lession_time}</span>
                  </div>
                  {totalParts > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs">
                      {totalParts} {lang === "ar" ? "أجزاء" : "parts"}
                    </div>
                  )}
                  
                  {memoizedLesson?.must_pass_to_unlock ? (
                    !canWatch && exams.length > 0 ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs">
                        <Lock className="w-3 h-3" />
                        {lang === "ar" ? "يتطلب اجتياز الامتحانات" : "Requires passing exams"}
                      </div>
                    ) : canWatch && exams.length > 0 ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs">
                        <Unlock className="w-3 h-3" />
                        {lang === "ar" ? "تم اجتياز جميع الامتحانات ✓" : "All exams passed ✓"}
                      </div>
                    ) : null
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs">
                      <Unlock className="w-3 h-3" />
                      {lang === "ar" ? "الدرس مفتوح" : "Lesson is open"}
                    </div>
                  )}
                  
                  {attended && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs">
                      ✅ {lang === "ar" ? "تم الحضور" : "Attended"}
                    </div>
                  )}
                  {attendancePending && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs">
                      ⏳ {lang === "ar" ? "جاري تسجيل الحضور..." : "Recording attendance..."}
                    </div>
                  )}
                </div>

                {/* ✅ Lesson Files */}
                <Suspense fallback={<div className="h-12 bg-gray-100 dark:bg-gray-800 rounded mt-4"></div>}>
                  <LessonFiles
                    driveLink={memoizedLesson?.link_drive}
                    pdfUrl={memoizedLesson?.pdfUrl}
                    lessonTitle={memoizedLesson?.title}
                    lang={lang}
                  />
                </Suspense>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {parts.length > 0 && (
                <Suspense fallback={<div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>}>
                  <LessonPartsList
                    parts={parts}
                    selectedIndex={selectedPartIndex}
                    onSelect={handlePartChange}
                    isLocked={!canWatch}
                  />
                </Suspense>
              )}

              {loadingExams ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  <span className="mr-2 text-sm text-gray-500">
                    {lang === "ar" ? "جاري تحميل الامتحانات..." : "Loading exams..."}
                  </span>
                </div>
              ) : (
                exams.map((exam: any, index: number) => {
                  const status = examStatuses[exam.id];
                  const isActive = index === activeExamIndex;
                  const isPassed = status?.passed || false;
                  const isLocked = status?.locked || false;
                  const isFailed = status?.failed || false;
                  const isHidden = status?.hidden || false;
                  const isWaitingResult = status?.waitingResult || false;
                  const isWaitingCorrection = status?.waitingCorrection || false;
                  const studentPassedMessage = status?.studentPassedMessage || null;
                  const showMessageOnly = status?.showMessageOnly || false;
                  const notSolved = status?.notSolved || false;

                  return (
                    <Suspense key={exam.id} fallback={<div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>}>
                      <ExamCard
                        exam={{
                          ...exam,
                          total: status?.total || 0,
                          total_must_pass_marks: status?.passMarks || exam.total_must_pass_marks || 0
                        }}
                        examIndex={index}
                        totalExams={exams.length}
                        isActive={isActive}
                        isPassed={isPassed}
                        isLocked={isLocked}
                        isFailed={isFailed}
                        isHidden={isHidden}
                        isWaitingResult={isWaitingResult}
                        isWaitingCorrection={isWaitingCorrection}
                        studentPassedMessage={studentPassedMessage}
                        showMessageOnly={showMessageOnly}
                        notSolved={notSolved}
                        onStart={() => handleStartExam(exam.id)}
                        lang={lang}
                      />
                    </Suspense>
                  );
                })
              )}

              {/* ✅ الواجبات */}
              {loadingAssignments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="mr-2 text-sm text-gray-500">
                    {lang === "ar" ? "جاري تحميل الواجبات..." : "Loading assignments..."}
                  </span>
                </div>
              ) : (
                assignments.map((assignment: any, index: number) => {
                  const status = assignmentStatuses[assignment.id];
                  const isPassed = status?.passed || false;
                  const isLocked = status?.locked || false;
                  const isFailed = status?.failed || false;
                  const isHidden = status?.hidden || false;
                  const isWaitingResult = status?.waitingResult || false;
                  const isWaitingCorrection = status?.waitingCorrection || false;
                  const studentPassedMessage = status?.studentPassedMessage || null;
                  const showMessageOnly = status?.showMessageOnly || false;
                  const notSolved = status?.notSolved || false;

                  return (
                    <Suspense key={assignment.id} fallback={<div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>}>
                      <AssignmentCard
                        assignment={{
                          ...assignment,
                          total: status?.total || 0,
                          total_must_pass_marks: status?.passMarks || assignment.total_must_pass_marks || 0
                        }}
                        assignmentIndex={index}
                        isPassed={isPassed}
                        isLocked={isLocked}
                        isFailed={isFailed}
                        isHidden={isHidden}
                        isWaitingResult={isWaitingResult}
                        isWaitingCorrection={isWaitingCorrection}
                        studentPassedMessage={studentPassedMessage}
                        showMessageOnly={showMessageOnly}
                        notSolved={notSolved}
                        onStart={() => handleStartAssignment(assignment.id)}
                        lang={lang}
                      />
                    </Suspense>
                  );
                })
              )}

              <div className="flex gap-3">
                <Link
                  to={`/courses/${memoizedLesson.course_id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-gray-700 dark:text-gray-300"
                >
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  {lang === "ar" ? "العودة للكورس" : "Back to Course"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Contact Teacher Modal */}
        <Suspense fallback={null}>
          <ContactTeacherModal
            isOpen={showContactModal}
            onClose={() => setShowContactModal(false)}
            lang={lang}
            teacherName={teacher?.name || memoizedLesson?.teacher_id?.name || 'المعلم'}
            phone={teacher?.phone || memoizedLesson?.teacher_id?.phone} 
            messageType={contactModalType}
          />
        </Suspense>

        <style>{`
          .shadow-card {
            box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.3);
          }
          /* ✅ منع CLS من العلامة المائية */
          #custom-watermark-center {
            opacity: 0 !important;
            transition: opacity 0.5s ease;
          }
          #custom-watermark-center.visible {
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </>
  );
});

LessonPage.displayName = 'LessonPage';

export default LessonPage;