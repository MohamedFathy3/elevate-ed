/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/LessonPage.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useLessonDetails } from "@/hooks/useLessonDetails";
import { useExamResult } from "@/hooks/useExams";
import { useCurrentStudent } from "@/hooks/useStudent";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, CheckCircle, Clock, Calendar, ChevronRight, ChevronLeft,
  FileText, Download, ExternalLink, Loader2, Lock, Unlock, 
  ArrowLeft, ArrowRight, BookOpen, Award, Users, MessageCircle,
  ThumbsUp, ThumbsDown, Eye, EyeOff, AlertCircle, FileQuestion,
  ClipboardList, HelpCircle, TrendingUp, BarChart, XCircle, Video,
  PlayCircle
} from "lucide-react";
import { toast } from "sonner";
import { enableFullProtection } from "@/utils/protection";

const LessonPage = () => {
  const { lang, dir } = useLang();
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  
  const { data: lessonData, isLoading: lessonLoading, refetch: refetchLesson } = useLessonDetails(parseInt(lessonId || '0'));
  
  const [lesson, setLesson] = useState<any>(null);
  const [attended, setAttended] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [requiredExam, setRequiredExam] = useState<any>(null);
  const [examPassed, setExamPassed] = useState(false);
  const [examsList, setExamsList] = useState<any[]>([]);
  
  // ✅ State للمقطع المختار حالياً
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  // ✅ تعيين بيانات الدرس من الـ API
  useEffect(() => {
    if (lessonData?.data) {
      const lessonInfo = lessonData.data;
      setLesson(lessonInfo);
      setAttended(lessonInfo.attended || false);
      
      // ✅ جلب الامتحانات من بيانات الدرس مباشرة
      if (lessonInfo.exams && lessonInfo.exams.length > 0) {
        setExamsList(lessonInfo.exams);
        setRequiredExam(lessonInfo.exams[0]);
      }
      
      console.log("📚 Lesson data loaded:", {
        title: lessonInfo.title,
        must_pass_to_unlock: lessonInfo.must_pass_to_unlock,
        hasExams: lessonInfo.exams?.length > 0,
        attended: lessonInfo.attended,
        titles: lessonInfo.titles,
        link_video: lessonInfo.link_video
      });
    }
  }, [lessonData]);
  
  // ✅ التحقق من اجتياز الامتحان المطلوب
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
  
  // ✅ منطق القفل: إذا كان الدرس يتطلب امتحان والطالب لم يجتازه
  const needsExamToUnlock = lesson?.must_pass_to_unlock === true || lesson?.must_solve_assignment_to_unlock === true;
  const canWatch = !needsExamToUnlock;
  
  // ✅ تجهيز الأجزاء من Arrays الدرس (مع صورة الدرس الأب)
  const subParts = (lesson?.titles || []).map((title: string, idx: number) => ({
    id: idx,
    title: title,
    title_ar: lesson?.titles_ar?.[idx] || title,
    videoUrl: lesson?.link_video?.[idx] || lesson?.content_link,
    imageUrl: lesson?.imageUrl, // ✅ صورة الدرس الأب
    description: lesson?.description,
    description_ar: lesson?.description_ar,
  }));
  
  const hasSubParts = subParts.length > 0;
  const currentPart = subParts[selectedPartIndex] || subParts[0];
  const currentVideoUrl = currentPart?.videoUrl || lesson?.content_link;
  
  // ✅ تغيير الجزء الحالي
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
  
  const handleMarkAttendance = () => {
    setAttended(true);
    toast.success(lang === "ar" ? "تم تسجيل حضورك بنجاح!" : "Attendance recorded successfully!");
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
  
  // تفعيل الحماية
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
  
  return (
    <div className="min-h-screen pt-32 pb-20" dir={dir}>
      <div className="container-tight">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground/60 flex-wrap">
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
            {/* Video/Content Player */}
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
                <div className="aspect-video bg-black">
                  <iframe
                    key={embedUrl}
                    src={embedUrl}
                    className="w-full h-full"
                    title={currentPart?.title || lesson.title}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onError={() => setVideoError(true)}
                  />
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <div className="text-center text-white p-4">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
                        <p>{lang === "ar" ? "عذراً، لا يمكن تحميل الفيديو" : "Sorry, cannot load video"}</p>
                        <a 
                          href={currentVideoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-3 inline-block px-4 py-2 rounded-lg bg-primary text-white text-sm"
                        >
                          {lang === "ar" ? "فتح على يوتيوب" : "Open on YouTube"}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
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
            
            {/* Current Part Info */}
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
            
            {/* Lesson Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 p-6 bg-card rounded-2xl border border-border"
            >
              <h1 className="text-2xl font-bold mb-2">
                {lang === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title}
              </h1>
              <p className="text-foreground/60 mb-4">
                {lang === "ar" && lesson.description_ar ? lesson.description_ar : lesson.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-foreground/50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(lesson.lession_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.lession_time}</span>
                </div>
                {hasSubParts && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                    <Video className="w-3 h-3" />
                    {subParts.length} {lang === "ar" ? "أجزاء" : "parts"}
                  </div>
                )}
                {lesson.must_pass_to_unlock === true && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs">
                    <Lock className="w-3 h-3" />
                    {lang === "ar" ? "يتطلب اجتياز امتحان" : "Requires exam"}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar - Parts Cards + Actions */}
          <div className="space-y-6">
            {/* ✅ كروت أجزاء الدرس - مع الصورة */}
            {canWatch && hasSubParts && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border border-border p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    {lang === "ar" ? "أجزاء الدرس" : "Lesson Parts"}
                  </h3>
                  <span className="text-xs text-foreground/50 bg-secondary px-2 py-1 rounded-full">
                    {subParts.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                  {subParts.map((part: any, idx: number) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleSelectPart(idx)}
                      className={`w-full text-left rounded-xl transition-all overflow-hidden border-2
                        ${selectedPartIndex === idx 
                          ? 'border-primary shadow-md bg-primary/5' 
                          : 'border-border hover:border-primary/40 bg-card'}`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        {/* صورة الجزء (من الدرس الأب) */}
                        <img 
                          src={part.imageUrl || "/default-course.jpg"} 
                          alt={part.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        
                        {/* معلومات الجزء */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                              ${selectedPartIndex === idx 
                                ? 'bg-primary' 
                                : 'bg-gray-300 dark:bg-gray-600'}`}>
                              {idx + 1}
                            </div>
                            <p className={`font-medium text-sm truncate ${selectedPartIndex === idx ? 'text-primary' : ''}`}>
                              {lang === "ar" ? part.title_ar : part.title}
                            </p>
                          </div>
                          <p className="text-xs text-foreground/50 flex items-center gap-1 mt-1">
                            <PlayCircle className="w-3 h-3" />
                            {lang === "ar" ? "فيديو تعليمي" : "Educational video"}
                          </p>
                        </div>
                        
                        {/* أيون التشغيل */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                          ${selectedPartIndex === idx 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-foreground/40'}`}>
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
            
            {/* Required Exam Card */}
            {needsExamToUnlock && requiredExam && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/30 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <FileQuestion className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-lg">
                    {lang === "ar" ? "الامتحان المطلوب" : "Required Exam"}
                  </h3>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold">{requiredExam.title}</p>
                  <p className="text-sm text-foreground/60 mt-1">{requiredExam.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-foreground/50">
                    <span><HelpCircle className="w-3 h-3 inline" /> {requiredExam.questions?.length || 0} {lang === "ar" ? "سؤال" : "questions"}</span>
                    <span><Award className="w-3 h-3 inline" /> {requiredExam.total_marks} {lang === "ar" ? "درجة" : "marks"}</span>
                    <span><Clock className="w-3 h-3 inline" /> {requiredExam.duration_minutes} {lang === "ar" ? "دقيقة" : "min"}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleStartExam(requiredExam)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {lang === "ar" ? "ابدأ الامتحان" : "Start Exam"}
                </button>
              </motion.div>
            )}
            
            {/* After Passing Exam Card */}
         
            {/* Attendance Card */}
            {canWatch && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {lang === "ar" ? "تسجيل الحضور" : "Attendance"}
                </h3>
                
                {attended ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>{lang === "ar" ? "تم تسجيل حضورك" : "Attendance recorded"}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground/60 mb-4">
                      {lang === "ar" 
                        ? "يرجى تأكيد حضورك بعد مشاهدة الدرس"
                        : "Please confirm your attendance after watching the lesson"}
                    </p>
                    <button
                      onClick={handleMarkAttendance}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold flex items-center justify-center gap-2"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      {lang === "ar" ? "تأكيد الحضور" : "Confirm Attendance"}
                    </button>
                  </>
                )}
              </motion.div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Link
                to={`/${slug}/courses/${lesson.course_id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-all"
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