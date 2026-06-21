/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/LessonPage.tsx - باستخدام useAttendance الموجودة
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useLessonDetails } from "@/hooks/useLessonDetails";
import { useExamResult } from "@/hooks/useExams";
import { useCurrentStudent } from "@/hooks/useStudent";
import { useAttendance } from "@/hooks/useAttendance";
import { useWatermark } from '@/hooks/useWatermark';
import { usePreventScreenshot } from '@/hooks/usePreventScreenshot';
import { useDetectDevTools } from '@/hooks/useDetectDevTools';
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { enableFullProtection } from "@/utils/protection";
import Cookies from "js-cookie";

import { VideoPlayer } from "@/components/lesson/video/VideoPlayer";
import { LessonBreadcrumb } from "@/components/lesson/LessonBreadcrumb";
import { LessonPartsList } from "@/components/lesson/LessonSidebar/LessonPartsList";
import { RequiredExamCard } from "@/components/lesson/LessonSidebar/RequiredExamCard";
import { AssignmentsList } from "@/components/lesson/LessonSidebar/AssignmentsList";
import { LessonSkeleton } from "@/components/lesson/LessonSkeleton";

// ✅ Hooks
import { useLessonParts } from "@/hooks/useLessonParts";

const LessonPage = () => {
  const { lang, dir } = useLang();
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  
  // ✅ Data
  const { data: lessonData, isLoading, refetch: refetchLesson } = useLessonDetails(parseInt(lessonId || '0'));
  const lesson = lessonData?.data;
  
  // ✅ Hooks
  const { parts, currentPart, selectedPartIndex, selectPart, totalParts } = useLessonParts(lesson);
  
  // ✅ Attendance - باستخدام hook الموجود
  const { mutate: markAttendance, isPending: attendancePending, isSuccess: attendanceSuccess } = useAttendance();
  const attendanceAttempted = useRef(false);
  
  // ✅ State
  const [attended, setAttended] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [examPassed, setExamPassed] = useState(false);
  
  // ✅ DevTools Protection
  // const { devToolsOpen } = useDetectDevTools(true);
  
  // ✅ Watermark & Protection
  const watermarkText = student 
    ? `${student.name} | ID: ${student.id} | ${new Date().toLocaleDateString('ar-EG')}`
    : 'زائر | يرجى تسجيل الدخول';
  
  usePreventScreenshot(true);
  useWatermark(watermarkText, true);
  
  // ✅ دالة للحصول على مفتاح الكوكي الخاص بالحضور
  const getAttendanceCookieKey = () => {
    return `attendance_${slug}_${lessonId}`;
  };

  // ✅ دالة للتحقق من وجود كوكي الحضور
  const hasAttendanceCookie = () => {
    const key = getAttendanceCookieKey();
    const cookie = Cookies.get(key);
    return cookie === 'true';
  };

  // ✅ دالة لحفظ كوكي الحضور
  const setAttendanceCookie = () => {
    const key = getAttendanceCookieKey();
    Cookies.set(key, 'true', { 
      expires: 365,
      path: '/',
      sameSite: 'Lax'
    });
    console.log(`✅ Attendance cookie saved: ${key}`);
  };
  
  // ✅ Sync attendance from API
  useEffect(() => {
    if (lesson) {
      // ✅ التحقق من الكوكي أولاً
      const cookieAttended = hasAttendanceCookie();
      
      if (cookieAttended) {
        console.log("✅ Attendance found in cookie, marking as attended");
        setAttended(true);
      } else {
        setAttended(lesson.attended || false);
      }
    }
  }, [lesson]);

  // ✅ Record attendance
  useEffect(() => {
    if (!student?.id || !lessonId || !lesson || attendanceAttempted.current) {
      return;
    }
    
    // ✅ التحقق من الكوكي أولاً
    if (hasAttendanceCookie()) {
      console.log("✅ Attendance cookie found, skipping API call");
      setAttended(true);
      attendanceAttempted.current = true;
      return;
    }
    
    // لو الحضور مسجل مسبقاً من الـ API
    if (attended) {
      console.log("✅ Attendance already recorded (from API)");
      attendanceAttempted.current = true;
      setAttendanceCookie();
      return;
    }
    
    // ✅ تسجيل الحضور
    console.log("✅ Marking attendance for lesson:", lessonId);
    attendanceAttempted.current = true;
    
    markAttendance({
      lesson_id: parseInt(lessonId),
      student_id: student.id,
      slug: slug,
    });
    
  }, [student?.id, lessonId, lesson, attended, markAttendance, slug]);

  // ✅ Update attendance state on success
  useEffect(() => {
    if (attendanceSuccess) {
      console.log("✅ Attendance success! Updating state and saving cookie...");
      setAttended(true);
      setAttendanceCookie();
      refetchLesson();
    }
  }, [attendanceSuccess, refetchLesson]);

  // ✅ Check exam result
  const requiredExam = lesson?.exams?.[0] || null;
  const { data: examResultData } = useExamResult(
    requiredExam?.id || 0, 
    student?.id || 0
  );
  
  useEffect(() => {
    if (examResultData) {
      const passed = examResultData.status === true;
      setExamPassed(passed);
    }
  }, [examResultData]);

  // ✅ Enable protection
  useEffect(() => {
    enableFullProtection();
  }, []);

  // ✅ Handlers
  const handlePartChange = (index: number) => {
    selectPart(index);
    setVideoError(false);
    toast.success(
      lang === "ar" 
        ? `تم التبديل إلى: ${parts[index]?.title_ar || parts[index]?.title}` 
        : `Switched to: ${parts[index]?.title}`
    );
  };

  const handleStartExam = () => {
    if (requiredExam) {
      navigate(`/${slug}/exam/${requiredExam.id}?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  };

  const handleStartAssignment = (assignment: any) => {
    navigate(`/${slug}/exam/${assignment.id}?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  // ✅ Check if lesson needs exam to unlock
  const needsExamToUnlock = lesson?.must_pass_to_unlock === true;
  const canWatch = !needsExamToUnlock || examPassed;

  // ✅ Loading
  if (isLoading) return <LessonSkeleton lang={lang} />;

  // ✅ Not found
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 grid place-items-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">
            {lang === "ar" ? "الدرس غير موجود" : "Lesson not found"}
          </h2>
          <Link to={`/${slug}/dashboard`} className="text-primary hover:underline">
            {lang === "ar" ? "العودة للوحة التحكم" : "Back to Dashboard"}
          </Link>
        </div>
      </div>
    );
  }

  // ✅ DevTools detected
  // if (devToolsOpen) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950/20">
  //       <div className="text-center p-8 max-w-md">
  //         <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
  //           <AlertCircle className="w-10 h-10 text-red-500" />
  //         </div>
  //         <h2 className="text-2xl font-bold mb-3 text-red-600 dark:text-red-400">
  //           ⚠️ {lang === "ar" ? "تم اكتشاف أدوات المطور" : "Developer Tools Detected"}
  //         </h2>
  //         <p className="text-gray-600 dark:text-gray-400 mb-6">
  //           {lang === "ar" 
  //             ? "يرجى إغلاق أدوات المطور (F12) لمتابعة المحتوى"
  //             : "Please close Developer Tools (F12) to continue"}
  //         </p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all"
  //         >
  //           {lang === "ar" ? "إعادة تحميل الصفحة" : "Reload Page"}
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen pt-32 pb-20" dir={dir}>
      <div className="container-tight max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <LessonBreadcrumb slug={slug || ''} title={lesson.title} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-black rounded-2xl overflow-hidden shadow-card"
            >
              <VideoPlayer
                videoUrl={currentPart?.videoUrl || lesson.content_link}
                title={lesson.title}
                poster={lesson.imageUrl}
                isLocked={!canWatch}
                requiredExam={requiredExam}
                onStartExam={handleStartExam}
                parts={parts}
                onPartChange={handlePartChange}
                selectedPartIndex={selectedPartIndex}
              />
            </motion.div>

            {/* Current Part Info */}
            {canWatch && currentPart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20"
              >
                <div className="flex items-center gap-2 text-sm text-foreground/60 mb-1">
                  <span className="text-primary font-semibold">#{selectedPartIndex + 1}</span>
                  <span>{lang === "ar" ? "الجزء الحالي" : "Current part"}</span>
                </div>
                <h3 className="font-bold text-lg">
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
              <p className="text-gray-500 dark:text-gray-400 mb-4">
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
                {needsExamToUnlock && !examPassed && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs">
                    {lang === "ar" ? "يتطلب اجتياز امتحان" : "Requires exam"}
                  </div>
                )}
                {examPassed && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs">
                    ✅ {lang === "ar" ? "تم اجتياز الامتحان" : "Exam passed"}
                  </div>
                )}
                {attended && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs">
                    ✅ {lang === "ar" ? "تم الحضور" : "Attended"}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parts List */}
            {canWatch && parts.length > 0 && (
              <LessonPartsList
                parts={parts}
                selectedIndex={selectedPartIndex}
                onSelect={handlePartChange}
              />
            )}

            {/* Required Exam - when locked or not passed */}
            {needsExamToUnlock && !examPassed && requiredExam && (
              <RequiredExamCard
                exam={requiredExam}
                onStartExam={handleStartExam}
                lang={lang}
              />
            )}

            {/* Assignments */}
            {lesson.assignments && lesson.assignments.length > 0 && (
              <AssignmentsList
                assignments={lesson.assignments}
                onStartAssignment={handleStartAssignment}
                lang={lang}
              />
            )}

            {/* Back Button */}
            <div className="flex gap-3">
              <Link
                to={`/${slug}/courses/${lesson.course_id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-gray-700 dark:text-gray-300"
              >
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                {lang === "ar" ? "العودة للكورس" : "Back to Course"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .shadow-card {
          box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LessonPage;