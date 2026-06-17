/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/ExamPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useExamQuestions, useSubmitExam, useExamResult, useExamDetails } from "@/hooks/useExams";
import { useCurrentStudent } from "@/hooks/useStudent";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, ArrowLeft, ArrowRight, Loader2, CheckCircle, 
  XCircle, AlertCircle, FileQuestion, Award, TrendingUp,
  Send, Shield, Zap, Brain, HelpCircle, BookOpen,
  ChevronDown, ChevronUp, Image as ImageIcon
} from "lucide-react";
import { toast  } from "@/hooks/use-toast";
import FileUploader from "@/components/FileUploader"; // ✅ استيراد الـ FileUploader

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
  const [essayImages, setEssayImages] = useState<Record<number, number[]>>({}); // ✅ تخزين صور المقالي
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const exam = examDetails?.data;
  const questions = questionsData?.data || [];
  const totalQuestions = questions.length;
  const hasResult = resultData?.status === true && resultData?.data?.length > 0;
  const currentLessonId = lessonId || exam?.course_detail_id?.id;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  
  // ✅ دالة لتحديث إجابة السؤال المقالي مع الصور
  const handleEssayAnswer = (questionId: number, text: string, imageIds?: number[]) => {
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: { 
        text, 
        images: imageIds || [] 
      } 
    }));
  };
  
  // ✅ دالة لإضافة صورة للسؤال المقالي
  const handleEssayImageUpload = (questionId: number, imageId: number) => {
    setEssayImages(prev => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), imageId]
    }));
    
    // تحديث الإجابة بالصور
    const currentAnswer = answers[questionId];
    if (currentAnswer) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: {
          ...currentAnswer,
          images: [...(currentAnswer.images || []), imageId]
        }
      }));
    }
  };
  
  // ✅ دالة لحذف صورة من السؤال المقالي
  const handleRemoveEssayImage = (questionId: number, imageId: number) => {
    setEssayImages(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || []).filter(id => id !== imageId)
    }));
    
    const currentAnswer = answers[questionId];
    if (currentAnswer) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: {
          ...currentAnswer,
          images: (currentAnswer.images || []).filter((id: number) => id !== imageId)
        }
      }));
    }
  };
  
  // منع النسخ واللصق أثناء الامتحان
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      if (!submitted && !hasResult) {
        e.preventDefault();
        toast.warning(lang === "ar" ? "النسخ غير مسموح أثناء الامتحان" : "Copying is not allowed during exam");
      }
    };
    document.addEventListener('copy', preventCopy);
    return () => document.removeEventListener('copy', preventCopy);
  }, [submitted, hasResult]);
  
  // تحذير عند مغادرة الصفحة أثناء الامتحان
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitted && !hasResult && answeredCount > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [submitted, hasResult, answeredCount]);
  
  // إعداد المؤقت
  useEffect(() => {
    if (exam?.duration_minutes && !submitted && !hasResult) {
      setTimeLeft(exam.duration_minutes * 60);
    }
  }, [exam, submitted, hasResult]);
  
  // عد تنازلي
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted || hasResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, submitted, hasResult]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      toast.warning(
        lang === "ar" 
          ? `⚠️ الرجاء الإجابة على جميع الأسئلة (${answeredCount}/${totalQuestions})`
          : `⚠️ Please answer all questions (${answeredCount}/${totalQuestions})`
      );
      return;
    }
    
    // ✅ تجهيز الإجابات مع الصور
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
      // إذا كان السؤال مقالي (object مع text و images)
      if (typeof answer === 'object' && answer !== null && 'text' in answer) {
        return {
          question_id: parseInt(questionId),
          answer: answer.text || '',
          images: answer.images || [] // ✅ إضافة الصور
        };
      }
      // الأسئلة العادية (صح/خطأ، اختيار من متعدد)
      return {
        question_id: parseInt(questionId),
        answer: Array.isArray(answer) ? answer.join(',') : answer.toString(),
      };
    });
    
    submitExam({
      examId: parseInt(examId || '0'),
      answers: formattedAnswers,
    }, {
      onSuccess: () => {
        setSubmitted(true);
        setTimeout(() => {
          refetchResult();
        }, 500);
        setTimeout(() => {
          toast.success(
            lang === "ar" 
              ? "🎉 تم حفظ النتيجة بنجاح! جاري العودة للدرس..."
              : "🎉 Result saved successfully! Returning to lesson..."
          );
          if (currentLessonId) {
            navigate(`/${slug}/lesson/${currentLessonId}`);
          } else {
            navigate(`/${slug}/dashboard`);
          }
        }, 2000);
      },
      onError: (error) => {
        console.error("Submit error:", error);
        toast.error(lang === "ar" ? "حدث خطأ في تسليم الامتحان" : "Error submitting exam");
      }
    });
  };
  
  const handleAutoSubmit = () => {
    if (!submitted && !hasResult && answeredCount > 0) {
      toast.warning(lang === "ar" ? "⏰ انتهى الوقت! يتم تسليم الإجابات تلقائياً." : "⏰ Time's up! Submitting automatically.");
      handleSubmit();
    } else if (!submitted && !hasResult && answeredCount === 0) {
      toast.error(lang === "ar" ? "❌ انتهى الوقت دون إجابة!" : "❌ Time's up with no answers!");
      setTimeout(() => {
        if (currentLessonId) {
          navigate(`/${slug}/lesson/${currentLessonId}`);
        } else {
          navigate(`/${slug}/dashboard`);
        }
      }, 2000);
    }
  };
  
  // إذا كان الامتحان قد تم حله مسبقاً
  useEffect(() => {
    if (hasResult && !submitted) {
      toast.info(lang === "ar" ? "📝 لقد قمت بحل هذا الامتحان مسبقاً" : "📝 You have already taken this exam");
      setTimeout(() => {
        if (currentLessonId) {
          navigate(`/${slug}/lesson/${currentLessonId}`);
        } else {
          navigate(`/${slug}/dashboard`);
        }
      }, 1500);
    }
  }, [hasResult, submitted]);
  
  if (detailsLoading || questionsLoading) {
    return <ExamSkeleton lang={lang} />;
  }
  
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Exit Warning Modal - نفس الكود */}
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
                      ? "هل أنت متأكد من مغادرة الامتحان؟ سيتم فقدان إجاباتك الحالية."
                      : "Are you sure you want to leave? Your current answers will be lost."}
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
                        navigate(-1);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold"
                    >
                      {lang === "ar" ? "مغادرة" : "Leave"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header Card - نفس الكود */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <button 
              onClick={() => {
                if (answeredCount > 0 && !submitted && !hasResult) {
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
              {timeLeft !== null && !submitted && !hasResult && (
                <motion.div 
                  animate={timeLeft < 60 ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${
                    timeLeft < 60 ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </motion.div>
              )}
              <div className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium">
                {answeredCount}/{totalQuestions} {lang === "ar" ? "تمت الإجابة" : "answered"}
              </div>
            </div>
          </div>
          
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
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{exam.duration_minutes} {lang === "ar" ? "دقائق" : "minutes"}</span>
              </div>
            )}
          </div>
          
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
              onEssayImageUpload={(imageId: number) => handleEssayImageUpload(q.id, imageId)}
              onRemoveEssayImage={(imageId: number) => handleRemoveEssayImage(q.id, imageId)}
              essayImages={essayImages[q.id] || []}
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
              onClick={handleSubmit}
              disabled={submitting || answeredCount < totalQuestions}
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

// 🟢 Improved Question Card Component مع دعم الصور للمقالي
const QuestionCard = ({ 
  question, 
  index, 
  value, 
  onChange, 
  lang, 
  disabled,
  onEssayImageUpload,
  onRemoveEssayImage,
  essayImages = []
}: any) => {
  const [expanded, setExpanded] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const questionText = lang === "ar" && question.question_ar ? question.question_ar : question.question;
  const isEssay = question.question_type === 'essay';
  
  // ✅ الحصول على نص الإجابة والقيمة
  const answerText = isEssay && value && typeof value === 'object' ? value.text : value;
  const answerImages = isEssay && value && typeof value === 'object' ? value.images || [] : [];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white dark:bg-gray-800/50 rounded-2xl border transition-all duration-300 ${
        value !== undefined && value !== '' && value !== null
          ? 'border-green-500/50 shadow-lg shadow-green-500/10' 
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/30'
      }`}
    >
      {/* Question Header */}
      <div 
        className="p-5 cursor-pointer"
        onClick={() => !disabled && setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
            value !== undefined && value !== '' && value !== null
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
            
            {/* Question Image */}
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
            
            {/* Badges */}
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
          
          {/* Status Icon */}
          {value !== undefined && value !== '' && value !== null && (
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          )}
        </div>
      </div>
      
      {/* Answer Area */}
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
                <div className="space-y-4">
                  <textarea
                    value={answerText || ''}
                    onChange={(e) => {
                      if (isEssay) {
                        onChange({ text: e.target.value, images: answerImages });
                      } else {
                        onChange(e.target.value);
                      }
                    }}
                    className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-y transition-all"
                    rows={6}
                    placeholder={lang === "ar" 
                      ? "✍️ اكتب إجابتك بالتفصيل هنا..." 
                      : "✍️ Write your detailed answer here..."}
                  />
                  
                  {/* ✅ زر رفع الصور للمقالي */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImageUpload(!showImageUpload)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all text-sm"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {lang === "ar" ? "إضافة صورة" : "Add Image"}
                    </button>
                    
                    {/* عرض عدد الصور المرفوعة */}
                    {answerImages.length > 0 && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        ✅ {answerImages.length} {lang === "ar" ? "صورة مرفوعة" : "images uploaded"}
                      </span>
                    )}
                  </div>
                  
                  {/* ✅ FileUploader للصور المقالية */}
                  {showImageUpload && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <FileUploader
                        label={lang === "ar" ? "📷 رفع صورة للإجابة" : "📷 Upload image for answer"}
                        onUploadSuccess={(imageId: number) => {
                          if (onEssayImageUpload) {
                            onEssayImageUpload(imageId);
                          }
                          toast.success(lang === "ar" ? "تم رفع الصورة بنجاح" : "Image uploaded successfully");
                          // تحديث الإجابة
                          const newImages = [...answerImages, imageId];
                          onChange({ text: answerText || '', images: newImages });
                        }}
                        multiple={true}
                        accept="image/*"
                        preview={true}
                        uniqueId={`essay-upload-${question.id}`}
                        maxFiles={5}
                      />
                    </motion.div>
                  )}
                  
                  {/* ✅ عرض الصور المرفوعة للإجابة */}
                  {answerImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {answerImages.map((imgId: number, idx: number) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={`https://lms.dentin.cloud/api/media/${imgId}`} 
                            alt={`Answer image ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-image.jpg';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (onRemoveEssayImage) {
                                onRemoveEssayImage(imgId);
                              }
                              // تحديث الإجابة
                              const newImages = answerImages.filter((id: number) => id !== imgId);
                              onChange({ text: answerText || '', images: newImages });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XCircle className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 🟢 Skeleton Component (نفس الكود)
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