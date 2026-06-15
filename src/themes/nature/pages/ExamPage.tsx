/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/ExamPage.tsx - مع ساعة عقارب متحركة
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useExamQuestions, useSubmitExam, useExamResult, useExamDetails } from "@/hooks/useExams";
import { useAutoSubmitOnLeave } from '@/hooks/useAutoSubmitOnLeave';
import { useCurrentStudent } from "@/hooks/useStudent";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Clock, ArrowLeft, ArrowRight, Loader2, CheckCircle, 
  XCircle, AlertCircle, FileQuestion, Award, TrendingUp,
  Send, Shield, Zap, Brain, HelpCircle, BookOpen,
  ChevronDown, ChevronUp, Timer, AlarmClock, Hourglass
} from "lucide-react";
import { toast } from "sonner";

// ✅ Improved Analog Clock Component - شكل أنيق وجميل
const AnalogClock = ({ timeLeft, totalSeconds }: { timeLeft: number; totalSeconds: number }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // الزوايا
  const minuteAngle = ((minutes % 60) / 60) * 360;
  const secondAngle = (seconds / 60) * 360;
  const hourAngle = ((minutes / 60) / 12) * 360;
  
  const remainingPercentage = (timeLeft / totalSeconds) * 100;
  
  // لون الدائرة حسب الوقت
  const getClockColor = () => {
    if (remainingPercentage <= 10) return '#ef4444'; // أحمر
    if (remainingPercentage <= 25) return '#f97316'; // برتقالي
    if (remainingPercentage <= 50) return '#eab308'; // أصفر
    return '#10b981'; // أخضر
  };
  
  const clockColor = getClockColor();
  
  if (!mounted) return null;
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Clock Container */}
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        {/* Outer Glow */}
        <div 
          className="absolute inset-0 rounded-full opacity-20 animate-pulse"
          style={{ 
            backgroundColor: clockColor,
            filter: 'blur(8px)'
          }}
        />
        
        {/* Main Clock Face */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Outer Ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
            className="dark:stroke-gray-700"
          />
          
          {/* Progress Arc */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={clockColor}
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 46}`}
            strokeDashoffset={`${2 * Math.PI * 46 * (1 - remainingPercentage / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
          
          {/* Inner Circle Background */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="white"
            fillOpacity="0.1"
            className="dark:fill-gray-800"
          />
          
          {/* Clock Marks (12, 3, 6, 9) */}
          <line x1="50" y1="8" x2="50" y2="14" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="50" x2="86" y2="50" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="92" x2="50" y2="86" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="50" x2="14" y2="50" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          
          {/* Small Marks for each 5 minutes */}
          {[1, 2, 4, 5, 7, 8, 10, 11].map((i) => {
            const angle = (i * 30) - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 38 * Math.cos(rad);
            const y1 = 50 + 38 * Math.sin(rad);
            const x2 = 50 + 42 * Math.cos(rad);
            const y2 = 50 + 42 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="dark:stroke-gray-600"
              />
            );
          })}
          
          {/* ✅ Minute Hand (عقرب الدقائق) - سميك وواضح */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="22"
            stroke={clockColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-300"
            style={{ 
              transform: `rotate(${minuteAngle}deg)`,
              transformOrigin: '50% 50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          
          {/* ✅ Second Hand (عقرب الثواني) - رفيع وأحمر مع نقطة */}
          <line
            x1="50"
            y1="60"
            x2="50"
            y2="18"
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="transition-all duration-100"
            style={{ 
              transform: `rotate(${secondAngle}deg)`,
              transformOrigin: '50% 60%'
            }}
          />
          
          {/* Second Hand Counter Weight */}
          <circle
            cx="50"
            cy="62"
            r="3"
            fill="#ef4444"
            className="transition-all duration-100"
            style={{ 
              transform: `rotate(${secondAngle}deg)`,
              transformOrigin: '50% 60%'
            }}
          />
          
          {/* ✅ Hour Hand (عقرب الساعات) - قصير وسميك */}
          <line
            x1="50"
            y1="55"
            x2="50"
            y2="30"
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
            className="dark:stroke-gray-400 transition-all duration-300"
            style={{ 
              transform: `rotate(${hourAngle}deg)`,
              transformOrigin: '50% 55%'
            }}
          />
          
          {/* Center Pin */}
          <circle cx="50" cy="50" r="3" fill={clockColor} />
          <circle cx="50" cy="50" r="1.5" fill="white" />
        </svg>
        
        {/* Warning Pulse when time is low */}
        {remainingPercentage <= 10 && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-30" 
               style={{ backgroundColor: clockColor, animationDuration: '1s' }} />
        )}
      </div>
      
      {/* Digital Time Display */}
      <div className="mt-2 text-center">
        <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded-lg ${
          remainingPercentage <= 10 ? 'text-red-500 bg-red-50 dark:bg-red-950/30' :
          remainingPercentage <= 25 ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' :
          'text-primary bg-primary/10'
        }`}>
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
// ✅ Main ExamPage Component
const ExamPage = () => {
  const { lang, dir } = useLang();
  const { slug, examId, lessonId } = useParams();
  const navigate = useNavigate();
  const { student } = useCurrentStudent();
  const { data: examDetails, isLoading: detailsLoading } = useExamDetails(parseInt(examId || '0'));
  const { data: questionsData, isLoading: questionsLoading } = useExamQuestions(parseInt(examId || '0'));
  const { mutate: submitExam, isPending: submitting } = useSubmitExam();
  
  const { data: resultData, refetch: refetchResult } = useExamResult(
    parseInt(examId || '0'), 
    student?.id || 0
  );
  
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const exam = examDetails?.data;
  const questions = questionsData?.data || [];
  const totalQuestions = questions.length;
  const hasResult = resultData?.status === true && resultData?.data?.length > 0;
  const currentLessonId = lessonId || exam?.course_detail_id?.id;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const totalSeconds = exam?.duration_minutes ? exam.duration_minutes * 60 : 0;
  
  // ✅ دالة تقديم الامتحان (تُعرَّف أولاً)
  const handleSubmitExam = useCallback(async (isAutoSubmit = false) => {
    if (autoSubmitTriggered || submitted || hasResult || hasAutoSubmitted) {
      console.log("❌ Submit prevented - already submitted");
      return;
    }
    
    console.log("📝 Starting exam submission... Auto? ", isAutoSubmit);
    
    setAutoSubmitTriggered(true);
    setHasAutoSubmitted(true);
    
    const hasAnyAnswer = answeredCount > 0;
    let formattedAnswers: any[] = [];
    
    if (hasAnyAnswer) {
      formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        answer: Array.isArray(answer) ? answer.join(',') : answer.toString(),
      }));
      console.log(`📤 Submitting ${formattedAnswers.length} answers`);
    } else {
      console.log("📤 No answers to submit - submitting empty array");
    }
    
    if (isAutoSubmit) {
      toast.warning(
        lang === "ar" 
          ? "⏰ تم تسليم الامتحان تلقائياً"
          : "⏰ Exam submitted automatically"
      );
    }
    
    localStorage.removeItem(`exam_timer_${examId}`);
    
    submitExam({
      examId: parseInt(examId || '0'),
      answers: formattedAnswers,
    }, {
      onSuccess: () => {
        console.log("✅ Exam submitted successfully!");
        setSubmitted(true);
        
        setTimeout(() => refetchResult(), 500);
        
        setTimeout(() => {
          if (!isAutoSubmit) {
            toast.success(
              lang === "ar" 
                ? "🎉 تم حفظ النتيجة بنجاح! جاري العودة للدرس..."
                : "🎉 Result saved successfully! Returning to lesson..."
            );
          }
          if (currentLessonId) {
            navigate(`/${slug}/lesson/${currentLessonId}`);
          } else {
            navigate(`/${slug}/dashboard`);
          }
        }, isAutoSubmit ? 1000 : 2000);
      },
      onError: (error) => {
        console.error("❌ Submit error:", error);
        setAutoSubmitTriggered(false);
        setHasAutoSubmitted(false);
        localStorage.removeItem(`exam_submitted_${examId}`);
        toast.error(
          lang === "ar" 
            ? "حدث خطأ في تسليم الامتحان، يرجى المحاولة مرة أخرى" 
            : "Error submitting exam, please try again"
        );
      }
    });
  }, [answers, answeredCount, autoSubmitTriggered, examId, hasResult, lang, navigate, refetchResult, slug, submitExam, submitted, currentLessonId, hasAutoSubmitted]);
  
  // ✅ ✅ ✅ هنا حط الـ Hooks (بعد تعريف الدالة، قبل الـ useEffects)
const shouldAutoSubmit = !submitted && !hasResult && !hasAutoSubmitted && timeLeft !== null && timeLeft > 0;
  
  useAutoSubmitOnLeave({
    shouldSubmit: shouldAutoSubmit,
    onSubmit: () => {
      console.log("🔥 Auto-submit triggered by leave event!");
      handleSubmitExam(true);
    },
    delay: 500,
  });
  
useAutoSubmitOnLeave({
  shouldSubmit: shouldAutoSubmit,
  onSubmit: () => {
    console.log("🔥 Auto-submit triggered by leave event!");
    handleSubmitExam(true);
  },
  delay: 500,
});
  
  // ✅ باقي الـ useEffects (منع النسخ، المؤقت، العد التنازلي، إلخ)
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      if (!submitted && !hasResult) {
        e.preventDefault();
        toast.warning(lang === "ar" ? "النسخ غير مسموح أثناء الامتحان" : "Copying is not allowed during exam");
      }
    };
    document.addEventListener('copy', preventCopy);
    return () => document.removeEventListener('copy', preventCopy);
  }, [submitted, hasResult, lang]);
  
  // ✅ إعداد المؤقت
  useEffect(() => {
    if (exam?.duration_minutes && !submitted && !hasResult) {
      const savedTime = localStorage.getItem(`exam_timer_${examId}`);
      if (savedTime && parseInt(savedTime) > 0 && parseInt(savedTime) < exam.duration_minutes * 60) {
        setTimeLeft(parseInt(savedTime));
      } else {
        setTimeLeft(exam.duration_minutes * 60);
      }
    }
  }, [exam, submitted, hasResult, examId]);
  
  // ✅ حفظ الوقت المتبقي
  useEffect(() => {
    if (timeLeft !== null && !submitted && !hasResult && !hasAutoSubmitted) {
      localStorage.setItem(`exam_timer_${examId}`, timeLeft.toString());
    }
  }, [timeLeft, submitted, hasResult, examId, hasAutoSubmitted]);
  
  // ✅ عد تنازلي
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted || hasResult || hasAutoSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, submitted, hasResult, hasAutoSubmitted, handleSubmitExam]);
  
  // ✅ تنظيف localStorage بعد الانتهاء
  useEffect(() => {
    if (submitted || hasResult) {
      localStorage.removeItem(`exam_timer_${examId}`);
    }
  }, [submitted, hasResult, examId]);
  
  // ✅ إذا كان الامتحان قد تم حله مسبقاً
  useEffect(() => {
    if (hasResult && !submitted && !hasAutoSubmitted) {
      toast.info(lang === "ar" ? "📝 لقد قمت بحل هذا الامتحان مسبقاً" : "📝 You have already taken this exam");
      setTimeout(() => {
        if (currentLessonId) {
          navigate(`/${slug}/lesson/${currentLessonId}`);
        } else {
          navigate(`/${slug}/dashboard`);
        }
      }, 1500);
    }
  }, [hasResult, submitted, hasAutoSubmitted, currentLessonId, slug, navigate, lang]);
  
  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleManualSubmit = () => {
    if (answeredCount < totalQuestions) {
      toast.warning(
        lang === "ar" 
          ? `⚠️ الرجاء الإجابة على جميع الأسئلة (${answeredCount}/${totalQuestions})`
          : `⚠️ Please answer all questions (${answeredCount}/${totalQuestions})`
      );
      return;
    }
    handleSubmitExam(false);
  };
  
  if (detailsLoading || questionsLoading) {
    return <ExamSkeleton lang={lang} />;
  }
  
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Exit Warning Modal */}
        <AnimatePresence>
          {showExitWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowExitWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {lang === "ar" ? "تحذير!" : "Warning!"}
                  </h3>
                  <p className="text-foreground/60 mb-6">
                    {lang === "ar" 
                      ? "هل أنت متأكد من مغادرة الامتحان؟ سيتم تسليم الإجابات الحالية تلقائياً."
                      : "Are you sure you want to leave? Your current answers will be submitted automatically."}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowExitWarning(false)}
                      className="flex-1 px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold"
                    >
                      {lang === "ar" ? "متابعة الامتحان" : "Continue Exam"}
                    </button>
                    <button
                      onClick={() => {
                        setShowExitWarning(false);
                        handleSubmitExam(true);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold"
                    >
                      {lang === "ar" ? "مغادرة وتقديم" : "Leave & Submit"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <button 
              onClick={() => {
                if (answeredCount > 0 && !submitted && !hasResult && !hasAutoSubmitted) {
                  setShowExitWarning(true);
                } else {
                  navigate(-1);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-foreground/70 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Arrow className="w-4 h-4" />
              <span className="text-sm font-medium">{lang === "ar" ? "العودة" : "Back"}</span>
            </button>
            
            <div className="flex items-center gap-3">
              {/* ✅ Analog Clock */}
              {timeLeft !== null && !submitted && !hasResult && (
                <AnalogClock timeLeft={timeLeft} totalSeconds={totalSeconds} />
              )}
              
              {/* Progress Badge */}
              <div className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium">
                {answeredCount}/{totalQuestions} {lang === "ar" ? "تمت الإجابة" : "answered"}
              </div>
            </div>
          </div>
          
          {/* Exam Info */}
          <div className="text-center mb-6">
            {exam?.image?.fullUrl && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg"
              >
                <img src={exam.image.fullUrl} alt={exam.title} className="w-full h-full object-cover" />
              </motion.div>
            )}
            
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {exam?.title}
            </h1>
            <p className="text-foreground/50 mt-2 max-w-xl mx-auto">{exam?.description}</p>
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <FileQuestion className="w-4 h-4 text-primary" />
              <span>{totalQuestions} {lang === "ar" ? "أسئلة" : "questions"}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{exam?.total_marks} {lang === "ar" ? "درجة" : "marks"}</span>
            </div>
            {exam?.duration_minutes && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <Hourglass className="w-4 h-4 text-blue-500" />
                <span>{exam.duration_minutes} {lang === "ar" ? "دقائق" : "minutes"}</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {!submitted && !hasResult && totalQuestions > 0 && (
            <div className="mt-6">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q: any, idx: number) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              value={answers[q.id]}
              onChange={(answer: any) => handleAnswer(q.id, answer)}
              lang={lang}
              disabled={submitted || hasResult}
            />
          ))}
        </div>
        
        {/* Submit Button */}
        {!submitted && !hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={handleManualSubmit}
              disabled={submitting}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>{lang === "ar" ? "تسليم الامتحان" : "Submit Exam"}</span>
                  <Shield className="w-5 h-5 opacity-50" />
                </>
              )}
            </button>
          </motion.div>
        )}
        
        {/* Security Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-foreground/30 mt-8 flex items-center justify-center gap-1"
        >
          <Shield className="w-3 h-3" />
          {lang === "ar" 
            ? "بياناتك آمنة ومشفرة • يمنع النسخ أثناء الامتحان"
            : "Your data is secure and encrypted • Copying is prohibited during exam"}
        </motion.p>
      </div>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, index, value, onChange, lang, disabled }: any) => {
  const [expanded, setExpanded] = useState(true);
  const questionText = lang === "ar" && question.question_ar ? question.question_ar : question.question;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white dark:bg-gray-800/50 rounded-2xl border transition-all duration-300 ${
        value !== undefined 
          ? 'border-green-500/50 shadow-lg shadow-green-500/10' 
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/30'
      }`}
    >
      <div 
        className="p-5 cursor-pointer"
        onClick={() => !disabled && setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
            value !== undefined 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gradient-to-r from-primary to-primary/70'
          }`}>
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-lg leading-relaxed">{questionText}</p>
              {!disabled && (
                <button className="text-foreground/40 hover:text-primary transition-colors">
                  {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              )}
            </div>
            
            {question.image?.fullUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3"
              >
                <img 
                  src={question.image.fullUrl} 
                  alt="Question" 
                  className="max-h-48 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
                />
              </motion.div>
            )}
            
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs">
                <Award className="w-3 h-3" />
                {question.mark} {lang === "ar" ? "درجة" : "marks"}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs capitalize">
                <HelpCircle className="w-3 h-3" />
                {question.question_type === 'true_false' 
                  ? (lang === "ar" ? "صح/خطأ" : "True/False") 
                  : question.question_type === 'multiple_choice' 
                    ? (lang === "ar" ? "اختيار من متعدد" : "Multiple Choice") 
                    : (lang === "ar" ? "مقالي" : "Essay")}
              </span>
            </div>
          </div>
          
          {value !== undefined && (
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && !disabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700 mt-2">
              {question.question_type === 'true_false' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => onChange('true')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      value === 'true' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-800 text-foreground/70 hover:bg-primary/10'
                    }`}
                  >
                    ✅ {lang === "ar" ? "صحيح" : "True"}
                  </button>
                  <button
                    onClick={() => onChange('false')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      value === 'false' 
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-800 text-foreground/70 hover:bg-primary/10'
                    }`}
                  >
                    ❌ {lang === "ar" ? "خطأ" : "False"}
                  </button>
                </div>
              )}
              
              {question.question_type === 'multiple_choice' && question.options && (
                <div className="grid gap-3">
                  {question.options.map((opt: any, optIdx: number) => (
                    <button
                      key={opt.id}
                      onClick={() => onChange(opt.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${
                        value === opt.id 
                          ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md' 
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary/10'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        value === opt.id 
                          ? 'bg-white text-primary' 
                          : 'bg-gray-300 dark:bg-gray-600 text-foreground/70'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span>{opt.option_text}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {question.question_type === 'essay' && (
                <textarea
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-y transition-all"
                  rows={6}
                  placeholder={lang === "ar" 
                    ? "✍️ اكتب إجابتك بالتفصيل هنا..." 
                    : "✍️ Write your detailed answer here..."}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Exam Skeleton Component
const ExamSkeleton = ({ lang }: { lang: string }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="h-8 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 animate-pulse" />
            <div className="h-4 w-96 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-3 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <div className="h-14 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ExamPage;