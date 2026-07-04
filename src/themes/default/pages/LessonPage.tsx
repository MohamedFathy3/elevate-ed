/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/LessonPage.tsx

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useLessonDetails } from "@/hooks/useLessonDetails";
import { useCurrentStudent } from "@/hooks/useStudent";
import { useAttendance } from "@/hooks/useAttendance";
import { useWatermark } from '@/hooks/useWatermark';
import { usePreventScreenshot } from '@/hooks/usePreventScreenshot';
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, FileQuestion, Lock, Unlock, CheckCircle, Loader2, XCircle, Play, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { enableFullProtection } from "@/utils/protection";
import Cookies from "js-cookie";

import { VideoPlayer } from "@/components/lesson/video/VideoPlayer";
import { LessonBreadcrumb } from "@/components/lesson/LessonBreadcrumb";
import { LessonPartsList } from "@/components/lesson/LessonSidebar/LessonPartsList";
import { AssignmentsList } from "@/components/lesson/LessonSidebar/AssignmentsList";
import { LessonSkeleton } from "@/components/lesson/LessonSkeleton";
import { useLessonParts } from "@/hooks/useLessonParts";

// ✅ Modal للتواصل مع المعلم
const ContactTeacherModal = ({ isOpen, onClose, lang, teacherName, phone }: any) => {
  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  const [isHovered, setIsHovered] = useState(false);

  const message = `السلام عليكم، أحتاج إلى مساعدة بخصوص منصة الأستاذ ${teacherName || 'المعلم'}`;
  const cleanPhone = phone?.replace(/\s/g, "").replace(/[^0-9+]/g, "") || "201154853195";

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isRtl ? '💬 تحتاج مساعدة؟' : '💬 Need Help?'}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {isRtl 
              ? `لم تتمكن من اجتياز الامتحانات المطلوبة`
              : `You couldn't pass the required exams`}
          </p>
          
          <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl mb-6">
            {isRtl
              ? `📞 تواصل مع المعلم "${teacherName || 'المعلم'}" عبر واتساب للحصول على المساعدة`
              : `📞 Contact teacher "${teacherName || 'the teacher'}" via WhatsApp for assistance`}
          </p>

          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleWhatsApp}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6" />
            <span>{isRtl ? "📱 تواصل عبر واتساب" : "📱 Contact via WhatsApp"}</span>
          </motion.button>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            {isRtl ? 'حسناً، سأتواصل لاحقاً' : 'OK, I\'ll contact later'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ExamCard = ({ exam, examIndex, totalExams, isActive, isPassed, isFailed, isLocked, isHidden, onStart, lang }: any) => {
  const isRtl = lang === 'ar';
  
  if (isHidden) return null;
  
  let status = '';
  let bgColor = '';
  let icon = null;
  
  if (isPassed) {
    status = isRtl ? '✅ نجح' : '✅ Passed';
    bgColor = 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
    icon = <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
  } else if (isFailed) {
    status = isRtl ? '❌ فشل' : '❌ Failed';
    bgColor = 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
    icon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
  } else if (isActive) {
    status = isRtl ? '⏳ ينتظر' : '⏳ Pending';
    bgColor = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 ring-2 ring-amber-500/50';
    icon = <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />;
  } else {
    status = isRtl ? '⏳ ينتظر' : '⏳ Pending';
    bgColor = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 ring-2 ring-amber-500/50';
    icon = <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-2xl border p-5 transition-all ${bgColor}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPassed ? 'bg-green-500/20' : 
            isFailed ? 'bg-red-500/20' : 
            (isActive || !isLocked) ? 'bg-amber-500/20' : 
            'bg-gray-500/20'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {isRtl ? `الامتحان ${examIndex + 1}` : `Exam ${examIndex + 1}`}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {exam.title}
            </p>
          </div>
        </div>
        
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          isPassed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 
          isFailed ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 
          (isActive || !isLocked) ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 animate-pulse' : 
          'bg-gray-100 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400'
        }`}>
          {status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>📝 {exam.total_marks} درجة</span>
        <span>🎯 {exam.total_must_pass_marks} درجة للنجاح</span>
        <span>⏱️ {exam.duration_minutes} دقيقة</span>
        {isFailed && (
          <span className="text-red-600 dark:text-red-400 font-semibold">
            ❌ حصلت على {exam.total || 0} من {exam.total_must_pass_marks || 0}
          </span>
        )}
        {isPassed && (
          <span className="text-green-600 dark:text-green-400 font-semibold">
            ✅ حصلت على {exam.total || 0} من {exam.total_must_pass_marks || 0}
          </span>
        )}
      </div>

      {!isPassed && !isFailed && (isActive || !isLocked) && (
        <button
          onClick={onStart}
          className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transition-all"
        >
          <Play className="w-4 h-4" />
          {isRtl ? "ابدأ الامتحان" : "Start Exam"}
        </button>
      )}

      {isPassed && (
        <div className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          {isRtl ? "✅ تم الاجتياز" : "✅ Passed"}
        </div>
      )}

      {isFailed && (
        <div className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
          <XCircle className="w-4 h-4" />
          {isRtl ? "❌ لم تجتز" : "❌ Failed"}
        </div>
      )}

      {isLocked && !isActive && !isPassed && !isFailed && (
        <div className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <Lock className="w-4 h-4" />
          {isRtl ? "🔒 مقفول" : "🔒 Locked"}
        </div>
      )}
    </motion.div>
  );
};

const LessonPage = () => {
  const { lang, dir } = useLang();
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();

  const lessonIdNum = parseInt(lessonId || '0');
  const { data: lessonData, isLoading, refetch: refetchLesson } = useLessonDetails(
    lessonIdNum,
    student?.id
  );
  const lesson = lessonData?.data;

  const { parts, currentPart, selectedPartIndex, selectPart, totalParts } = useLessonParts(lesson);
  const { mutate: markAttendance, isPending: attendancePending, isSuccess: attendanceSuccess } = useAttendance();
  const attendanceAttempted = useRef(false);

  const [attended, setAttended] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [failedExams, setFailedExams] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<Record<number, any>>({});
  const [examStatuses, setExamStatuses] = useState<Record<number, { 
    passed: boolean; 
    checked: boolean; 
    locked: boolean;
    failed: boolean;
    hidden: boolean;
    total: number;
    passMarks: number;
  }>>({});
  const [loadingExams, setLoadingExams] = useState(true);

  // Watermark
  const watermarkText = student
    ? `${student.name} | ID: ${student.id} | ${new Date().toLocaleDateString('ar-EG')}`
    : 'زائر | يرجى تسجيل الدخول';

  usePreventScreenshot(true);
  useWatermark(watermarkText, true);

  // Attendance cookie functions
  const getAttendanceCookieKey = () => `attendance_${slug}_${lessonId}`;
  const hasAttendanceCookie = () => Cookies.get(getAttendanceCookieKey()) === 'true';
  const setAttendanceCookie = () => {
    Cookies.set(getAttendanceCookieKey(), 'true', { expires: 365, path: '/', sameSite: 'Lax' });
  };

  // Sync attendance
  useEffect(() => {
    if (lesson) {
      const cookieAttended = hasAttendanceCookie();
      setAttended(cookieAttended || lesson.attended || false);
    }
  }, [lesson]);

  // Record attendance
  useEffect(() => {
    const shouldRecordAttendance = 
      student?.id && 
      lessonIdNum && 
      lesson && 
      !attendanceAttempted.current &&
      !hasAttendanceCookie() &&
      !lesson.attended &&
      !!Cookies.get('student_token');

    if (shouldRecordAttendance) {
      attendanceAttempted.current = true;
      markAttendance({ lesson_id: lessonIdNum, student_id: student.id, slug });
    }
  }, [student?.id, lessonIdNum, lesson, markAttendance, slug]);

  useEffect(() => {
    if (attendanceSuccess) {
      setAttended(true);
      setAttendanceCookie();
      refetchLesson();
    }
  }, [attendanceSuccess, refetchLesson]);

  // جلب الامتحانات من الدرس
  const exams = lesson?.exams || [];

  // جلب نتيجة كل امتحان
  useEffect(() => {
    if (!exams.length || !student?.id) {
      setLoadingExams(false);
      return;
    }

    const fetchAllExamResults = async () => {
      setLoadingExams(true);
      const results: Record<number, any> = {};
      const statuses: Record<number, any> = {};

      for (const exam of exams) {
        try {
          const response = await fetch(`/api/exam/result/${exam.id}/${student.id}`);
          const data = await response.json();
          
          results[exam.id] = data;
          
          const total = data.total || 0;
          const passMarks = exam.total_must_pass_marks || 0;
          const passed = total >= passMarks;
          
          const hasData = data.data && data.data.length > 0;
          
          statuses[exam.id] = {
            passed: passed,
            failed: hasData && !passed,
            checked: hasData || false,
            locked: false,
            hidden: false,
            total: total,
            passMarks: passMarks
          };
          
        } catch (error) {
          statuses[exam.id] = {
            passed: false,
            failed: false,
            checked: false,
            locked: false,
            hidden: false,
            total: 0,
            passMarks: exam.total_must_pass_marks || 0
          };
        }
      }

      setExamResults(results);
      setExamStatuses(statuses);
      setLoadingExams(false);
    };

    fetchAllExamResults();
  }, [exams, student?.id]);

  // ✅ المنطق: تحديد الامتحان النشط
  const { activeExamIndex, examVisibility } = useMemo(() => {
    if (exams.length === 0 || loadingExams) {
      return { activeExamIndex: -1, examVisibility: {} };
    }

    const visibility: Record<number, boolean> = {};
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

    visibility[exams[0]?.id] = true;

    for (let i = 1; i < exams.length; i++) {
      const currentExam = exams[i];
      const prevExam = exams[i - 1];
      const prevStatus = examStatuses[prevExam?.id];
      
      const shouldShow = prevStatus?.failed === true;
      
      visibility[currentExam.id] = shouldShow;
    }

    return { activeExamIndex: activeIdx, examVisibility: visibility };
  }, [exams, examStatuses, loadingExams]);

  // ✅ تحديث حالة القفل والإخفاء لكل امتحان
  useEffect(() => {
    if (Object.keys(examStatuses).length === 0 || loadingExams) return;

    const newStatuses = { ...examStatuses };
    
    exams.forEach((exam: any, index: number) => {
      if (index === 0) {
        newStatuses[exam.id] = {
          ...newStatuses[exam.id],
          locked: false,
          hidden: false,
          checked: newStatuses[exam.id]?.checked || false
        };
        return;
      }

      const previousExam = exams[index - 1];
      const previousStatus = examStatuses[previousExam?.id];
      
      const shouldLock = previousStatus?.passed === true;
      const shouldHide = previousStatus?.passed === true;
      
      newStatuses[exam.id] = {
        ...newStatuses[exam.id],
        locked: shouldLock,
        hidden: shouldHide,
        checked: newStatuses[exam.id]?.checked || false
      };
    });

  }, [exams, examStatuses, loadingExams]);

  // ✅ هل يقدر يشوف الفيديو؟
  const canWatch = useMemo(() => {
    if (!lesson?.must_pass_to_unlock) {
      return true;
    }
    
    if (exams.length === 0) {
      return true;
    }
    
    if (loadingExams) {
      return false;
    }
    
    const allPassed = exams.every((exam: any) => {
      const status = examStatuses[exam.id];
      return status?.passed === true;
    });
    
    return allPassed;
  }, [lesson?.must_pass_to_unlock, exams, examStatuses, loadingExams]);

  // ✅ عرض مودال التواصل مع المعلم (need_support بس)
  useEffect(() => {
    // ✅ لو need_support = true → افتح المودال
    if (lesson?.need_support === true) {
      const timer = setTimeout(() => {
        setShowContactModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    // ✅ المنطق القديم للامتحانات
    if (!lesson?.must_pass_to_unlock) return;
    if (loadingExams) return;
    if (exams.length === 0) return;
    
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
        const timer = setTimeout(() => {
          const failedExamsList = failedList.map((exam: any) => {
            const status = examStatuses[exam.id];
            return {
              ...exam,
              total: status?.total || 0,
              passMarks: status?.passMarks || exam.total_must_pass_marks || 0
            };
          });
          
          setFailedExams(failedExamsList);
          setShowContactModal(true);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [lesson?.need_support, lesson?.must_pass_to_unlock, exams, examStatuses, loadingExams]);

  // Enable protection
  useEffect(() => {
    enableFullProtection();
  }, []);

  // Handlers
  const handlePartChange = (index: number) => {
    selectPart(index);
    setVideoError(false);
    toast.success(
      lang === "ar"
        ? `تم التبديل إلى: ${parts[index]?.title_ar || parts[index]?.title}`
        : `Switched to: ${parts[index]?.title}`
    );
  };

  const handleStartExam = (examId: number) => {
    navigate(`/exam/${examId}?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  const handleStartAssignment = (assignment: any) => {
    navigate(`/exam/${assignment.id}?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  const getVideoUrlFromPart = (part: any) => {
    if (!part) return null;
    return part.videoUrl || part.video_url || part.link_video || part.content_link || null;
  };

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

  const partVideoUrl = getVideoUrlFromPart(currentPart);
  const lessonVideoUrl = lesson?.content_link || lesson?.video_url;
  const finalVideoUrl = partVideoUrl || lessonVideoUrl;

  if (isLoading) return <LessonSkeleton lang={lang} />;

  if (!lesson) {
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
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-gray-950" dir={dir}>
      <div className="container-tight max-w-7xl mx-auto px-4">
        <LessonBreadcrumb slug={slug || ''} title={lesson.title} />

        {/* تقدم الامتحانات */}
        {lesson?.must_pass_to_unlock && exams.length > 0 && (
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
                    
                    if (isHidden) return null;
                    
                    return (
                      <div
                        key={exam.id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed
                            ? 'bg-green-500 text-white'
                            : isFailed
                              ? 'bg-red-500 text-white'
                              : isActive
                                ? 'bg-amber-500 text-white ring-4 ring-amber-500/30 animate-pulse'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                        title={`${exam.title} - ${isPassed ? '✅ نجح' : isFailed ? '❌ فشل' : isActive ? '⏳ ينتظر' : '🔒 مقفول'}`}
                      >
                        {isPassed ? '✓' : isFailed ? '✗' : idx + 1}
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
              className="relative bg-black rounded-2xl overflow-hidden shadow-card"
            >
              <VideoPlayer
                key={selectedPartIndex}
                videoUrl={finalVideoUrl ? getVideoUrl(finalVideoUrl) : null}
                title={currentPart?.title || lesson.title}
                poster={currentPart?.imageUrl || lesson.imageUrl}
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
            </motion.div>

            {canWatch && currentPart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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

            {/* Lesson Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <span>{new Date(lesson.lession_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{lesson.lession_time}</span>
                </div>
                {totalParts > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs">
                    {totalParts} {lang === "ar" ? "أجزاء" : "parts"}
                  </div>
                )}
                
                {lesson?.must_pass_to_unlock ? (
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
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {parts.length > 0 && (
              <LessonPartsList
                parts={parts}
                selectedIndex={selectedPartIndex}
                onSelect={handlePartChange}
                isLocked={!canWatch}
              />
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

                return (
                  <ExamCard
                    key={exam.id}
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
                    onStart={() => handleStartExam(exam.id)}
                    lang={lang}
                  />
                );
              })
            )}

            {lesson.assignments && lesson.assignments.length > 0 && (
              <AssignmentsList
                assignments={lesson.assignments}
                onStartAssignment={handleStartAssignment}
                lang={lang}
              />
            )}

            <div className="flex gap-3">
              <Link
                to={`/courses/${lesson.course_id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-gray-700 dark:text-gray-300"
              >
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                {lang === "ar" ? "العودة للكورس" : "Back to Course"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ مودال التواصل مع المعلم - need_support */}
      <ContactTeacherModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        lang={lang}
        teacherName={lesson?.teacher_id?.name || 'المعلم'}
        phone={lesson?.teacher_id?.phone}
      />

      <style>{`
        .shadow-card {
          box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LessonPage;