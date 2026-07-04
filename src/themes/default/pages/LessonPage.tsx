/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useLessonDetails } from "@/hooks/useLessonDetails";
import { useCurrentStudent } from "@/hooks/useStudent";
import { useAttendance } from "@/hooks/useAttendance";
import { useWatermark } from '@/hooks/useWatermark';
import { usePreventScreenshot } from '@/hooks/usePreventScreenshot';
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, FileQuestion, Lock, Unlock, CheckCircle, Loader2, XCircle, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { enableFullProtection } from "@/utils/protection";
import Cookies from "js-cookie";
import { useTeacher } from "@/context/TeacherContext";

// ✅ Imports المكونات الموجودة
import { VideoPlayer } from "@/components/lesson/video/VideoPlayer";
import { LessonBreadcrumb } from "@/components/lesson/LessonBreadcrumb";
import { LessonPartsList } from "@/components/lesson/LessonSidebar/LessonPartsList";
import { AssignmentsList } from "@/components/lesson/LessonSidebar/AssignmentsList";
import { LessonSkeleton } from "@/components/lesson/LessonSkeleton";
import { useLessonParts } from "@/hooks/useLessonParts";

// ✅ Imports المكونات الجديدة
import { ContactTeacherModal } from "@/components/lesson/LessonPage/components/ContactTeacherModal";
import { ExamCard } from "@/components/lesson/LessonPage/components/ExamCard";
import { AssignmentCard } from "@/components/lesson/LessonPage/components/AssignmentCard";
import { useExamResults } from "@/hooks/useExamResults";
import { useAssignmentResults } from "@/hooks/useAssignmentResults";

const LessonPage = () => {
  const { lang, dir } = useLang();
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  const { teacher } = useTeacher();
  
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
  const [contactModalType, setContactModalType] = useState<'default' | 'exam_hidden' | 'need_support'>('default');
  const [failedExams, setFailedExams] = useState<any[]>([]);

  const exams = lesson?.exams || [];
  const assignments = lesson?.assignments || [];
  
  const { examStatuses, loadingExams, setExamStatuses } = useExamResults(exams, student?.id || 0);
  const { assignmentStatuses, loadingAssignments } = useAssignmentResults(assignments, student?.id || 0);

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
  }, [exams, loadingExams]);

  // ✅ هل يقدر يشوف الفيديو؟
// ✅ هل يقدر يشوف الفيديو؟
const canWatch = useMemo(() => {
  // ✅ لو must_pass_to_unlock = false، الفيديو مفتوح
  if (!lesson?.must_pass_to_unlock) return true;
  
  // ✅ لو مفيش امتحانات، الفيديو مفتوح
  if (exams.length === 0) return true;
  
  // ✅ لو لسه بيحمل، مقفول
  if (loadingExams) return false;
  
  // ✅ كل الامتحانات لازم تكون نجحت
  const allPassed = exams.every((exam: any) => {
    const status = examStatuses[exam.id];
    return status?.passed === true;
  });
  
  return allPassed;
}, [lesson?.must_pass_to_unlock, exams, examStatuses, loadingExams]);

  // ✅ عرض مودال التواصل مع المعلم
  useEffect(() => {
    if (lesson?.need_support === true) {
      const timer = setTimeout(() => {
        setContactModalType('need_support');
        setShowContactModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (!lesson?.must_pass_to_unlock) return;
    if (loadingExams) return;
    if (exams.length === 0) return;
    
    const hiddenExams = exams.filter((exam: any) => {
      const status = examStatuses[exam.id];
      return status?.waitingResult === true;
    });
    
    if (hiddenExams.length > 0) {
      const timer = setTimeout(() => {
        setContactModalType('exam_hidden');
        setShowContactModal(true);
      }, 500);
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
        const timer = setTimeout(() => {
          setContactModalType('default');
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
  };

  const handleStartAssignment = (assignmentId: number) => {
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
  const isWaitingResult = status?.waitingResult || false;
  const isWaitingCorrection = status?.waitingCorrection || false;
  const studentPassedMessage = status?.studentPassedMessage || null;
  const showMessageOnly = status?.showMessageOnly || false;
  const notSolved = status?.notSolved || false; // ✅ جلب الحالة

  console.log(`📋 [LessonPage] Exam ${index + 1}: "${exam.title}"`);
  console.log(`   - notSolved: ${notSolved}`);

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
      isWaitingResult={isWaitingResult}
      isWaitingCorrection={isWaitingCorrection}
      studentPassedMessage={studentPassedMessage}
      showMessageOnly={showMessageOnly}
      notSolved={notSolved} // ✅ تمرير الحالة
      onStart={() => handleStartExam(exam.id)}
      lang={lang}
    />
  );
})
)}

            {/* ✅ الواجبات بنفس نظام الامتحانات */}
            {loadingAssignments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="mr-2 text-sm text-gray-500">
                  {lang === "ar" ? "جاري تحميل الواجبات..." : "Loading assignments..."}
                </span>
              </div>
            ) : (
            // في LessonPage - عند عرض الواجبات
// في LessonPage - عند عرض الواجبات
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

  console.log(`📋 [LessonPage] Assignment ${index + 1}: "${assignment.title}"`);
  console.log(`   - studentPassedMessage: "${studentPassedMessage}"`);
  console.log(`   - showMessageOnly: ${showMessageOnly}`);
  console.log(`   - notSolved: ${notSolved}`);

  return (
    <AssignmentCard
      key={assignment.id}
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
  );
})
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

      {/* ✅ مودال التواصل مع المعلم */}
      <ContactTeacherModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        lang={lang}
        teacherName={teacher?.name || lesson?.teacher_id?.name || 'المعلم'}
        phone={teacher?.phone || lesson?.teacher_id?.phone} 
        messageType={contactModalType}
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