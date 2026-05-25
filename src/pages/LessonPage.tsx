/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/LessonPage.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useStudentLearning, useLessonAttendance } from "@/hooks/useStudent";
import { useLessonExams, useExamResult } from "@/hooks/useExams";
import { useCurrentStudent } from "@/hooks/useStudent";
import { motion } from "framer-motion";
import { 
  Play, CheckCircle, Clock, Calendar, ChevronRight, ChevronLeft,
  FileText, Download, ExternalLink, Loader2, Lock, Unlock, 
  ArrowLeft, ArrowRight, BookOpen, Award, Users, MessageCircle,
  ThumbsUp, ThumbsDown, Eye, EyeOff, AlertCircle, FileQuestion,
  ClipboardList, HelpCircle, TrendingUp, BarChart, XCircle
} from "lucide-react";
import { toast } from "sonner";

const LessonPage = () => {
  const { lang, dir } = useLang();
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  const { data: learning, isLoading, refetch } = useStudentLearning();
  const { mutate: markAttendance, isPending: attendanceLoading } = useLessonAttendance();
  const { data: examsData, isLoading: examsLoading } = useLessonExams(parseInt(lessonId || '0'));
  
  const [lesson, setLesson] = useState<any>(null);
  const [attended, setAttended] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [videoError, setVideoError] = useState(false);
  
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  
  useEffect(() => {
    if (learning?.data?.lessons) {
      const foundLesson = learning.data.lessons.find((l: any) => l.id === parseInt(lessonId || '0'));
      setLesson(foundLesson);
      setAttended(foundLesson?.attended || false);
    }
  }, [learning, lessonId]);
  
  useEffect(() => {
    if (examsData?.data) {
      const examList = examsData.data.filter((e: any) => e.type === 'exam');
      const assignmentList = examsData.data.filter((e: any) => e.type === 'assignment');
      setExams(examList);
      setAssignments(assignmentList);
    }
  }, [examsData]);
  
  const handleMarkAttendance = () => {
    markAttendance(parseInt(lessonId || '0'), {
      onSuccess: () => {
        setAttended(true);
        refetch();
        toast.success(lang === "ar" ? "تم تسجيل حضورك بنجاح!" : "Attendance recorded successfully!");
      }
    });
  };
  
  const handleStartExam = (exam: any) => {
    if (!attended) {
      toast.error(lang === "ar" ? "يجب تسجيل الحضور أولاً" : "Please mark attendance first");
      return;
    }
    navigate(`/${slug}/exam/${exam.id}`);
  };
  
  // معالجة رابط يوتيوب بشكل صحيح
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // youtube.com/watch?v=xxx
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
    }
    // youtu.be/xxx
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
    }
    // youtube.com/embed/xxx
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return url;
  };
  
  if (isLoading || examsLoading) {
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
  
  const isVideo = lesson.content_link?.includes('youtube.com') || lesson.content_link?.includes('youtu.be');
  const isPdf = lesson.content_link?.endsWith('.pdf');
  const isExternal = !isVideo && !isPdf;
  const hasExams = exams.length > 0;
  const hasAssignments = assignments.length > 0;
  const embedUrl = isVideo ? getYouTubeEmbedUrl(lesson.content_link) : null;
  
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-tight">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground/60 flex-wrap">
            <Link to={`/${slug}/dashboard`} className="hover:text-primary transition-colors">
              {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${slug}/dashboard`} className="hover:text-primary transition-colors">
              {lang === "ar" ? "كورساتي" : "My Courses"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1">{lesson.title}</span>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Video/Content */}
          <div className="lg:col-span-2">
            {/* Video/Content Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
            >
              {isVideo && embedUrl ? (
                <div className="aspect-video bg-black">
                  <iframe
                    key={embedUrl}
                    src={embedUrl}
                    className="w-full h-full"
                    title={lang === "ar" ? "مشغل الفيديو التعليمي" : "Educational video player"}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                    onError={() => setVideoError(true)}
                  />
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <div className="text-center text-white p-4">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
                        <p>{lang === "ar" ? "عذراً، لا يمكن تحميل الفيديو" : "Sorry, cannot load video"}</p>
                        <a 
                          href={lesson.content_link} 
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
                      href={lesson.content_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white"
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
                      href={lesson.content_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white"
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
                {lesson.price && parseFloat(lesson.price) > 0 && (
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{lesson.price} EGP</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar - Info & Actions */}
          <div className="space-y-6">
            {/* Attendance Card */}
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
                    disabled={attendanceLoading}
                    className="w-full py-3 rounded-xl gradient-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {attendanceLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ThumbsUp className="w-5 h-5" />
                    )}
                    {lang === "ar" ? "تأكيد الحضور" : "Confirm Attendance"}
                  </button>
                </>
              )}
            </motion.div>
            
            {/* Exams Section */}
            {hasExams && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-primary" />
                  {lang === "ar" ? "الامتحانات" : "Exams"}
                </h3>
                <div className="space-y-3">
                  {exams.map((exam: any) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      lang={lang}
                      attended={attended}
                      studentId={student?.id}
                      onStart={() => handleStartExam(exam)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Assignments Section */}
            {hasAssignments && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-accent" />
                  {lang === "ar" ? "الواجبات" : "Assignments"}
                </h3>
                <div className="space-y-3">
                  {assignments.map((assignment: any) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      lang={lang}
                      attended={attended}
                      studentId={student?.id}
                      onStart={() => handleStartExam(assignment)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Link
                to={`/${slug}/dashboard`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-all"
              >
                <Arrow className="w-4 h-4" />
                {lang === "ar" ? "العودة" : "Back"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🟢 Exam Card Component مع عرض النتيجة
const ExamCard = ({ exam, lang, attended, studentId, onStart }: any) => {
  const { data: resultData } = useExamResult(exam.id, studentId || 0);
  const hasResult = resultData?.status === true;
  const earnedMarks = hasResult ? resultData?.data?.reduce((sum: number, item: any) => sum + (parseFloat(item.mark) || 0), 0) : 0;
  const totalMarks = exam.total_marks;
  const percentage = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0;
  const passed = percentage >= 50;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        attended 
          ? 'border-primary/30 hover:border-primary bg-primary/5' 
          : 'border-border bg-gray-50 dark:bg-gray-800/50 opacity-70'
      }`}
      onClick={attended ? onStart : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              attended ? 'bg-primary/20' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <FileQuestion className={`w-4 h-4 ${attended ? 'text-primary' : 'text-foreground/40'}`} />
            </div>
            <h4 className="font-semibold">{exam.title}</h4>
          </div>
          
          {/* ✅ عرض النتيجة لو تم الحل */}
          {hasResult && (
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-xs mb-2 ${
              passed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              <Award className="w-3 h-3" />
              <span>{earnedMarks}/{totalMarks} ({percentage.toFixed(0)}%)</span>
              {passed ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            </div>
          )}
          
          <p className="text-xs text-foreground/50 line-clamp-2 mb-2">{exam.description}</p>
          <div className="flex items-center gap-3 text-xs text-foreground/40">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {exam.questions?.length || 0} {lang === "ar" ? "سؤال" : "questions"}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {exam.total_marks} {lang === "ar" ? "درجة" : "marks"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {exam.duration_minutes} {lang === "ar" ? "دقيقة" : "min"}
            </span>
          </div>
        </div>
        {attended ? (
          <button className="px-3 py-1.5 rounded-lg gradient-primary text-white text-xs font-semibold whitespace-nowrap">
            {hasResult ? (lang === "ar" ? "عرض النتيجة" : "View Result") : (lang === "ar" ? "ابدأ الامتحان" : "Start Exam")}
          </button>
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-foreground/40 text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
            <Lock className="w-3 h-3" />
            {lang === "ar" ? "مقفل" : "Locked"}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 🟢 Assignment Card Component مع عرض النتيجة
const AssignmentCard = ({ assignment, lang, attended, studentId, onStart }: any) => {
  const { data: resultData } = useExamResult(assignment.id, studentId || 0);
  const hasResult = resultData?.status === true;
  const earnedMarks = hasResult ? resultData?.data?.reduce((sum: number, item: any) => sum + (parseFloat(item.mark) || 0), 0) : 0;
  const totalMarks = assignment.total_marks;
  const percentage = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        attended 
          ? 'border-accent/30 hover:border-accent bg-accent/5' 
          : 'border-border bg-gray-50 dark:bg-gray-800/50 opacity-70'
      }`}
      onClick={attended ? onStart : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              attended ? 'bg-accent/20' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <ClipboardList className={`w-4 h-4 ${attended ? 'text-accent' : 'text-foreground/40'}`} />
            </div>
            <h4 className="font-semibold">{assignment.title}</h4>
          </div>
          
          {/* ✅ عرض نتيجة الواجب لو تم الحل */}
          {hasResult && (
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-xs mb-2 ${
              percentage >= 50 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              <Award className="w-3 h-3" />
              <span>{earnedMarks}/{totalMarks} ({percentage.toFixed(0)}%)</span>
            </div>
          )}
          
          <p className="text-xs text-foreground/50 line-clamp-2 mb-2">{assignment.description}</p>
          <div className="flex items-center gap-3 text-xs text-foreground/40">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {assignment.questions?.length || 0} {lang === "ar" ? "سؤال" : "questions"}
            </span>
            <span className="flex items-center gap-1">
              <BarChart className="w-3 h-3" />
              {assignment.total_marks} {lang === "ar" ? "درجة" : "marks"}
            </span>
          </div>
        </div>
        {attended ? (
          <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent to-pink-500 text-white text-xs font-semibold whitespace-nowrap">
            {hasResult ? (lang === "ar" ? "عرض النتيجة" : "View Result") : (lang === "ar" ? "حل الواجب" : "Solve Assignment")}
          </button>
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-foreground/40 text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
            <Lock className="w-3 h-3" />
            {lang === "ar" ? "مقفل" : "Locked"}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 🟢 Skeleton Component
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
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;