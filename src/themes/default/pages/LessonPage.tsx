/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/LessonPage.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useLessonDetails } from "@/hooks/useLessonDetails";
import { useExamResult } from "@/hooks/useExams";
import { useCurrentStudent } from "@/hooks/useStudent";
import { useWatermark } from '@/hooks/useWatermark';
import { usePreventScreenshot } from '@/hooks/usePreventScreenshot';
import { useDetectDevTools } from '@/hooks/useDetectDevTools';
import { motion, AnimatePresence } from "framer-motion";
import { useStudentAuth } from "@/context/StudentAuthContext";
import VideoPlayer from '@/components/VideoPlayer';
import { useAttendance } from "@/hooks/useAttendance"; 
import { 
  Play, CheckCircle, Clock, Calendar, ChevronRight, ChevronLeft,
  FileText, Download, ExternalLink, Loader2, Lock, Unlock, 
  ArrowLeft, ArrowRight, BookOpen, Award, Users, MessageCircle,
  ThumbsUp, ThumbsDown, Eye, EyeOff, AlertCircle, FileQuestion,
  ClipboardList, HelpCircle, TrendingUp, BarChart, XCircle, Video,
  PlayCircle
} from "lucide-react";
import useAdvancedProtection from '@/hooks/useScreenRecorderProtection';
import { toast } from "@/hooks/use-toast";
import { enableFullProtection } from "@/utils/protection";
import Cookies from "js-cookie";

const LessonPage = () => {
  const { lang, dir } = useLang();
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  const { data: lessonData, isLoading: lessonLoading, refetch: refetchLesson } = useLessonDetails(parseInt(lessonId || '0'));
  const { mutate: markAttendance, isPending: attendancePending, isSuccess: attendanceSuccess } = useAttendance();

  const [lesson, setLesson] = useState<any>(null);
  const [attended, setAttended] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [requiredExam, setRequiredExam] = useState<any>(null);
  const [examPassed, setExamPassed] = useState(false);
  const [examsList, setExamsList] = useState<any[]>([]);
  const [assignmentsList, setAssignmentsList] = useState<any[]>([]);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(0);

  // ✅ ref لتتبع محاولة تسجيل الحضور (مرة واحدة فقط)
  const attendanceAttempted = useRef(false);
  // ✅ ref لتتبع تحميل بيانات الدرس
  const lessonLoadedRef = useRef(false);
const { devToolsOpen } = useDetectDevTools(true);

  const watermarkText = student 
    ? `${student.name} | ID: ${student.id} | ${new Date().toLocaleDateString('ar-EG')}`
    : 'زائر | يرجى تسجيل الدخول';  
    
  usePreventScreenshot(true);
  useWatermark(watermarkText, true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  const { BlueScreen, ProtectedContent } = useAdvancedProtection({
    enabled: true,
    sensitivity: 'low',
    videoRef: videoRef,
    onDetect: () => {
      toast.error("⚠️ تم اكتشاف محاولة تسجيل!");
    }
  });

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
      expires: 365, // ينتهي بعد سنة
      path: '/',
      sameSite: 'Lax'
    });
    console.log(`✅ Attendance cookie saved: ${key}`);
  };

  // ✅ تعيين بيانات الدرس من الـ API
  useEffect(() => {
    if (lessonData?.data) {
      const lessonInfo = lessonData.data;
      setLesson(lessonInfo);
      
      // ✅ التحقق من الكوكي أولاً
      const cookieAttended = hasAttendanceCookie();
      
      if (cookieAttended) {
        console.log("✅ Attendance found in cookie, marking as attended");
        setAttended(true);
        lessonInfo.attended = true;
      } else {
        setAttended(lessonInfo.attended || false);
      }
      
      lessonLoadedRef.current = true;
      
      if (lessonInfo.exams && lessonInfo.exams.length > 0) {
        setExamsList(lessonInfo.exams);
        setRequiredExam(lessonInfo.exams[0]);
      }
      if (lessonInfo.assignments && lessonInfo.assignments.length > 0) {
        setAssignmentsList(lessonInfo.assignments);
      }
      
      console.log("📚 Lesson data loaded:", {
        title: lessonInfo.title,
        attended: lessonInfo.attended,
        cookieAttended: cookieAttended,
        must_pass_to_unlock: lessonInfo.must_pass_to_unlock,
      });
    }
  }, [lessonData]);

  // ✅ ✅ ✅ تسجيل الحضور - مع التحقق من الكوكي ✅ ✅ ✅
  useEffect(() => {
    // شيكات مبدئية
    if (!student?.id || !lessonId || !lessonLoadedRef.current) {
      console.log("⏭️ Skipping attendance: Missing data");
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
      // حفظ في الكوكي عشان ما نطلبش تاني
      setAttendanceCookie();
      return;
    }
    
    // لو تمت المحاولة قبل كده
    if (attendanceAttempted.current) {
      console.log("⏭️ Attendance already attempted");
      return;
    }
    
    // ✅ تسجيل الحضور - مرة واحدة بس
    console.log("✅ Marking attendance for lesson:", lessonId);
    attendanceAttempted.current = true;
    
    markAttendance({
      lesson_id: parseInt(lessonId),
      student_id: student.id,
      slug: slug,
    });
    
  }, [student?.id, lessonId, attended, markAttendance, slug, lessonLoadedRef.current]);

  // ✅ تحديث حالة الحضور عند نجاح التسجيل وحفظ في الكوكي
  useEffect(() => {
    if (attendanceSuccess) {
      console.log("✅ Attendance success! Updating state and saving cookie...");
      setAttended(true);
      setAttendanceCookie(); // ✅ حفظ في الكوكي
      refetchLesson();
    }
  }, [attendanceSuccess, refetchLesson]);

  const handleStartAssignment = (exam: any) => {
    navigate(`/${slug}/exam/${exam.id}?redirect=${encodeURIComponent(window.location.pathname)}`);
  };
  
  const { data: examResultData } = useExamResult(
    requiredExam?.id || 0, 
    student?.id || 0
  );
  
  useEffect(() => {
    if (requiredExam && examResultData) {
      const hasPassed = examResultData.status === true;
      setExamPassed(hasPassed);
      console.log(`📊 Exam ${requiredExam.id} result:`, { passed: hasPassed });
    }
  }, [examResultData, requiredExam]);
  
  const needsExamToUnlock = lesson?.must_pass_to_unlock === true || lesson?.must_solve_assignment_to_unlock === true;
  const canWatch = !needsExamToUnlock;
  
  const subParts = (lesson?.titles || []).map((title: string, idx: number) => ({
    id: idx,
    title: title,
    title_ar: lesson?.titles_ar?.[idx] || title,
    videoUrl: lesson?.link_video?.[idx] || lesson?.content_link,
    imageUrl: lesson?.imageUrl,
    description: lesson?.description,
    description_ar: lesson?.description_ar,
  }));
  
  const hasSubParts = subParts.length > 0;
  const currentPart = subParts[selectedPartIndex] || subParts[0];
  const currentVideoUrl = currentPart?.videoUrl || lesson?.content_link;
  
  const handleSelectPart = (index: number) => {
    setSelectedPartIndex(index);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
    toast.success(
      lang === "ar" 
        ? `تم التبديل إلى: ${subParts[index]?.title_ar || subParts[index]?.title}` 
        : `Switched to: ${subParts[index]?.title}`
    );
  };
  
  const handleStartExam = (exam: any) => {
    navigate(`/${slug}/exam/${exam.id}?redirect=${encodeURIComponent(window.location.pathname)}`);
  };
  
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return url;
  };
  
  const isVideo = currentVideoUrl?.includes('youtube.com') || currentVideoUrl?.includes('youtu.be');
  const isPdf = currentVideoUrl?.endsWith('.pdf');
  const isExternal = !isVideo && !isPdf;
  const embedUrl = isVideo ? getYouTubeEmbedUrl(currentVideoUrl) : null;
  
  useEffect(() => {
    enableFullProtection();
  }, []);
  
  if (lessonLoading) {
    return <LessonSkeleton />;
  }
  
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
if (devToolsOpen) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950/20">
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-red-600 dark:text-red-400">
          ⚠️ {lang === "ar" ? "تم اكتشاف أدوات المطور" : "Developer Tools Detected"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {lang === "ar" 
            ? "يرجى إغلاق أدوات المطور (F12) لمتابعة المحتوى"
            : "Please close Developer Tools (F12) to continue"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all"
        >
          {lang === "ar" ? "إعادة تحميل الصفحة" : "Reload Page"}
        </button>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen pt-32 pb-20" dir={dir}>
      {BlueScreen}
      <ProtectedContent>
        <div className="container-tight">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-[#000] flex-wrap">
              <Link to={`/${slug}/dashboard`} className="hover:text-primary transition-colors">
                {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/${slug}/courses`} className="hover:text-primary transition-colors">
                {lang === "ar" ? "كورساتي" : "My Courses"}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground line-clamp-1">{lesson.title}</span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Video Player */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-black rounded-2xl overflow-hidden shadow-card"
              >
                {needsExamToUnlock ? (
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8 text-center">
                    <Lock className="w-20 h-20 text-white/30 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      {lang === "ar" ? "هذا الدرس مقفل" : "This lesson is locked"}
                    </h3>
                    <p className="text-white/60 text-sm mb-6 max-w-md">
                      {lang === "ar" 
                        ? "يجب اجتياز الامتحان التالي لفتح هذا الدرس"
                        : "You must pass the following exam to unlock this lesson"}
                    </p>
                    {requiredExam && (
                      <button
                        onClick={() => handleStartExam(requiredExam)}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-2"
                      >
                        <FileQuestion className="w-4 h-4" />
                        {lang === "ar" ? "ابدأ الامتحان" : "Start Exam"}
                      </button>
                    )}
                  </div>
                ) : isVideo && embedUrl ? (
                  <VideoPlayer
                    videoUrl={currentVideoUrl}
                    title={lesson.title}
                    studentName={student?.name}
                    studentId={student?.id}
                    isLocked={needsExamToUnlock}
                    requiredExam={requiredExam}
                    onStartExam={() => handleStartExam(requiredExam)}
                    poster={lesson.imageUrl}
                    parts={subParts}
                    onPartChange={handleSelectPart}
                    selectedPartIndex={selectedPartIndex}
                  />
                ) : isPdf ? (
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center p-8">
                      <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="mb-4">{lang === "ar" ? "ملف PDF" : "PDF File"}</p>
                      <a
                        href={currentVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white"
                      >
                        <Download className="w-4 h-4" />
                        {lang === "ar" ? "تحميل الملف" : "Download"}
                      </a>
                    </div>
                  </div>
                ) : isExternal ? (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center p-8">
                      <ExternalLink className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="mb-4">{lang === "ar" ? "محتوى خارجي" : "External Content"}</p>
                      <a
                        href={currentVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {lang === "ar" ? "فتح الرابط" : "Open Link"}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Play className="w-16 h-16 text-primary" />
                    <p className="text-foreground/60 mt-4">{lang === "ar" ? "لا يوجد محتوى" : "No content available"}</p>
                  </div>
                )}
              </motion.div>
              
              {canWatch && hasSubParts && currentPart && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20"
                >
                  <div className="flex items-center gap-2 text-sm text-foreground/60 mb-1">
                    <Video className="w-4 h-4 text-primary" />
                    <span>{lang === "ar" ? "الجزء الحالي" : "Current part"}</span>
                    <span className="text-primary font-semibold">#{selectedPartIndex + 1}</span>
                  </div>
                  <h3 className="font-bold text-lg">
                    {lang === "ar" ? currentPart.title_ar : currentPart.title}
                  </h3>
                </motion.div>
              )}
              
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
                    <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span>{new Date(lesson.lession_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span>{lesson.lession_time}</span>
                  </div>
                  {hasSubParts && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs">
                      <Video className="w-3 h-3" />
                      {subParts.length} {lang === "ar" ? "أجزاء" : "parts"}
                    </div>
                  )}
                  {lesson.must_pass_to_unlock === true && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs">
                      <Lock className="w-3 h-3" />
                      {lang === "ar" ? "يتطلب اجتياز امتحان" : "Requires exam"}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {canWatch && hasSubParts && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                      <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      {lang === "ar" ? "أجزاء الدرس" : "Lesson Parts"}
                    </h3>
                    <span className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                      {subParts.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                    {subParts.map((part: any, idx: number) => (
                      <motion.button
                        key={idx}
                        onClick={() => handleSelectPart(idx)}
                        className={`w-full text-left rounded-xl transition-all overflow-hidden border-2 ${
                          selectedPartIndex === idx 
                            ? 'border-blue-500 dark:border-blue-400 shadow-md shadow-blue-500/20 bg-blue-50 dark:bg-blue-950/30' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 p-3">
                          <img 
                            src={part.imageUrl || "/default-course.jpg"} 
                            alt={part.title}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                                selectedPartIndex === idx 
                                  ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}>
                                {idx + 1}
                              </div>
                              <p className={`font-medium text-sm truncate ${
                                selectedPartIndex === idx 
                                  ? 'text-blue-600 dark:text-blue-400' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {lang === "ar" ? part.title_ar : part.title}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <PlayCircle className="w-3 h-3" />
                              {lang === "ar" ? "فيديو تعليمي" : "Educational video"}
                            </p>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            selectedPartIndex === idx 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                          }`}>
                            {selectedPartIndex === idx ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {needsExamToUnlock && requiredExam && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <FileQuestion className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {lang === "ar" ? "الامتحان المطلوب" : "Required Exam"}
                    </h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{requiredExam.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{requiredExam.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span><HelpCircle className="w-3 h-3 inline" /> {requiredExam.questions?.length || 0} {lang === "ar" ? "سؤال" : "questions"}</span>
                      <span><Award className="w-3 h-3 inline" /> {requiredExam.total_marks} {lang === "ar" ? "درجة" : "marks"}</span>
                      <span><Clock className="w-3 h-3 inline" /> {requiredExam.duration_minutes} {lang === "ar" ? "دقيقة" : "min"}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleStartExam(requiredExam)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    {lang === "ar" ? "ابدأ الامتحان" : "Start Exam"}
                  </button>
                </motion.div>
              )}
              
              {assignmentsList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {lang === "ar" ? "الواجبات" : "Assignments"}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {assignmentsList.map((assignment) => (
                      <div key={assignment.id} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{assignment.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{assignment.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span><Award className="w-3 h-3 inline" /> {assignment.total_marks} {lang === "ar" ? "درجة" : "marks"}</span>
                          {assignment.time_end && (
                            <span><Calendar className="w-3 h-3 inline" /> {new Date(assignment.time_end).toLocaleDateString()}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleStartAssignment(assignment)}
                          className="w-full mt-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                        >
                          <FileText className="w-3 h-3" />
                          {lang === "ar" ? "حل الواجب" : "Solve Assignment"}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
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
        
        <style>{`
          .recording-detected { filter: blur(40px) !important; opacity: 0.2 !important; transition: all 0.3s ease; }
          video::-webkit-media-controls-download-button { display: none !important; }
          video::-webkit-media-controls-enclosure { overflow: hidden; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        `}</style>
      </ProtectedContent>
    </div>
  );
};

// Skeleton Component
const LessonSkeleton = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-tight">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="mt-6 p-6 bg-card rounded-2xl">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-3 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 animate-pulse" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;